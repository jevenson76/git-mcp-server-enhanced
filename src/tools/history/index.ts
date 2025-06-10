import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitLogTool } from './log.js';
import { GitDiffTool } from './diff.js';
import { GitShowTool } from './show.js';
import { GitBlameTool } from './blame.js';

export function registerHistoryTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitLogTool(),
    new GitDiffTool(),
    new GitShowTool(),
    new GitBlameTool(),
  ];
  
  tools.forEach(tool => {
    server.addTool(
      {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema?.shape ? 
          { type: 'object', properties: tool.inputSchema.shape } : 
          undefined,
      },
      async (args) => tool.handler(args, sessionManager)
    );
  });
}
