import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitConfigTool } from './config.js';
import { GitRevParseTool } from './rev-parse.js';

export function registerUtilityTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitConfigTool(),
    new GitRevParseTool(),
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
