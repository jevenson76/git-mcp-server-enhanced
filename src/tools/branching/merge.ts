import { z } from 'zod';
import { BaseTool } from '../base.js';
import { SessionManager } from '../../utils/session.js';
import { logger } from '../../utils/logger.js';
import { ensureRepository } from '../../utils/git.js';

export class GitMergeTool extends BaseTool<{
  path?: string;
  branch: string;
  message?: string;
  noCommit?: boolean;
  noFf?: boolean;
  ffOnly?: boolean;
  squash?: boolean;
  strategy?: string;
}> {
  name = 'git_merge';
  description = 'Merge branches in a Git repository';
  
  inputSchema = z.object({
    path: z.string().optional().describe('Path to the Git repository'),
    branch: z.string().describe('Branch to merge into current branch'),
    message: z.string().optional().describe('Custom merge commit message'),
    noCommit: z.boolean().optional().describe('Perform merge but do not commit'),
    noFf: z.boolean().optional().describe('Create merge commit even if fast-forward is possible'),
    ffOnly: z.boolean().optional().describe('Refuse to merge unless fast-forward is possible'),
    squash: z.boolean().optional().describe('Squash commits into a single commit'),
    strategy: z.string().optional().describe('Merge strategy to use'),
  });

  async handler(args: z.infer<typeof this.inputSchema>, sessionManager: SessionManager) {
    const workingDir = args.path || sessionManager.getWorkingDirectory();
    const git = await ensureRepository(workingDir);
    
    try {
      logger.info(`Merging branch ${args.branch} in ${workingDir}`);
      
      const options: string[] = [];
      if (args.noCommit) options.push('--no-commit');
      if (args.noFf) options.push('--no-ff');
      if (args.ffOnly) options.push('--ff-only');
      if (args.squash) options.push('--squash');
      if (args.strategy) options.push('--strategy', args.strategy);
      if (args.message) options.push('-m', args.message);
      
      const result = await git.merge([args.branch, ...options]);
      
      return {
        content: [
          {
            type: 'text',
            text: `Successfully merged branch '${args.branch}'${result.result ? `: ${result.result}` : ''}`
          }
        ]
      };
    } catch (error) {
      throw new Error(`Failed to merge branch '${args.branch}': ${error}`);
    }
  }
}
