import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SessionManager } from '../utils/session.js';
import { registerRepositoryTools } from './repository/index.js';
import { registerOperationTools } from './operations/index.js';
import { registerBranchingTools } from './branching/index.js';
import { registerRemoteTools } from './remote/index.js';
import { registerHistoryTools } from './history/index.js';
import { registerAdvancedTools } from './advanced/index.js';
import { registerUtilityTools } from './utility/index.js';

export function registerTools(server: Server, sessionManager: SessionManager): void {
  // Register all tool categories
  registerRepositoryTools(server, sessionManager);
  registerOperationTools(server, sessionManager);
  registerBranchingTools(server, sessionManager);
  registerRemoteTools(server, sessionManager);
  registerHistoryTools(server, sessionManager);
  registerAdvancedTools(server, sessionManager);
  registerUtilityTools(server, sessionManager);
}
