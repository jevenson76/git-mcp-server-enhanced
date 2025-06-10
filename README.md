# Enhanced Git MCP Server

An enhanced Model Context Protocol (MCP) server for Git operations with improved safety, features, and architecture.

## Overview

This is a comprehensive Git MCP server that provides safe, powerful Git operations through the Model Context Protocol. Built with TypeScript for better type safety and featuring a modular architecture for extensibility.

## Features

- **Comprehensive Git Operations**: Full suite of Git commands with enhanced safety checks
- **TypeScript Implementation**: Full type safety and better developer experience
- **Modular Architecture**: Clean separation of concerns with extensible design
- **Enhanced Safety**: Validation, confirmation prompts for destructive operations
- **Better Error Handling**: Detailed error messages and recovery suggestions
- **Session Management**: Working directory persistence across operations
- **Advanced Features**: Worktrees, cherry-pick, stash, interactive rebase support
- **Configurable**: Environment-based configuration with sensible defaults
- **Logging**: Structured logging with multiple levels and formats
- **Security**: Path validation, operation restrictions, and audit logging

## Installation

### Prerequisites

- Node.js >= 18.0.0
- Git installed and accessible in PATH
- npm or yarn

### Install from npm

```bash
npm install -g @jevenson76/git-mcp-server-enhanced
```

### Install from source

```bash
git clone https://github.com/jevenson76/git-mcp-server-enhanced.git
cd git-mcp-server-enhanced
npm install
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
# Transport configuration
MCP_TRANSPORT_TYPE=stdio  # or 'sse' for HTTP/SSE transport
MCP_HTTP_PORT=3000
MCP_HTTP_HOST=localhost

# Logging configuration
LOG_LEVEL=info  # debug, info, warn, error
LOG_FORMAT=json  # json or pretty

# Git configuration
GIT_DEFAULT_BRANCH=main
GIT_SIGN_COMMITS=false
GIT_MAX_DIFF_SIZE=1000000  # Maximum diff size in bytes
GIT_OPERATION_TIMEOUT=30000  # Operation timeout in milliseconds

# Security configuration
ALLOW_FORCE_PUSH=false
ALLOW_DESTRUCTIVE_OPERATIONS=false
REQUIRE_CONFIRMATION_FOR_PUSH=true

# Repository restrictions (comma-separated paths)
ALLOWED_REPOSITORY_PATHS=
DENIED_REPOSITORY_PATHS=
```

### MCP Client Configuration

Add to your MCP client settings (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "git-enhanced": {
      "command": "npx",
      "args": ["@jevenson76/git-mcp-server-enhanced"],
      "env": {
        "LOG_LEVEL": "info",
        "GIT_SIGN_COMMITS": "true"
      }
    }
  }
}
```

## Available Tools

### Repository Management
- `git_init` - Initialize a new repository
- `git_clone` - Clone a repository
- `git_set_working_dir` - Set session working directory
- `git_clear_working_dir` - Clear session working directory

### Basic Operations
- `git_status` - Show working tree status
- `git_add` - Stage files
- `git_commit` - Commit changes
- `git_reset` - Reset changes
- `git_clean` - Remove untracked files

### Branching & Merging
- `git_branch` - Manage branches
- `git_checkout` - Switch branches or restore files
- `git_merge` - Merge branches
- `git_rebase` - Rebase branches
- `git_cherry_pick` - Apply specific commits

### Remote Operations
- `git_remote` - Manage remotes
- `git_fetch` - Fetch from remote
- `git_pull` - Pull changes
- `git_push` - Push changes

### History & Inspection
- `git_log` - Show commit logs
- `git_diff` - Show changes
- `git_show` - Show commit details
- `git_blame` - Show line-by-line authorship

### Advanced Features
- `git_stash` - Manage stashes
- `git_tag` - Manage tags
- `git_worktree` - Manage worktrees
- `git_bisect` - Binary search for bugs
- `git_reflog` - Show reference logs

### Utilities
- `git_config` - Manage configuration
- `git_gc` - Garbage collection
- `git_fsck` - Verify repository integrity

## Development

### Building

```bash
npm run build        # Build TypeScript
npm run clean       # Clean build artifacts
npm run dev        # Development mode with watch
```

### Testing

```bash
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

### Linting & Formatting

```bash
npm run lint       # Run ESLint
npm run format     # Format with Prettier
```

### Debugging

```bash
npm run inspector  # Run with MCP inspector
```

## Architecture

The server follows a modular architecture:

```
src/
├── index.ts              # Entry point
├── server.ts            # MCP server setup
├── config/              # Configuration management
├── tools/               # Git tools implementation
│   ├── base.ts         # Base tool class
│   ├── repository/     # Repository management tools
│   ├── operations/     # Basic Git operations
│   ├── branching/      # Branch-related tools
│   ├── remote/         # Remote operations
│   ├── history/        # History inspection tools
│   └── advanced/       # Advanced Git features
├── utils/              # Utility functions
│   ├── git.ts         # Git helpers
│   ├── validation.ts  # Input validation
│   ├── logger.ts      # Logging utilities
│   └── errors.ts      # Error handling
└── types/             # TypeScript type definitions
```

## Safety Features

1. **Path Validation**: Ensures operations only occur in allowed directories
2. **Confirmation Prompts**: Requires explicit confirmation for destructive operations
3. **Operation Restrictions**: Configurable restrictions on force pushes and destructive operations
4. **Timeout Protection**: Prevents long-running operations from blocking
5. **Error Recovery**: Suggestions for recovering from common error scenarios
6. **Audit Logging**: Detailed logging of all operations for security auditing

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built on the Model Context Protocol by Anthropic
- Inspired by the original mcp-server-git
- Uses simple-git for Git operations
- TypeScript for type safety
