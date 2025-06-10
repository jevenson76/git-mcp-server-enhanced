import { BaseTool } from '../base.js';
import { GitTagArgs, GitTagSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitTagTool extends BaseTool<GitTagArgs> {
  name = 'git_tag';
  description = 'Create, list, delete or verify a tag object';
  inputSchema = GitTagSchema;
  
  protected async execute(args: GitTagArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { name, ref, message, annotate, force, delete: deleteTag, list, verify } = args;
    
    const git = createGitInstance(workingDir);
    
    // List tags
    if (list || (!name && !verify)) {
      const tags = await git.tags();
      if (tags.all.length === 0) {
        return 'No tags found';
      }
      return 'Tags:\n' + tags.all.map(t => `  ${t}`).join('\n');
    }
    
    // Verify tag
    if (verify && name) {
      const result = await git.raw(['tag', '-v', name]);
      return result;
    }
    
    // Delete tag
    if (deleteTag && name) {
      await git.raw(['tag', '-d', name]);
      return `Deleted tag: ${name}`;
    }
    
    // Create tag
    if (name) {
      const options: string[] = [];
      
      if (message || annotate) {
        options.push('-a');
        if (message) {
          options.push('-m', message);
        }
      }
      
      if (force) {
        options.push('-f');
      }
      
      await git.addTag(name, ref || 'HEAD', options);
      return `Created tag: ${name}${ref ? ` at ${ref}` : ''}`;
    }
    
    throw new Error('No valid tag operation specified');
  }
}
