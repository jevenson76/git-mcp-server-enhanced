import { BaseTool } from '../base.js';
import { GitPullArgs, GitPullSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitPullTool extends BaseTool<GitPullArgs> {
  name = 'git_pull';
  description = 'Fetch from and integrate with another repository or a local branch';
  inputSchema = GitPullSchema;
  
  protected async execute(args: GitPullArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { remote = 'origin', branch, rebase, ff, all, tags, prune } = args;
    
    const git = createGitInstance(workingDir);
    
    // Build pull options
    const pullOptions: string[] = [];
    
    if (rebase) {
      pullOptions.push('--rebase');
    }
    
    if (ff === 'only') {
      pullOptions.push('--ff-only');
    } else if (ff === 'no') {
      pullOptions.push('--no-ff');
    }
    
    if (all) {
      pullOptions.push('--all');
    }
    
    if (tags) {
      pullOptions.push('--tags');
    }
    
    if (prune) {
      pullOptions.push('--prune');
    }
    
    // Execute pull
    const result = await git.pull(remote, branch, pullOptions);
    
    const lines = [];
    
    if (result.summary.changes === 0) {
      lines.push('Already up to date');
    } else {
      lines.push(`Updated from ${remote}${branch ? `/${branch}` : ''}`);
      
      if (result.summary.insertions || result.summary.deletions) {
        lines.push(`Files changed: ${result.summary.changes}`);
        if (result.summary.insertions) {
          lines.push(`Insertions: ${result.summary.insertions}`);
        }
        if (result.summary.deletions) {
          lines.push(`Deletions: ${result.summary.deletions}`);
        }
      }
      
      if (result.files.length > 0) {
        lines.push('\nModified files:');
        result.files.forEach(file => {
          lines.push(`  ${file}`);
        });
      }
    }
    
    return lines.join('\n');
  }
}
