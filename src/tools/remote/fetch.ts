import { BaseTool } from '../base.js';
import { GitFetchArgs, GitFetchSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitFetchTool extends BaseTool<GitFetchArgs> {
  name = 'git_fetch';
  description = 'Download objects and refs from another repository';
  inputSchema = GitFetchSchema;
  
  protected async execute(args: GitFetchArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { remote, branch, all, prune, pruneTags, tags, depth, unshallow } = args;
    
    const git = createGitInstance(workingDir);
    
    // Build fetch options
    const fetchOptions: string[] = [];
    
    if (all) {
      fetchOptions.push('--all');
    }
    
    if (prune) {
      fetchOptions.push('--prune');
    }
    
    if (pruneTags) {
      fetchOptions.push('--prune-tags');
    }
    
    if (tags) {
      fetchOptions.push('--tags');
    }
    
    if (depth) {
      fetchOptions.push('--depth', depth.toString());
    }
    
    if (unshallow) {
      fetchOptions.push('--unshallow');
    }
    
    // Execute fetch
    const result = await git.fetch(remote, branch, fetchOptions);
    
    const lines = [];
    
    if (all) {
      lines.push('Fetched from all remotes');
    } else {
      lines.push(`Fetched from ${remote || 'origin'}${branch ? ` (branch: ${branch})` : ''}`);
    }
    
    if (result.updated?.length) {
      lines.push('\nUpdated references:');
      result.updated.forEach(ref => {
        lines.push(`  ${ref.from} -> ${ref.to}`);
      });
    }
    
    if (result.deleted?.length) {
      lines.push('\nDeleted references:');
      result.deleted.forEach(ref => {
        lines.push(`  ${ref}`);
      });
    }
    
    if (!result.updated?.length && !result.deleted?.length) {
      lines.push('Already up to date');
    }
    
    return lines.join('\n');
  }
}
