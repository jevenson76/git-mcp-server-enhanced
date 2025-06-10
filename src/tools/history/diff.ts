import { BaseTool } from '../base.js';
import { GitDiffArgs, GitDiffSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';
import { config } from '../../config/index.js';

export class GitDiffTool extends BaseTool<GitDiffArgs> {
  name = 'git_diff';
  description = 'Show changes between commits, commit and working tree, etc';
  inputSchema = GitDiffSchema;
  
  protected async execute(args: GitDiffArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { 
      ref1, 
      ref2, 
      staged, 
      cached, 
      nameOnly, 
      nameStatus, 
      stat, 
      numstat, 
      shortstat, 
      files, 
      unified 
    } = args;
    
    const git = createGitInstance(workingDir);
    
    // Build diff options
    const diffOptions: string[] = [];
    
    if (staged || cached) {
      diffOptions.push('--cached');
    }
    
    if (nameOnly) {
      diffOptions.push('--name-only');
    } else if (nameStatus) {
      diffOptions.push('--name-status');
    } else if (stat) {
      diffOptions.push('--stat');
    } else if (numstat) {
      diffOptions.push('--numstat');
    } else if (shortstat) {
      diffOptions.push('--shortstat');
    }
    
    if (unified !== undefined) {
      diffOptions.push(`--unified=${unified}`);
    }
    
    // Build command
    const cmdArgs = ['diff', ...diffOptions];
    
    if (ref1) {
      cmdArgs.push(ref1);
      if (ref2) {
        cmdArgs.push(ref2);
      }
    }
    
    if (files?.length) {
      cmdArgs.push('--');
      cmdArgs.push(...files);
    }
    
    // Execute diff
    const result = await git.raw(cmdArgs);
    
    if (!result.trim()) {
      if (staged || cached) {
        return 'No staged changes';
      }
      return 'No changes';
    }
    
    // Check diff size
    if (result.length > config.git.maxDiffSize) {
      const truncated = result.substring(0, config.git.maxDiffSize);
      return `${truncated}\n\n... Output truncated (exceeded ${config.git.maxDiffSize} bytes) ...`;
    }
    
    return result;
  }
}
