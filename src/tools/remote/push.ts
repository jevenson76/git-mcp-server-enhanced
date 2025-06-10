import { BaseTool } from '../base.js';
import { GitPushArgs, GitPushSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { requireConfirmation } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import { config } from '../../config/index.js';

export class GitPushTool extends BaseTool<GitPushArgs> {
  name = 'git_push';
  description = 'Update remote refs along with associated objects';
  inputSchema = GitPushSchema;
  
  protected async execute(args: GitPushArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { remote = 'origin', branch, force, forceWithLease, setUpstream, tags, delete: deleteRef, dryRun } = args;
    
    // Check security settings
    if (force && !config.security.allowForcePush) {
      throw new Error('Force push is disabled by security configuration');
    }
    
    if (!dryRun && requireConfirmation('push')) {
      throw new Error('Push operation requires confirmation. Use --confirm flag or configure auto-approval.');
    }
    
    const git = createGitInstance(workingDir);
    
    // Build push options
    const pushOptions: string[] = [];
    
    if (force) {
      pushOptions.push('--force');
    } else if (forceWithLease) {
      pushOptions.push('--force-with-lease');
    }
    
    if (setUpstream) {
      pushOptions.push('--set-upstream');
    }
    
    if (tags) {
      pushOptions.push('--tags');
    }
    
    if (deleteRef) {
      pushOptions.push('--delete');
    }
    
    if (dryRun) {
      pushOptions.push('--dry-run');
    }
    
    // Execute push
    await git.push(remote, branch, pushOptions);
    
    const lines = [];
    
    if (dryRun) {
      lines.push('Dry run - no changes were pushed');
    } else if (deleteRef) {
      lines.push(`Deleted remote branch ${remote}/${branch}`);
    } else {
      lines.push(`Pushed to ${remote}${branch ? `/${branch}` : ''}`);
      
      if (setUpstream) {
        lines.push(`Branch '${branch}' set up to track '${remote}/${branch}'`);
      }
      
      if (tags) {
        lines.push('Tags were pushed');
      }
    }
    
    return lines.join('\n');
  }
}
