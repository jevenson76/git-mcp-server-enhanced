import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenvConfig({ path: path.join(__dirname, '../../.env') });

// Configuration schema
const ConfigSchema = z.object({
  transport: z.object({
    type: z.enum(['stdio', 'sse']).default('stdio'),
    port: z.number().int().positive().default(3000),
    host: z.string().default('localhost'),
  }),
  logging: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    format: z.enum(['json', 'pretty']).default('json'),
  }),
  git: z.object({
    defaultBranch: z.string().default('main'),
    signCommits: z.boolean().default(false),
    maxDiffSize: z.number().positive().default(1000000),
    operationTimeout: z.number().positive().default(30000),
  }),
  security: z.object({
    allowForcePush: z.boolean().default(false),
    allowDestructiveOperations: z.boolean().default(false),
    requireConfirmationForPush: z.boolean().default(true),
    allowedRepositoryPaths: z.array(z.string()).optional(),
    deniedRepositoryPaths: z.array(z.string()).optional(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

// Parse configuration from environment
function parseConfig(): Config {
  const rawConfig = {
    transport: {
      type: process.env.MCP_TRANSPORT_TYPE || 'stdio',
      port: parseInt(process.env.MCP_HTTP_PORT || '3000', 10),
      host: process.env.MCP_HTTP_HOST || 'localhost',
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.LOG_FORMAT || 'json',
    },
    git: {
      defaultBranch: process.env.GIT_DEFAULT_BRANCH || 'main',
      signCommits: process.env.GIT_SIGN_COMMITS === 'true',
      maxDiffSize: parseInt(process.env.GIT_MAX_DIFF_SIZE || '1000000', 10),
      operationTimeout: parseInt(process.env.GIT_OPERATION_TIMEOUT || '30000', 10),
    },
    security: {
      allowForcePush: process.env.ALLOW_FORCE_PUSH === 'true',
      allowDestructiveOperations: process.env.ALLOW_DESTRUCTIVE_OPERATIONS === 'true',
      requireConfirmationForPush: process.env.REQUIRE_CONFIRMATION_FOR_PUSH !== 'false',
      allowedRepositoryPaths: process.env.ALLOWED_REPOSITORY_PATHS?.split(',').filter(Boolean),
      deniedRepositoryPaths: process.env.DENIED_REPOSITORY_PATHS?.split(',').filter(Boolean),
    },
  };
  
  return ConfigSchema.parse(rawConfig);
}

export const config = parseConfig();
