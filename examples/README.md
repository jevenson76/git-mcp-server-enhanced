# Git MCP Server Examples

This directory contains examples of how to use the Enhanced Git MCP Server with various MCP clients.

## Claude Desktop Configuration

Add to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "git-enhanced": {
      "command": "npx",
      "args": ["@jevenson76/git-mcp-server-enhanced"],
      "env": {
        "LOG_LEVEL": "info",
        "GIT_DEFAULT_BRANCH": "main",
        "ALLOW_FORCE_PUSH": "false"
      }
    }
  }
}
```

## Example Workflows

### 1. Basic Git Workflow

```
# Set working directory
git_set_working_dir path: "/path/to/my/project"

# Check status
git_status

# Stage all changes
git_add all: true

# Commit changes
git_commit message: "feat: add new feature"

# Push to remote
git_push
```

### 2. Branching and Merging

```
# Create and switch to new branch
git_checkout ref: "feature/new-feature" create: true

# Make changes and commit
git_add files: ["src/feature.ts"]
git_commit message: "feat: implement new feature"

# Switch back to main
git_checkout ref: "main"

# Merge feature branch
git_merge branch: "feature/new-feature"
```

### 3. Working with Remotes

```
# Add a remote
git_remote command: "add" name: "upstream" url: "https://github.com/original/repo.git"

# Fetch from upstream
git_fetch remote: "upstream"

# List all remotes
git_remote command: "list" verbose: true
```

### 4. Stashing Changes

```
# Stash current changes
git_stash command: "push" message: "WIP: working on feature"

# List stashes
git_stash command: "list"

# Apply stash
git_stash command: "apply" stash: "stash@{0}"
```

### 5. Viewing History

```
# View recent commits
git_log maxCount: 10 oneline: true

# View commits by author
git_log author: "john@example.com" since: "2024-01-01"

# Show specific commit
git_show ref: "abc123"
```

### 6. Advanced Operations

```
# Cherry-pick commits
git_cherry_pick commits: ["abc123", "def456"]

# Interactive rebase
git_rebase upstream: "main" interactive: true

# Create annotated tag
git_tag name: "v1.0.0" message: "Release version 1.0.0"
```

## Security Configuration

### Restricting Repository Access

```json
{
  "env": {
    "ALLOWED_REPOSITORY_PATHS": "/home/user/projects,/home/user/work",
    "DENIED_REPOSITORY_PATHS": "/home/user/private"
  }
}
```

### Disabling Destructive Operations

```json
{
  "env": {
    "ALLOW_FORCE_PUSH": "false",
    "ALLOW_DESTRUCTIVE_OPERATIONS": "false",
    "REQUIRE_CONFIRMATION_FOR_PUSH": "true"
  }
}
```

## Error Handling

The server provides detailed error messages:

```
# Example: Trying to commit without staged changes
git_commit message: "empty commit"
# Error: No changes staged for commit. Use --all to commit all changes or stage files first.

# Example: Invalid branch name
git_branch name: "feature/bad..name"
# Error: Invalid branch name: Contains invalid sequence: feature/bad..name
```

## Tips and Best Practices

1. **Set Working Directory**: Always set a working directory at the start of your session to avoid specifying paths repeatedly.

2. **Check Status Frequently**: Use `git_status` to understand the current state before performing operations.

3. **Use Dry Run**: For potentially destructive operations, use dry run options when available:
   ```
   git_push dryRun: true
   git_clean dryRun: true
   ```

4. **Review Diffs**: Before committing, review changes:
   ```
   git_diff staged: true
   ```

5. **Meaningful Commit Messages**: Follow conventional commit format:
   ```
   git_commit message: "feat: add user authentication"
   git_commit message: "fix: resolve memory leak in data processor"
   git_commit message: "docs: update API documentation"
   ```
