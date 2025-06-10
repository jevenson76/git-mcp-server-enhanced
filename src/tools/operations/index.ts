import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitStatusTool } from './status.js';
import { GitAddTool } from './add.js';
import { GitCommitTool } from './commit.js';
import { GitResetTool } from './reset.js';
import { GitCleanTool } from './clean.js';
import { zodToJsonSchema } from '../../utils/schema.js';

export function registerOperationTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitStatusTool(),
    new GitAddTool(),
    new GitCommitTool(),
    new GitResetTool(),
    new GitCleanTool(),
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
