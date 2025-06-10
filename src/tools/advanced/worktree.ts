import { BaseTool } from '../base.js';
import { GitWorktreeArgs, GitWorktreeSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { validatePath } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';

export class GitWorktreeTool extends BaseTool<GitWorktreeArgs> {
  name = 'git_worktree';
  description = 'Manage multiple working trees';
  inputSchema = GitWorktreeSchema;
  
  protected async execute(args: GitWorktreeArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { command, worktreePath, branch, commitish, force, reason, newPath } = args;
    
    const git = createGitInstance(workingDir);
    
    switch (command) {
      case 'list': {
        const result = await git.raw(['worktree', 'list', '--porcelain']);
        if (!result) {
          return 'No worktrees found';
        }
        return result;
      }
      
      case 'add': {
        if (!worktreePath) {
          throw new Error('Worktree path is required for add');
        }
        validatePath(worktreePath);
        
        const options: string[] = ['worktree', 'add'];
        if (force) options.push('-f');
        if (branch) options.push('-b', branch);
        
        options.push(worktreePath);
        if (commitish) options.push(commitish);
        
        await git.raw(options);
        return `Created worktree at: ${worktreePath}`;
      }
      
      case 'remove': {
        if (!worktreePath) {
          throw new Error('Worktree path is required for remove');
        }
        
        const options = ['worktree', 'remove'];
        if (force) options.push('--force');
        options.push(worktreePath);
        
        await git.raw(options);
        return `Removed worktree: ${worktreePath}`;
      }
      
      case 'move': {
        if (!worktreePath || !newPath) {
          throw new Error('Both current and new paths are required for move');
        }
        validatePath(newPath);
        
        await git.raw(['worktree', 'move', worktreePath, newPath]);
        return `Moved worktree from ${worktreePath} to ${newPath}`;
      }
      
      case 'lock': {
        if (!worktreePath) {
          throw new Error('Worktree path is required for lock');
        }
        
        const options = ['worktree', 'lock'];
        if (reason) options.push('--reason', reason);
        options.push(worktreePath);
        
        await git.raw(options);
        return `Locked worktree: ${worktreePath}`;
      }
      
      case 'unlock': {
        if (!worktreePath) {
          throw new Error('Worktree path is required for unlock');
        }
        
        await git.raw(['worktree', 'unlock', worktreePath]);
        return `Unlocked worktree: ${worktreePath}`;
      }
      
      case 'prune': {
        await git.raw(['worktree', 'prune']);
        return 'Pruned stale worktrees';
      }
      
      default:
        throw new Error(`Unknown worktree command: ${command}`);
    }
  }
}
