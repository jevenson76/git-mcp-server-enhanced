import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitConfigTool } from './config.js';
import { GitRevParseTool } from './rev-parse.js';
import { zodToJsonSchema } from '../../utils/schema.js';

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
        inputSchema: tool.inputSchema ? zodToJsonSchema(tool.inputSchema) : undefined,
      },
      async (args) => tool.handler(args, sessionManager)
    );
  });
}
