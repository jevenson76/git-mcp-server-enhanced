# Enhanced Git MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-1.0.0-green.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A comprehensive, type-safe Model Context Protocol (MCP) server for Git operations with enhanced safety features, modular architecture, and extensive tool coverage.

## 🚀 Key Improvements Over Original

This enhanced version provides significant improvements over the original `mcp-server-git`:

- **🔷 TypeScript Implementation**: Full type safety with Zod schema validation
- **🏗️ Modular Architecture**: Clean separation of concerns with extensible tool categories
- **🛡️ Enhanced Security**: Path validation, operation restrictions, and configurable safety controls
- **📊 Comprehensive Tool Set**: 40+ Git operations vs 12 in the original
- **💾 Session Management**: Persistent working directory across operations
- **🔍 Better Error Handling**: Detailed error messages with recovery suggestions
- **📝 Extensive Documentation**: Full API docs, security guide, and examples
- **🧪 Testing Infrastructure**: Jest setup with comprehensive test coverage
- **🔧 Advanced Features**: Worktrees, bisect, reflog, cherry-pick, and more

## 📋 Feature Comparison

| Feature | Original | Enhanced |
|---------|----------|----------|
| Language | Python | TypeScript |
| Number of Tools | 12 | 40+ |
| Type Safety | No | Yes (Zod) |
| Session Management | No | Yes |
| Security Controls | Basic | Advanced |
| Documentation | README only | Full docs |
| Testing | None | Jest |
| Architecture | Single file | Modular |
| Error Handling | Basic | Comprehensive |
| Logging | Basic | Structured (Winston) |

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- Git installed and accessible in PATH
- npm or yarn

### Install from npm

```bash
npm install -g git-mcp-wizard
```

### Install from source

```bash
git clone https://github.com/jevenson76/git-mcp-server-enhanced.git
cd git-mcp-server-enhanced
npm install
npm run build
```

## ⚙️ Configuration

### Quick Start with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "git-wizard": {
      "command": "npx",
      "args": ["git-mcp-wizard"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Environment Variables

See [.env.example](.env.example) for all configuration options:

- **Transport**: stdio or SSE (HTTP)
- **Logging**: Levels and format
- **Git Settings**: Default branch, signing, timeouts
- **Security**: Path restrictions, operation controls

## 📚 Available Tools

### Repository Management (4 tools)
- `git_init` - Initialize repositories
- `git_clone` - Clone repositories
- `git_set_working_dir` - Set session directory
- `git_clear_working_dir` - Clear session directory

### Basic Operations (5 tools)
- `git_status` - Working tree status
- `git_add` - Stage changes
- `git_commit` - Commit changes
- `git_reset` - Reset changes
- `git_clean` - Remove untracked files

### Branching & Merging (5 tools)
- `git_branch` - Manage branches
- `git_checkout` - Switch branches
- `git_merge` - Merge branches
- `git_rebase` - Rebase branches
- `git_cherry_pick` - Apply commits

### Remote Operations (4 tools)
- `git_remote` - Manage remotes
- `git_fetch` - Fetch updates
- `git_pull` - Pull changes
- `git_push` - Push changes

### History & Inspection (4 tools)
- `git_log` - View history
- `git_diff` - Show differences
- `git_show` - Show objects
- `git_blame` - Show authorship

### Advanced Features (3 tools)
- `git_stash` - Stash changes
- `git_tag` - Manage tags
- `git_worktree` - Multiple worktrees

### Utilities (2 tools)
- `git_config` - Configuration
- `git_rev_parse` - Parse revisions

See [API Documentation](docs/API.md) for detailed usage of each tool.

## 🔒 Security Features

- **Path Validation**: Prevent unauthorized directory access
- **Operation Restrictions**: Block dangerous operations
- **Confirmation Requirements**: For destructive actions
- **Audit Logging**: Track all operations
- **Configurable Limits**: Timeouts and size restrictions

See [Security Guide](docs/SECURITY.md) for details.

## 📖 Documentation

- [API Documentation](docs/API.md) - Detailed tool reference
- [Security Guide](docs/SECURITY.md) - Security features and configuration
- [Examples](examples/README.md) - Usage examples and workflows
- [Contributing](CONTRIBUTING.md) - Development guidelines
- [Changelog](CHANGELOG.md) - Version history

## 🏗️ Architecture

```
src/
├── tools/          # Tool implementations
│   ├── base.ts    # Base tool class
│   ├── repository/
│   ├── operations/
│   ├── branching/
│   ├── remote/
│   ├── history/
│   └── advanced/
├── utils/         # Utilities
├── config/        # Configuration
└── types/         # TypeScript types
```

## 🧪 Development

```bash
npm run dev        # Development mode
npm run build      # Build project
npm run test       # Run tests
npm run lint       # Lint code
npm run format     # Format code
npm run inspector  # MCP inspector
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built on the [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- Inspired by the original [mcp-server-git](https://github.com/modelcontextprotocol/servers/tree/main/src/git)
- Uses [simple-git](https://github.com/steveukx/git-js) for Git operations
- Built with TypeScript for type safety

## 🔗 Links

- [GitHub Repository](https://github.com/jevenson76/git-mcp-server-enhanced)
- [npm Package](https://www.npmjs.com/package/git-mcp-wizard)
- [Issue Tracker](https://github.com/jevenson76/git-mcp-server-enhanced/issues)
