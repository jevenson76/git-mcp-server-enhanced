import { BaseTool } from '../base.js';
import { GitRevParseArgs, GitRevParseSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitRevParseTool extends BaseTool<GitRevParseArgs> {
  name = 'git_rev_parse';
  description = 'Parse revision (or other objects) and retrieve repository information';
  inputSchema = GitRevParseSchema;
  
  protected async execute(args: GitRevParseArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    
    const git = createGitInstance(workingDir);
    
    const { 
      ref, 
      abbrevRef, 
      symbolic, 
      showToplevel, 
      gitDir, 
      isInsideWorkTree, 
      isBareRepository 
    } = args;
    
    const results: string[] = [];
    
    // Parse revision
    if (ref) {
      const options: string[] = [];
      if (abbrevRef) options.push('--abbrev-ref');
      if (symbolic) options.push('--symbolic');
      
      try {
        const result = await git.revparse([...options, ref]);
        results.push(`${ref}: ${result.trim()}`);
      } catch (error) {
        throw new Error(`Invalid revision: ${ref}`);
      }
    }
    
    // Repository information
    if (showToplevel) {
      try {
        const result = await git.revparse(['--show-toplevel']);
        results.push(`Repository root: ${result.trim()}`);
      } catch {
        results.push('Not inside a git repository');
      }
    }
    
    if (gitDir) {
      try {
        const result = await git.revparse(['--git-dir']);
        results.push(`Git directory: ${result.trim()}`);
      } catch {
        results.push('Git directory not found');
      }
    }
    
    if (isInsideWorkTree) {
      try {
        const result = await git.revparse(['--is-inside-work-tree']);
        results.push(`Inside work tree: ${result.trim()}`);
      } catch {
        results.push('Inside work tree: false');
      }
    }
    
    if (isBareRepository) {
      try {
        const result = await git.revparse(['--is-bare-repository']);
        results.push(`Bare repository: ${result.trim()}`);
      } catch {
        results.push('Bare repository: false');
      }
    }
    
    return results.join('\n');
  }
}
