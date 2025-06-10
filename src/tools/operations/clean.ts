import { BaseTool } from '../base.js';
import { GitCleanArgs, GitCleanSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { requireConfirmation } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';
import { config } from '../../config/index.js';

export class GitCleanTool extends BaseTool<GitCleanArgs> {
  name = 'git_clean';
  description = 'Remove untracked files from the working tree';
  inputSchema = GitCleanSchema;
  
  protected async execute(args: GitCleanArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { force, directories, ignored, excludePattern, dryRun, interactive } = args;
    
    // Clean is a destructive operation
    if (!dryRun && !config.security.allowDestructiveOperations) {
      throw new Error('Clean operation is disabled by security configuration');
    }
    
    if (!force && !dryRun && !interactive) {
      throw new Error('Clean requires --force, --dry-run, or --interactive flag');
    }
    
    if (force && !dryRun && requireConfirmation('clean')) {
      throw new Error('Clean operation requires confirmation. Use --confirm flag or configure auto-approval.');
    }
    
    const git = createGitInstance(workingDir);
    
    // Build clean options
    const cleanOptions: string[] = [];
    
    if (force) {
      cleanOptions.push('-f');
    }
    
    if (directories) {
      cleanOptions.push('-d');
    }
    
    if (ignored) {
      cleanOptions.push('-x');
    }
    
    if (dryRun) {
      cleanOptions.push('-n');
    }
    
    if (interactive) {
      cleanOptions.push('-i');
    }
    
    if (excludePattern?.length) {
      excludePattern.forEach(pattern => {
        cleanOptions.push('-e', pattern);
      });
    }
    
    // Execute clean
    const result = await git.clean('f', cleanOptions);
    
    if (dryRun) {
      const files = result.split('\n').filter(Boolean);
      if (files.length === 0) {
        return 'No files would be removed';
      }
      return `Would remove ${files.length} file(s):\n${files.map(f => `  ${f}`).join('\n')}`;
    }
    
    const files = result.split('\n').filter(Boolean);
    if (files.length === 0) {
      return 'No files removed';
    }
    
    return `Removed ${files.length} file(s):\n${files.map(f => `  ${f}`).join('\n')}`;
  }
}
