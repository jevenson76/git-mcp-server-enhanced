import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitStashTool } from './stash.js';
import { GitTagTool } from './tag.js';
import { GitWorktreeTool } from './worktree.js';

export function registerAdvancedTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitStashTool(),
    new GitTagTool(),
    new GitWorktreeTool(),
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
