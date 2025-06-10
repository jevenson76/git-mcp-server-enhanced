import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { logger } from './utils/logger.js';
import { registerTools } from './tools/index.js';
import { SessionManager } from './utils/session.js';
import { config } from './config/index.js';
import { ToolError, formatError } from './utils/errors.js';

interface ExtendedServer extends Server {
  tools?: Map<string, Tool>;
  toolHandlers?: Map<string, (args: any, sessionManager: SessionManager) => Promise<string>>;
}

export function createGitServer(): Server {
  const server = new Server(
    {
      name: 'git-mcp-server-enhanced',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  ) as ExtendedServer;

  // Initialize tool storage
  server.tools = new Map();
  server.toolHandlers = new Map();
  
  // Add helper methods
  (server as any).addTool = function(
    tool: Tool,
    handler: (args: any, sessionManager: SessionManager) => Promise<string>
  ) {
    this.tools.set(tool.name, tool);
    this.toolHandlers.set(tool.name, handler);
  };
  
  (server as any).getTools = function() {
    return this.tools;
  };
  
  (server as any).getTool = function(name: string) {
    return {
      ...this.tools.get(name),
      handler: this.toolHandlers.get(name),
    };
  };

  const sessionManager = new SessionManager();
  
  // Register all tools
  registerTools(server as any, sessionManager);
  
  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = Array.from(server.tools?.values() || []);
    logger.debug(`Listing ${tools.length} tools`);
    return { tools };
  });
  
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      logger.debug(`Calling tool: ${name}`, { args });
      
      const handler = server.toolHandlers?.get(name);
      if (!handler) {
        throw new ToolError(`Tool not found: ${name}`, name);
      }
      
      // Execute the tool
      const result = await handler(args || {}, sessionManager);
      
      logger.debug(`Tool ${name} completed successfully`);
      
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        throw new ToolError(`Invalid arguments: ${issues}`, name, error);
      }
      
      if (error instanceof ToolError) {
        throw error;
      }
      
      throw new ToolError(
        formatError(error),
        name,
        error instanceof Error ? error : undefined
      );
    }
  });
  
  return server;
}
