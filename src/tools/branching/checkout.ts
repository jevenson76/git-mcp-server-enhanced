import { BaseTool } from '../base.js';
import { GitCheckoutArgs, GitCheckoutSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { validateBranchName } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';

export class GitCheckoutTool extends BaseTool<GitCheckoutArgs> {
  name = 'git_checkout';
  description = 'Switch branches or restore working tree files';
  inputSchema = GitCheckoutSchema;
  
  protected async execute(args: GitCheckoutArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { ref, create, force, orphan, track, files } = args;
    
    const git = createGitInstance(workingDir);
    
    // Checkout specific files
    if (files?.length) {
      await git.raw(['checkout', ref || 'HEAD', '--', ...files]);
      return `Restored ${files.length} file(s) from ${ref || 'HEAD'}`;
    }
    
    // Build checkout options
    const checkoutOptions: string[] = [];
    
    if (create) {
      validateBranchName(ref);
      checkoutOptions.push('-b');
    }
    
    if (orphan) {
      validateBranchName(ref);
      checkoutOptions.push('--orphan');
    }
    
    if (force) {
      checkoutOptions.push('-f');
    }
    
    if (track) {
      checkoutOptions.push('--track', track);
    }
    
    // Execute checkout
    await git.checkout(ref, checkoutOptions);
    
    // Get current status
    const status = await git.status();
    
    const lines = [`Switched to ${create || orphan ? 'new ' : ''}branch '${status.current}'`];
    
    if (status.tracking) {
      lines.push(`Tracking: ${status.tracking}`);
    }
    
    if (force && (status.modified.length > 0 || status.deleted.length > 0)) {
      lines.push(`\nWarning: ${status.modified.length + status.deleted.length} local change(s) were discarded`);
    }
    
    return lines.join('\n');
  }
}
