# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-10

### Added
- Initial release of Enhanced Git MCP Server
- Comprehensive Git operations support
- TypeScript implementation for better type safety
- Modular architecture with clean separation of concerns
- Session management for working directory persistence
- Advanced Git features: worktrees, stash, tags, cherry-pick
- Security features: path validation, operation restrictions
- Configurable via environment variables
- Structured logging with Winston
- Input validation with Zod schemas
- Support for both stdio and SSE transports (SSE pending)

### Repository Tools
- `git_init` - Initialize new repositories
- `git_clone` - Clone repositories
- `git_set_working_dir` - Set session working directory
- `git_clear_working_dir` - Clear session working directory

### Operation Tools
- `git_status` - Show working tree status
- `git_add` - Stage files
- `git_commit` - Commit changes
- `git_reset` - Reset changes
- `git_clean` - Remove untracked files

### Branching Tools
- `git_branch` - Manage branches
- `git_checkout` - Switch branches
- `git_merge` - Merge branches
- `git_rebase` - Rebase branches
- `git_cherry_pick` - Apply specific commits

### Remote Tools
- `git_remote` - Manage remotes
- `git_fetch` - Fetch from remotes
- `git_pull` - Pull changes
- `git_push` - Push changes

### History Tools
- `git_log` - Show commit logs
- `git_diff` - Show differences
- `git_show` - Show commit details
- `git_blame` - Show line-by-line authorship

### Advanced Tools
- `git_stash` - Manage stashes
- `git_tag` - Manage tags
- `git_worktree` - Manage worktrees

### Utility Tools
- `git_config` - Manage configuration
- `git_rev_parse` - Parse revisions

### Security
- Path validation to prevent unauthorized access
- Configurable operation restrictions
- Confirmation requirements for destructive operations
- Audit logging for all operations
