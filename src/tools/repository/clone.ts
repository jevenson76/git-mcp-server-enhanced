import { BaseTool } from '../base.js';
import { GitCloneArgs, GitCloneSchema } from '../../types/index.js';
import { createGitInstance } from '../../utils/git.js';
import { validatePath, validateRemoteUrl } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import fs from 'fs/promises';
import path from 'path';

export class GitCloneTool extends BaseTool<GitCloneArgs> {
  name = 'git_clone';
  description = 'Clone a repository into a new directory';
  inputSchema = GitCloneSchema;
  
  protected async execute(args: GitCloneArgs, sessionManager: SessionManager): Promise<string> {
    const { url, path: targetPath, branch, depth, recursive, quiet } = args;
    
    // Validate inputs
    validateRemoteUrl(url);
    validatePath(targetPath);
    
    // Check if target directory already exists
    try {
      const stats = await fs.stat(targetPath);
      if (stats.isDirectory()) {
        const files = await fs.readdir(targetPath);
        if (files.length > 0) {
          throw new Error(`Target directory is not empty: ${targetPath}`);
        }
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    
    // Ensure parent directory exists
    const parentDir = path.dirname(targetPath);
    await fs.mkdir(parentDir, { recursive: true });
    
    // Create git instance for parent directory
    const git = createGitInstance(parentDir);
    
    // Build clone options
    const cloneOptions: string[] = [];
    
    if (branch) {
      cloneOptions.push('--branch', branch);
    }
    
    if (depth) {
      cloneOptions.push('--depth', depth.toString());
    }
    
    if (recursive) {
      cloneOptions.push('--recursive');
    }
    
    if (quiet) {
      cloneOptions.push('--quiet');
    }
    
    // Clone the repository
    await git.clone(url, path.basename(targetPath), cloneOptions);
    
    const absolutePath = path.resolve(targetPath);
    return `Cloned repository from ${url} to ${absolutePath}`;
  }
}
