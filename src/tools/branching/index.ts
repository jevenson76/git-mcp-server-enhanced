import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../../utils/session.js';
import { GitBranchTool } from './branch.js';
import { GitCheckoutTool } from './checkout.js';
import { GitMergeTool } from './merge.js';
import { GitRebaseTool } from './rebase.js';
import { GitCherryPickTool } from './cherry-pick.js';
import { zodToJsonSchema } from '../../utils/schema.js';

export function registerBranchingTools(server: Server, sessionManager: SessionManager): void {
  const tools = [
    new GitBranchTool(),
    new GitCheckoutTool(),
    new GitMergeTool(),
    new GitRebaseTool(),
    new GitCherryPickTool(),
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
