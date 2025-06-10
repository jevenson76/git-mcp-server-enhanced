import { BaseTool } from '../base.js';
import { GitCherryPickArgs, GitCherryPickSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitCherryPickTool extends BaseTool<GitCherryPickArgs> {
  name = 'git_cherry_pick';
  description = 'Apply the changes introduced by some existing commits';
  inputSchema = GitCherryPickSchema;
  
  protected async execute(args: GitCherryPickArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { commits, noCommit, edit, signoff, mainline, strategy, strategyOption, abort, continue: cont, skip } = args;
    
    const git = createGitInstance(workingDir);
    
    // Handle cherry-pick control commands
    if (abort) {
      await git.raw(['cherry-pick', '--abort']);
      return 'Cherry-pick aborted';
    }
    
    if (cont) {
      await git.raw(['cherry-pick', '--continue']);
      return 'Cherry-pick continued';
    }
    
    if (skip) {
      await git.raw(['cherry-pick', '--skip']);
      return 'Skipped current commit and continued cherry-pick';
    }
    
    // Build cherry-pick options
    const options: string[] = ['cherry-pick'];
    
    if (noCommit) {
      options.push('-n');
    }
    
    if (edit) {
      options.push('-e');
    }
    
    if (signoff) {
      options.push('-s');
    }
    
    if (mainline) {
      options.push('-m', mainline.toString());
    }
    
    if (strategy) {
      options.push('-s', strategy);
    }
    
    if (strategyOption?.length) {
      strategyOption.forEach(opt => {
        options.push('-X', opt);
      });
    }
    
    // Add commits
    options.push(...commits);
    
    // Execute cherry-pick
    await git.raw(options);
    
    return `Cherry-picked ${commits.length} commit(s) successfully`;
  }
}
