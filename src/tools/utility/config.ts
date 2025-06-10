import { BaseTool } from '../base.js';
import { GitConfigArgs, GitConfigSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitConfigTool extends BaseTool<GitConfigArgs> {
  name = 'git_config';
  description = 'Get and set repository or global options';
  inputSchema = GitConfigSchema;
  
  protected async execute(args: GitConfigArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    
    // For non-local config, we don't need a repository
    if (args.scope !== 'local' && args.scope !== 'worktree') {
      // Use current directory for git instance
      const git = createGitInstance(process.cwd());
      return this.executeConfig(git, args);
    }
    
    // For local/worktree config, ensure we're in a repository
    await ensureRepository(workingDir);
    const git = createGitInstance(workingDir);
    return this.executeConfig(git, args);
  }
  
  private async executeConfig(git: any, args: GitConfigArgs): Promise<string> {
    const { scope, key, value, unset, list, get, add } = args;
    
    const scopeFlag = `--${scope}`;
    
    // List all config
    if (list) {
      const result = await git.raw(['config', scopeFlag, '--list']);
      return result || 'No configuration found';
    }
    
    // Get specific value
    if (get && key) {
      try {
        const result = await git.raw(['config', scopeFlag, '--get', key]);
        return result.trim();
      } catch (error) {
        return `Configuration key not found: ${key}`;
      }
    }
    
    // Unset value
    if (unset && key) {
      await git.raw(['config', scopeFlag, '--unset', key]);
      return `Unset configuration: ${key}`;
    }
    
    // Add value (for multi-valued keys)
    if (add && key && value !== undefined) {
      await git.raw(['config', scopeFlag, '--add', key, value]);
      return `Added configuration: ${key} = ${value}`;
    }
    
    // Set value
    if (key && value !== undefined) {
      await git.raw(['config', scopeFlag, key, value]);
      return `Set configuration: ${key} = ${value}`;
    }
    
    throw new Error('No valid config operation specified');
  }
}
