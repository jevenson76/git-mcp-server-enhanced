import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { logger } from './utils/logger.js';
import { registerTools } from './tools/index.js';
import { SessionManager } from './utils/session.js';
import { config } from './config/index.js';

export function createGitServer(): Server {
  const server = new Server(
    {
      name: 'git-mcp-server-enhanced',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const sessionManager = new SessionManager();
  
  // Register all tools
  registerTools(server, sessionManager);
  
  // Set up request handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = server.getTools();
    return {
      tools: Array.from(tools.values()),
    };
  });
  
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      logger.debug(`Calling tool: ${name}`, { args });
      
      const tool = server.getTool(name);
      if (!tool) {
        throw new Error(`Tool not found: ${name}`);
      }
      
      // Parse and validate arguments
      const parsedArgs = tool.inputSchema ? 
        tool.inputSchema.parse(args) : 
        args;
      
      // Execute the tool
      const result = await tool.handler(parsedArgs, sessionManager);
      
      logger.debug(`Tool ${name} completed successfully`);
      
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      logger.error(`Error executing tool ${name}:`, error);
      
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid arguments: ${error.message}`);
      }
      
      throw error;
    }
  });
  
  return server;
}
