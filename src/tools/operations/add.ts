import { BaseTool } from '../base.js';
import { GitAddArgs, GitAddSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { validateFilePattern } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';

export class GitAddTool extends BaseTool<GitAddArgs> {
  name = 'git_add';
  description = 'Add file contents to the staging area';
  inputSchema = GitAddSchema;
  
  protected async execute(args: GitAddArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { files, all, update, force } = args;
    
    // Validate inputs
    if (!files?.length && !all && !update) {
      throw new Error('Must specify files, --all, or --update');
    }
    
    if (files?.length) {
      files.forEach(file => validateFilePattern(file));
    }
    
    const git = createGitInstance(workingDir);
    
    // Build add options
    const addOptions: string[] = [];
    
    if (all) {
      addOptions.push('--all');
    } else if (update) {
      addOptions.push('--update');
    }
    
    if (force) {
      addOptions.push('--force');
    }
    
    // Execute add command
    if (files?.length) {
      await git.add(files);
    } else {
      await git.raw(['add', ...addOptions]);
    }
    
    // Get status to show what was staged
    const status = await git.status();
    
    if (status.staged.length === 0) {
      return 'No changes added to staging area';
    }
    
    return `Added ${status.staged.length} file(s) to staging area:\n${status.staged.map(f => `  ${f}`).join('\n')}`;
  }
}
