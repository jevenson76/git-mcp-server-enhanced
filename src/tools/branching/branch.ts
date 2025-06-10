import { BaseTool } from '../base.js';
import { GitBranchArgs, GitBranchSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository, isValidBranchName } from '../../utils/git.js';
import { validateBranchName } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';

export class GitBranchTool extends BaseTool<GitBranchArgs> {
  name = 'git_branch';
  description = 'List, create, or delete branches';
  inputSchema = GitBranchSchema;
  
  protected async execute(args: GitBranchArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { name, list, all, delete: deleteBranch, force, move, upstream, unsetUpstream } = args;
    
    const git = createGitInstance(workingDir);
    
    // List branches
    if (list || (!name && !move && !upstream && !unsetUpstream)) {
      const branches = await git.branch([all ? '-a' : '-l']);
      
      const lines = ['Branches:'];
      
      // Local branches
      branches.branches && Object.entries(branches.branches).forEach(([branchName, info]) => {
        const current = branches.current === branchName ? '* ' : '  ';
        const remote = info.remote ? ` -> ${info.remote}` : '';
        lines.push(`${current}${branchName}${remote}`);
      });
      
      if (branches.all.length === 0) {
        lines.push('  (no branches)');
      }
      
      return lines.join('\n');
    }
    
    // Delete branch
    if (deleteBranch && name) {
      const deleteOptions = ['-d'];
      if (force) {
        deleteOptions[0] = '-D';
      }
      
      await git.deleteLocalBranch(name, force);
      return `Deleted branch: ${name}`;
    }
    
    // Move/rename branch
    if (move && name) {
      validateBranchName(move);
      await git.raw(['branch', '-m', name, move]);
      return `Renamed branch ${name} to ${move}`;
    }
    
    // Set upstream
    if (upstream) {
      const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
      await git.raw(['branch', '--set-upstream-to', upstream, name || currentBranch]);
      return `Set upstream of ${name || currentBranch} to ${upstream}`;
    }
    
    // Unset upstream
    if (unsetUpstream) {
      const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
      await git.raw(['branch', '--unset-upstream', name || currentBranch]);
      return `Removed upstream from ${name || currentBranch}`;
    }
    
    // Create branch
    if (name) {
      validateBranchName(name);
      await git.checkoutLocalBranch(name);
      return `Created and switched to new branch: ${name}`;
    }
    
    throw new Error('No valid branch operation specified');
  }
}
