import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitRemoteTool } from './remote.js';
import { GitFetchTool } from './fetch.js';
import { GitPullTool } from './pull.js';
import { GitPushTool } from './push.js';

export function registerRemoteTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitRemoteTool(),
    new GitFetchTool(),
    new GitPullTool(),
    new GitPushTool(),
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
