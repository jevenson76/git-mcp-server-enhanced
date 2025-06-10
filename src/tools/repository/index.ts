import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitInitTool } from './init.js';
import { GitCloneTool } from './clone.js';
import { SetWorkingDirTool, ClearWorkingDirTool } from './session.js';

export function registerRepositoryTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitInitTool(),
    new GitCloneTool(),
    new SetWorkingDirTool(),
    new ClearWorkingDirTool(),
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
