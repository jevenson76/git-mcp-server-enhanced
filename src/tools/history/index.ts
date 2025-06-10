import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitLogTool } from './log.js';
import { GitDiffTool } from './diff.js';
import { GitShowTool } from './show.js';
import { GitBlameTool } from './blame.js';
import { zodToJsonSchema } from '../../utils/schema.js';

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
        inputSchema: tool.inputSchema ? zodToJsonSchema(tool.inputSchema) : undefined,
      },
      async (args) => tool.handler(args, sessionManager)
    );
  });
}
