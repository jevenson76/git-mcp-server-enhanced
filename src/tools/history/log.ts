import { BaseTool } from '../base.js';
import { GitLogArgs, GitLogSchema } from '../../types/index.js';
import { createGitInstance, ensureRepository } from '../../utils/git.js';
import { SessionManager } from '../../utils/session.js';

export class GitLogTool extends BaseTool<GitLogArgs> {
  name = 'git_log';
  description = 'Show commit logs';
  inputSchema = GitLogSchema;
  
  protected async execute(args: GitLogArgs, sessionManager: SessionManager): Promise<string> {
    const workingDir = this.getWorkingDirectory(args, sessionManager);
    await ensureRepository(workingDir);
    
    const { 
      maxCount = 10, 
      skip, 
      since, 
      until, 
      author, 
      grep, 
      oneline, 
      graph, 
      reverse, 
      follow, 
      all 
    } = args;
    
    const git = createGitInstance(workingDir);
    
    // Build log options
    const logOptions: any = {
      maxCount,
    };
    
    if (skip) {
      logOptions.skip = skip;
    }
    
    if (since) {
      logOptions.from = since;
    }
    
    if (until) {
      logOptions.to = until;
    }
    
    if (author) {
      logOptions.author = author;
    }
    
    if (grep) {
      logOptions.grep = grep;
    }
    
    if (oneline) {
      logOptions.format = {
        hash: '%h',
        message: '%s'
      };
    }
    
    if (all) {
      logOptions.all = true;
    }
    
    if (follow) {
      logOptions.file = follow;
      logOptions.follow = true;
    }
    
    // Execute log
    const log = await git.log(logOptions);
    
    if (log.all.length === 0) {
      return 'No commits found';
    }
    
    const lines: string[] = [];
    
    if (reverse) {
      log.all.reverse();
    }
    
    log.all.forEach(commit => {
      if (oneline) {
        lines.push(`${commit.hash.substring(0, 7)} ${commit.message}`);
      } else {
        lines.push(`commit ${commit.hash}`);
        if (commit.author_name && commit.author_email) {
          lines.push(`Author: ${commit.author_name} <${commit.author_email}>`);
        }
        if (commit.date) {
          lines.push(`Date:   ${commit.date}`);
        }
        lines.push('');
        if (commit.message) {
          commit.message.split('\n').forEach(line => {
            lines.push(`    ${line}`);
          });
        }
        lines.push('');
      }
    });
    
    return lines.join('\n').trim();
  }
}
