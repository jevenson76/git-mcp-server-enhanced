import { BaseTool } from '../base.js';
import { GitStatusArgs, GitStatusSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitStatusTool extends BaseTool<GitStatusArgs> {
  name = 'git_status';
  description = 'Show the working tree status';
  inputSchema = GitStatusSchema;
  
  protected async execute(args: GitStatusArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const git = createGitInstance(workingDir);
    const status = await git.status();
    
    // Format status output
    const lines: string[] = [];
    
    lines.push(`On branch ${status.current || 'unknown'}`);
    
    if (status.tracking) {
      lines.push(`Your branch is tracking '${status.tracking}'`);
      
      if (status.ahead > 0 && status.behind > 0) {
        lines.push(`Your branch and '${status.tracking}' have diverged,`);
        lines.push(`and have ${status.ahead} and ${status.behind} different commits each, respectively.`);
      } else if (status.ahead > 0) {
        lines.push(`Your branch is ahead of '${status.tracking}' by ${status.ahead} commit(s).`);
      } else if (status.behind > 0) {
        lines.push(`Your branch is behind '${status.tracking}' by ${status.behind} commit(s).`);
      } else {
        lines.push(`Your branch is up to date with '${status.tracking}'.`);
      }
    }
    
    lines.push('');
    
    if (status.staged.length > 0) {
      lines.push('Changes to be committed:');
      lines.push('  (use "git restore --staged <file>..." to unstage)');
      status.staged.forEach(file => {
        lines.push(`\tnew file:   ${file}`);
      });
      lines.push('');
    }
    
    if (status.modified.length > 0 || status.deleted.length > 0) {
      lines.push('Changes not staged for commit:');
      lines.push('  (use "git add <file>..." to update what will be committed)');
      lines.push('  (use "git restore <file>..." to discard changes in working directory)');
      
      status.modified.forEach(file => {
        lines.push(`\tmodified:   ${file}`);
      });
      
      status.deleted.forEach(file => {
        lines.push(`\tdeleted:    ${file}`);
      });
      
      lines.push('');
    }
    
    if (status.not_added.length > 0) {
      lines.push('Untracked files:');
      lines.push('  (use "git add <file>..." to include in what will be committed)');
      status.not_added.forEach(file => {
        lines.push(`\t${file}`);
      });
      lines.push('');
    }
    
    if (status.conflicted.length > 0) {
      lines.push('Unmerged paths:');
      lines.push('  (use "git add <file>..." to mark resolution)');
      status.conflicted.forEach(file => {
        lines.push(`\tboth modified:   ${file}`);
      });
      lines.push('');
    }
    
    if (status.staged.length === 0 && 
        status.modified.length === 0 && 
        status.deleted.length === 0 && 
        status.not_added.length === 0 &&
        status.conflicted.length === 0) {
      lines.push('nothing to commit, working tree clean');
    }
    
    return lines.join('\n');
  }
}
