import { z } from 'zod';
import { BaseTool } from '../base.js';
import { SessionManager } from '../../utils/session.js';
import { logger } from '../../utils/logger.js';
import { ensureRepository } from '../../utils/git.js';

export class GitRebaseTool extends BaseTool<{
  path?: string;
  upstream: string;
  branch?: string;
  interactive?: boolean;
  onto?: string;
  continue?: boolean;
  abort?: boolean;
  skip?: boolean;
}> {
  name = 'git_rebase';
  description = 'Rebase branches in a Git repository';
  
  inputSchema = z.object({
    path: z.string().optional().describe('Path to the Git repository'),
    upstream: z.string().describe('Upstream branch to rebase onto'),
    branch: z.string().optional().describe('Branch to rebase (default: current branch)'),
    interactive: z.boolean().optional().describe('Interactive rebase'),
    onto: z.string().optional().describe('Rebase onto this branch'),
    continue: z.boolean().optional().describe('Continue rebase after resolving conflicts'),
    abort: z.boolean().optional().describe('Abort the current rebase'),
    skip: z.boolean().optional().describe('Skip the current patch'),
  });

  async handler(args: z.infer<typeof this.inputSchema>, sessionManager: SessionManager) {
    const workingDir = args.path || sessionManager.getWorkingDirectory();
    const git = await ensureRepository(workingDir);
    
    try {
      if (args.abort) {
        logger.info(`Aborting rebase in ${workingDir}`);
        await git.rebase(['--abort']);
        return {
          content: [{
            type: 'text',
            text: 'Rebase aborted successfully'
          }]
        };
      }
      
      if (args.continue) {
        logger.info(`Continuing rebase in ${workingDir}`);
        await git.rebase(['--continue']);
        return {
          content: [{
            type: 'text',
            text: 'Rebase continued successfully'
          }]
        };
      }
      
      if (args.skip) {
        logger.info(`Skipping current patch in rebase in ${workingDir}`);
        await git.rebase(['--skip']);
        return {
          content: [{
            type: 'text',
            text: 'Skipped current patch in rebase'
          }]
        };
      }
      
      logger.info(`Rebasing onto ${args.upstream} in ${workingDir}`);
      
      const options: string[] = [args.upstream];
      if (args.branch) options.push(args.branch);
      if (args.interactive) options.push('-i');
      if (args.onto) options.push('--onto', args.onto);
      
      const result = await git.rebase(options);
      
      return {
        content: [{
          type: 'text',
          text: `Successfully rebased onto '${args.upstream}'`
        }]
      };
    } catch (error) {
      throw new Error(`Failed to rebase: ${error}`);
    }
  }
}
