import { BaseTool } from '../base.js';
import { GitResetArgs, GitResetSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { requireConfirmation } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import { config } from '../../config/index.js';

export class GitResetTool extends BaseTool<GitResetArgs> {
  name = 'git_reset';
  description = 'Reset current HEAD to a specified state';
  inputSchema = GitResetSchema;
  
  protected async execute(args: GitResetArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { mode = 'mixed', ref, files } = args;
    
    // Check if destructive operation is allowed
    if (mode === 'hard') {
      if (!config.security.allowDestructiveOperations) {
        throw new Error('Hard reset is disabled by security configuration');
      }
      
      if (requireConfirmation('hard-reset')) {
        // In a real implementation, this would prompt the user
        throw new Error('Hard reset requires confirmation. Use --confirm flag or configure auto-approval.');
      }
    }
    
    const git = createGitInstance(workingDir);
    
    // If specific files are provided, reset only those
    if (files?.length) {
      await git.raw(['reset', ...files]);
      return `Reset ${files.length} file(s) in staging area`;
    }
    
    // Build reset options
    const resetOptions = [`--${mode}`];
    
    if (ref) {
      resetOptions.push(ref);
    }
    
    // Execute reset
    await git.reset(resetOptions);
    
    // Get current status for feedback
    const status = await git.status();
    const log = await git.log(['-1']);
    const currentCommit = log.latest;
    
    const lines = [`Reset to ${currentCommit?.hash.substring(0, 7) || 'HEAD'}`];
    
    switch (mode) {
      case 'soft':
        lines.push('Changes kept in staging area');
        break;
      case 'mixed':
        lines.push('Changes unstaged but kept in working directory');
        break;
      case 'hard':
        lines.push('All changes discarded');
        break;
    }
    
    if (status.modified.length > 0 || status.deleted.length > 0 || status.not_added.length > 0) {
      lines.push(`\nWorking directory has ${status.modified.length + status.deleted.length + status.not_added.length} uncommitted change(s)`);
    }
    
    return lines.join('\n');
  }
}
