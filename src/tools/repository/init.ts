import { BaseTool } from '../base.js';
import { GitInitArgs, GitInitSchema } from '../../types/index.js';
import { createGitInstance } from '../../utils/git.js';
import { validatePath } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import { config } from '../../config/index.js';
import fs from 'fs/promises';
import path from 'path';

export class GitInitTool extends BaseTool<GitInitArgs> {
  name = 'git_init';
  description = 'Initialize a new Git repository';
  inputSchema = GitInitSchema;
  
  protected async execute(args: GitInitArgs, sessionManager: SessionManager): Promise<string> {
    const { path: repoPath, bare, initialBranch, quiet } = args;
    
    // Validate path
    validatePath(repoPath);
    
    // Ensure directory exists
    await fs.mkdir(repoPath, { recursive: true });
    
    // Create git instance
    const git = createGitInstance(repoPath);
    
    // Initialize repository
    const initOptions: string[] = [];
    
    if (bare) {
      initOptions.push('--bare');
    }
    
    if (initialBranch) {
      initOptions.push('--initial-branch', initialBranch);
    } else if (config.git.defaultBranch) {
      initOptions.push('--initial-branch', config.git.defaultBranch);
    }
    
    if (quiet) {
      initOptions.push('--quiet');
    }
    
    await git.init(initOptions);
    
    const absolutePath = path.resolve(repoPath);
    const message = bare ? 
      `Initialized bare Git repository in ${absolutePath}` :
      `Initialized Git repository in ${absolutePath}/.git`;
    
    return message;
  }
}
