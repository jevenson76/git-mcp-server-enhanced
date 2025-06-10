import { BaseTool } from '../base.js';
import { GitCommitArgs, GitCommitSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository, parseAuthor } from '../../utils/git.js';
import { validateCommitMessage } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import { config } from '../../config/index.js';

export class GitCommitTool extends BaseTool<GitCommitArgs> {
  name = 'git_commit';
  description = 'Record changes to the repository';
  inputSchema = GitCommitSchema;
  
  protected async execute(args: GitCommitArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { message, all, amend, author, signoff, allowEmpty, noVerify } = args;
    
    // Validate commit message
    if (!amend) {
      validateCommitMessage(message);
    }
    
    const git = createGitInstance(workingDir);
    
    // Check if there are changes to commit
    const status = await git.status();
    if (!amend && !allowEmpty && status.staged.length === 0 && !all) {
      throw new Error('No changes staged for commit. Use --all to commit all changes or stage files first.');
    }
    
    // Build commit options
    const commitOptions: string[] = [];
    
    if (all) {
      commitOptions.push('--all');
    }
    
    if (amend) {
      commitOptions.push('--amend');
    }
    
    if (author) {
      const parsed = parseAuthor(author);
      if (!parsed) {
        throw new Error('Invalid author format. Use "Name <email>"');
      }
      commitOptions.push('--author', author);
    }
    
    if (signoff) {
      commitOptions.push('--signoff');
    }
    
    if (allowEmpty) {
      commitOptions.push('--allow-empty');
    }
    
    if (noVerify) {
      commitOptions.push('--no-verify');
    }
    
    if (config.git.signCommits) {
      commitOptions.push('--gpg-sign');
    }
    
    // Execute commit
    const result = await git.commit(message, undefined, commitOptions);
    
    // Format result
    const lines = [`Committed ${result.commit}`];
    
    if (result.branch) {
      lines.push(`On branch: ${result.branch}`);
    }
    
    if (result.summary) {
      if (result.summary.changes > 0) {
        lines.push(`${result.summary.changes} file(s) changed`);
      }
      if (result.summary.insertions > 0) {
        lines.push(`${result.summary.insertions} insertion(s)`);
      }
      if (result.summary.deletions > 0) {
        lines.push(`${result.summary.deletions} deletion(s)`);
      }
    }
    
    return lines.join('\n');
  }
}
