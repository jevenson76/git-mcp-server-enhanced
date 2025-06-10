import { BaseTool } from '../base.js';
import { GitStashArgs, GitStashSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitStashTool extends BaseTool<GitStashArgs> {
  name = 'git_stash';
  description = 'Stash the changes in a dirty working directory away';
  inputSchema = GitStashSchema;
  
  protected async execute(args: GitStashArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { command, message, includeUntracked, keepIndex, patch, stash } = args;
    
    const git = createGitInstance(workingDir);
    
    switch (command) {
      case 'push': {
        const options: string[] = [];
        if (message) options.push('-m', message);
        if (includeUntracked) options.push('--include-untracked');
        if (keepIndex) options.push('--keep-index');
        if (patch) options.push('--patch');
        
        await git.stash(['push', ...options]);
        return 'Stashed working directory and index state';
      }
      
      case 'pop': {
        await git.stash(['pop', stash || '0']);
        return 'Applied and removed stash';
      }
      
      case 'apply': {
        await git.stash(['apply', stash || '0']);
        return 'Applied stash (kept in stash list)';
      }
      
      case 'drop': {
        await git.stash(['drop', stash || '0']);
        return 'Dropped stash';
      }
      
      case 'list': {
        const result = await git.stash(['list']);
        return result || 'No stashes found';
      }
      
      case 'show': {
        const result = await git.stash(['show', '-p', stash || '0']);
        return result;
      }
      
      case 'clear': {
        await git.stash(['clear']);
        return 'Cleared all stashes';
      }
      
      default:
        throw new Error(`Unknown stash command: ${command}`);
    }
  }
}
