#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
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
    } else if (config.transport.type === 'sse') {
      logger.info(`Starting Git MCP server with SSE transport on ${config.transport.host}:${config.transport.port}`);
      
      const app = express();
      app.use(express.json());
      
      const transport = new SSEServerTransport('/', app);
      await server.connect(transport);
      
      app.listen(config.transport.port, config.transport.host, () => {
        logger.info(`Git MCP server listening on http://${config.transport.host}:${config.transport.port}`);
      });
    } else {
      throw new Error(`Unknown transport type: ${config.transport.type}`);
    }
    
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
