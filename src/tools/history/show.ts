import { BaseTool } from '../base.js';
import { GitShowArgs, GitShowSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitShowTool extends BaseTool<GitShowArgs> {
  name = 'git_show';
  description = 'Show various types of objects (commits, tags, etc)';
  inputSchema = GitShowSchema;
  
  protected async execute(args: GitShowArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { ref, format, stat, nameOnly, nameStatus, files } = args;
    
    const git = createGitInstance(workingDir);
    
    // Build show options
    const showOptions: string[] = [];
    
    if (format) {
      showOptions.push(`--format=${format}`);
    }
    
    if (stat) {
      showOptions.push('--stat');
    } else if (nameOnly) {
      showOptions.push('--name-only');
    } else if (nameStatus) {
      showOptions.push('--name-status');
    }
    
    // Build command
    const cmdArgs = ['show', ...showOptions, ref];
    
    if (files?.length) {
      cmdArgs.push('--');
      cmdArgs.push(...files);
    }
    
    // Execute show
    const result = await git.raw(cmdArgs);
    
    return result;
  }
}
