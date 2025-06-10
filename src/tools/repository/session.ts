import { BaseTool } from '../base.js';
import { SessionWorkingDirArgs, SessionWorkingDirSchema } from '../../types/index.js';
import { isGitRepository } from '../../utils/git.js';
import { validatePath } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import fs from 'fs/promises';
import path from 'path';

export class SetWorkingDirTool extends BaseTool<SessionWorkingDirArgs> {
  name = 'git_set_working_dir';
  description = 'Set the default working directory for Git operations in this session';
  inputSchema = SessionWorkingDirSchema;
  
  protected async execute(args: SessionWorkingDirArgs, sessionManager: SessionManager): Promise<string> {
    const { path: dirPath, validateGitRepo } = args;
    
    // Validate path
    validatePath(dirPath);
    
    // Check if path exists
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        throw new Error(`Not a directory: ${dirPath}`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(`Directory does not exist: ${dirPath}`);
      }
      throw error;
    }
    
    // Validate it's a git repository if requested
    if (validateGitRepo) {
      const isRepo = await isGitRepository(dirPath);
      if (!isRepo) {
        throw new Error(`Not a git repository: ${dirPath}`);
      }
    }
    
    // Set the working directory
    const absolutePath = path.resolve(dirPath);
    sessionManager.setWorkingDirectory(absolutePath);
    
    return `Set working directory to: ${absolutePath}`;
  }
}

export class ClearWorkingDirTool extends BaseTool<{}> {
  name = 'git_clear_working_dir';
  description = 'Clear the session working directory';
  
  protected async execute(_args: {}, sessionManager: SessionManager): Promise<string> {
    sessionManager.clearWorkingDirectory();
    return 'Cleared session working directory';
  }
}
