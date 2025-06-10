#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from './config/index.js';
import { createGitServer } from './server.js';
import { logger } from './utils/logger.js';

async function main(): Promise<void> {
  try {
    const server = createGitServer();
    
    if (config.transport.type === 'stdio') {
      logger.info('Starting Git MCP server with stdio transport');
      const transport = new StdioServerTransport();
      await server.connect(transport);
      
      // Handle shutdown gracefully
      process.on('SIGINT', async () => {
        logger.info('Shutting down Git MCP server...');
        await server.close();
        process.exit(0);
      });
      
      process.on('SIGTERM', async () => {
        logger.info('Shutting down Git MCP server...');
        await server.close();
        process.exit(0);
      });
    } else {
      // SSE transport would require additional dependencies
      throw new Error(`Transport type ${config.transport.type} not yet implemented`);
    }
    
  } catch (error) {
    logger.error('Failed to start Git MCP server', error);
    process.exit(1);
  }
}

// Run the server
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { createGitServer } from './server.js';
