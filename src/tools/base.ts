import { z } from 'zod';
import { SessionManager } from '../utils/session.js';
import { logger } from '../utils/logger.js';
import { ToolError } from '../utils/errors.js';

export interface ToolContext {
  sessionManager: SessionManager;
  sessionId?: string;
}

export interface ToolDefinition<T = any> {
  name: string;
  description: string;
  inputSchema?: z.ZodSchema<T>;
  handler: (args: T, sessionManager: SessionManager) => Promise<string>;
}

export abstract class BaseTool<T = any> implements ToolDefinition<T> {
  abstract name: string;
  abstract description: string;
  abstract inputSchema?: z.ZodSchema<T>;
  
  async handler(args: T, sessionManager: SessionManager): Promise<string> {
    try {
      logger.debug(`Executing tool: ${this.name}`, { args });
      const result = await this.execute(args, sessionManager);
      logger.debug(`Tool ${this.name} completed successfully`);
      return result;
    } catch (error) {
      logger.error(`Tool ${this.name} failed:`, error);
      throw new ToolError(
        `Failed to execute ${this.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.name,
        error instanceof Error ? error : undefined
      );
    }
  }
  
  protected abstract execute(args: T, sessionManager: SessionManager): Promise<string>;
  
  protected getWorkingDirectory(args: any, sessionManager: SessionManager): string {
    // Priority: args.path > session working directory > current directory
    if (args.path) {
      return args.path;
    }
    
    const sessionWorkingDir = sessionManager.getWorkingDirectory(args.sessionId);
    if (sessionWorkingDir) {
      return sessionWorkingDir;
    }
    
    return process.cwd();
  }
}
