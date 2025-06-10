import { BaseTool } from '../base.js';
import { GitRemoteArgs, GitRemoteSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { validateRemoteUrl } from '../../utils/validation.js';
import { SessionManager } from '../../utils/session.js';

export class GitRemoteTool extends BaseTool<GitRemoteArgs> {
  name = 'git_remote';
  description = 'Manage set of tracked repositories';
  inputSchema = GitRemoteSchema;
  
  protected async execute(args: GitRemoteArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { command, name, url, newName, verbose } = args;
    
    const git = createGitInstance(workingDir);
    
    switch (command) {
      case 'list': {
        const remotes = await git.getRemotes(verbose);
        if (remotes.length === 0) {
          return 'No remotes configured';
        }
        
        const lines = ['Remotes:'];
        remotes.forEach(remote => {
          if (verbose && remote.refs) {
            lines.push(`${remote.name}`);
            lines.push(`  Fetch: ${remote.refs.fetch}`);
            lines.push(`  Push:  ${remote.refs.push}`);
          } else {
            lines.push(`  ${remote.name}`);
          }
        });
        
        return lines.join('\n');
      }
      
      case 'add': {
        if (!name || !url) {
          throw new Error('Remote name and URL are required for add');
        }
        validateRemoteUrl(url);
        await git.addRemote(name, url);
        return `Added remote '${name}' with URL: ${url}`;
      }
      
      case 'remove': {
        if (!name) {
          throw new Error('Remote name is required for remove');
        }
        await git.removeRemote(name);
        return `Removed remote '${name}'`;
      }
      
      case 'rename': {
        if (!name || !newName) {
          throw new Error('Current name and new name are required for rename');
        }
        await git.raw(['remote', 'rename', name, newName]);
        return `Renamed remote '${name}' to '${newName}'`;
      }
      
      case 'show': {
        if (!name) {
          throw new Error('Remote name is required for show');
        }
        const result = await git.raw(['remote', 'show', name]);
        return result;
      }
      
      case 'prune': {
        if (!name) {
          throw new Error('Remote name is required for prune');
        }
        await git.raw(['remote', 'prune', name]);
        return `Pruned stale remote tracking branches for '${name}'`;
      }
      
      default:
        throw new Error(`Unknown remote command: ${command}`);
    }
  }
}
