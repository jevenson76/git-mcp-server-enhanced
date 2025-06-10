import { BaseTool } from '../base.js';
import { GitBlameArgs, GitBlameSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitBlameTool extends BaseTool<GitBlameArgs> {
  name = 'git_blame';
  description = 'Show what revision and author last modified each line of a file';
  inputSchema = GitBlameSchema;
  
  protected async execute(args: GitBlameArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { file, startLine, endLine, reverse, showEmail, showTime, ignoreWhitespace } = args;
    
    const git = createGitInstance(workingDir);
    
    // Build blame options
    const blameOptions: string[] = [];
    
    if (startLine && endLine) {
      blameOptions.push(`-L${startLine},${endLine}`);
    }
    
    if (reverse) {
      blameOptions.push('--reverse');
    }
    
    if (showEmail) {
      blameOptions.push('-e');
    }
    
    if (showTime) {
      blameOptions.push('-t');
    }
    
    if (ignoreWhitespace) {
      blameOptions.push('-w');
    }
    
    // Execute blame
    const cmdArgs = ['blame', ...blameOptions, '--', file];
    const result = await git.raw(cmdArgs);
    
    return result;
  }
}
