# API Documentation

This document provides detailed information about all available tools in the Enhanced Git MCP Server.

## Tool Categories

### Repository Management Tools

#### git_init
Initialize a new Git repository.

**Arguments:**
- `path` (string, required): Path where to initialize the repository
- `bare` (boolean, optional): Create a bare repository
- `initialBranch` (string, optional): Name of the initial branch
- `quiet` (boolean, optional): Suppress output

**Example:**
```json
{
  "path": "/home/user/new-project",
  "initialBranch": "main"
}
```

#### git_clone
Clone a repository into a new directory.

**Arguments:**
- `url` (string, required): Repository URL to clone
- `path` (string, required): Local path to clone into
- `branch` (string, optional): Branch to checkout
- `depth` (number, optional): Create a shallow clone with history truncated
- `recursive` (boolean, optional): Initialize submodules
- `quiet` (boolean, optional): Suppress output

**Example:**
```json
{
  "url": "https://github.com/user/repo.git",
  "path": "/home/user/projects/repo",
  "branch": "develop"
}
```

#### git_set_working_dir
Set the default working directory for Git operations in this session.

**Arguments:**
- `path` (string, required): Absolute path to set as working directory
- `validateGitRepo` (boolean, optional, default: true): Validate that path is a Git repository

**Example:**
```json
{
  "path": "/home/user/projects/my-app",
  "validateGitRepo": true
}
```

#### git_clear_working_dir
Clear the session working directory.

**Arguments:** None

### Basic Operations

#### git_status
Show the working tree status.

**Arguments:**
- `path` (string, optional): Repository path (defaults to session working directory)
- `short` (boolean, optional): Give output in short format
- `branch` (boolean, optional): Show branch information
- `showStash` (boolean, optional): Show stash information

**Example:**
```json
{
  "short": false,
  "branch": true
}
```

#### git_add
Add file contents to the staging area.

**Arguments:**
- `path` (string, optional): Repository path
- `files` (array of strings): Files or patterns to add
- `all` (boolean, optional): Add all changes
- `update` (boolean, optional): Update tracked files only
- `force` (boolean, optional): Allow adding ignored files

**Example:**
```json
{
  "files": ["src/*.ts", "README.md"],
  "force": false
}
```

#### git_commit
Record changes to the repository.

**Arguments:**
- `path` (string, optional): Repository path
- `message` (string, required): Commit message
- `all` (boolean, optional): Automatically stage all tracked files
- `amend` (boolean, optional): Amend the previous commit
- `author` (string, optional): Override author (format: "Name <email>")
- `signoff` (boolean, optional): Add Signed-off-by line
- `allowEmpty` (boolean, optional): Allow empty commits
- `noVerify` (boolean, optional): Skip pre-commit hooks

**Example:**
```json
{
  "message": "feat: add user authentication module",
  "signoff": true
}
```

#### git_reset
Reset current HEAD to a specified state.

**Arguments:**
- `path` (string, optional): Repository path
- `mode` (string, optional): Reset mode: "soft", "mixed", "hard", "merge", "keep" (default: "mixed")
- `ref` (string, optional): Reset to this commit
- `files` (array of strings, optional): Reset specific files only

**Example:**
```json
{
  "mode": "soft",
  "ref": "HEAD~1"
}
```

#### git_clean
Remove untracked files from the working tree.

**Arguments:**
- `path` (string, optional): Repository path
- `force` (boolean, required): Required to actually remove files
- `directories` (boolean, optional): Remove untracked directories
- `ignored` (boolean, optional): Remove ignored files
- `excludePattern` (array of strings, optional): Exclude patterns
- `dryRun` (boolean, optional): Show what would be removed
- `interactive` (boolean, optional): Interactive mode

**Example:**
```json
{
  "force": true,
  "directories": true,
  "dryRun": true
}
```

### Branching and Merging

#### git_branch
List, create, or delete branches.

**Arguments:**
- `path` (string, optional): Repository path
- `name` (string, optional): Branch name for creation/deletion
- `list` (boolean, optional): List branches
- `all` (boolean, optional): List all branches including remotes
- `delete` (boolean, optional): Delete branch
- `force` (boolean, optional): Force delete
- `move` (string, optional): Rename branch to this name
- `upstream` (string, optional): Set upstream branch
- `unsetUpstream` (boolean, optional): Unset upstream branch

**Example:**
```json
{
  "name": "feature/new-feature",
  "upstream": "origin/feature/new-feature"
}
```

#### git_checkout
Switch branches or restore working tree files.

**Arguments:**
- `path` (string, optional): Repository path
- `ref` (string, required): Branch, tag, or commit to checkout
- `create` (boolean, optional): Create new branch
- `force` (boolean, optional): Force checkout
- `orphan` (boolean, optional): Create orphan branch
- `track` (string, optional): Set up tracking
- `files` (array of strings, optional): Checkout specific files only

**Example:**
```json
{
  "ref": "develop",
  "create": true,
  "track": "origin/develop"
}
```

#### git_merge
Join two or more development histories together.

**Arguments:**
- `path` (string, optional): Repository path
- `branch` (string, required): Branch to merge
- `message` (string, optional): Merge commit message
- `strategy` (string, optional): Merge strategy: "recursive", "resolve", "octopus", "ours", "subtree"
- `strategyOption` (array of strings, optional): Strategy-specific options
- `ff` (string, optional): Fast-forward preference: "only", "no"
- `squash` (boolean, optional): Squash commits
- `abort` (boolean, optional): Abort current merge
- `continue` (boolean, optional): Continue after resolving conflicts

**Example:**
```json
{
  "branch": "feature/authentication",
  "ff": "no",
  "message": "Merge feature/authentication into main"
}
```

#### git_rebase
Reapply commits on top of another base tip.

**Arguments:**
- `path` (string, optional): Repository path
- `upstream` (string, optional): Upstream branch
- `onto` (string, optional): New base
- `interactive` (boolean, optional): Interactive rebase
- `abort` (boolean, optional): Abort current rebase
- `continue` (boolean, optional): Continue after resolving conflicts
- `skip` (boolean, optional): Skip current commit
- `autosquash` (boolean, optional): Automatically squash fixup commits
- `autostash` (boolean, optional): Automatically stash changes

**Example:**
```json
{
  "upstream": "main",
  "interactive": true,
  "autostash": true
}
```

#### git_cherry_pick
Apply the changes introduced by some existing commits.

**Arguments:**
- `path` (string, optional): Repository path
- `commits` (array of strings, required): Commits to cherry-pick
- `noCommit` (boolean, optional): Apply changes without committing
- `edit` (boolean, optional): Edit commit message
- `signoff` (boolean, optional): Add Signed-off-by line
- `mainline` (number, optional): Parent number for merge commits
- `strategy` (string, optional): Merge strategy
- `strategyOption` (array of strings, optional): Strategy options
- `abort` (boolean, optional): Abort current cherry-pick
- `continue` (boolean, optional): Continue after resolving conflicts
- `skip` (boolean, optional): Skip current commit

**Example:**
```json
{
  "commits": ["abc123", "def456"],
  "signoff": true
}
```

### Remote Operations

#### git_remote
Manage set of tracked repositories.

**Arguments:**
- `path` (string, optional): Repository path
- `command` (string, required): Command: "add", "remove", "rename", "list", "show", "prune"
- `name` (string, optional): Remote name
- `url` (string, optional): Remote URL
- `newName` (string, optional): New name (for rename)
- `verbose` (boolean, optional): Verbose output

**Example:**
```json
{
  "command": "add",
  "name": "upstream",
  "url": "https://github.com/original/repo.git"
}
```

#### git_fetch
Download objects and refs from another repository.

**Arguments:**
- `path` (string, optional): Repository path
- `remote` (string, optional): Remote to fetch from
- `branch` (string, optional): Branch to fetch
- `all` (boolean, optional): Fetch all remotes
- `prune` (boolean, optional): Prune remote tracking branches
- `pruneTags` (boolean, optional): Prune remote tags
- `tags` (boolean, optional): Fetch tags
- `depth` (number, optional): Deepen shallow clone
- `unshallow` (boolean, optional): Convert shallow to complete

**Example:**
```json
{
  "remote": "origin",
  "prune": true,
  "tags": true
}
```

#### git_pull
Fetch from and integrate with another repository or a local branch.

**Arguments:**
- `path` (string, optional): Repository path
- `remote` (string, optional, default: "origin"): Remote name
- `branch` (string, optional): Branch to pull
- `rebase` (boolean, optional): Rebase instead of merge
- `ff` (string, optional): Fast-forward preference: "only", "no"
- `all` (boolean, optional): Fetch all remotes
- `tags` (boolean, optional): Fetch tags
- `prune` (boolean, optional): Prune remote tracking branches

**Example:**
```json
{
  "remote": "origin",
  "branch": "main",
  "rebase": true
}
```

#### git_push
Update remote refs along with associated objects.

**Arguments:**
- `path` (string, optional): Repository path
- `remote` (string, optional, default: "origin"): Remote name
- `branch` (string, optional): Branch to push
- `force` (boolean, optional): Force push
- `forceWithLease` (boolean, optional): Force push with lease
- `setUpstream` (boolean, optional): Set upstream branch
- `tags` (boolean, optional): Push tags
- `delete` (boolean, optional): Delete remote branch
- `dryRun` (boolean, optional): Dry run

**Example:**
```json
{
  "remote": "origin",
  "branch": "feature/new-feature",
  "setUpstream": true
}
```

### History and Inspection

#### git_log
Show commit logs.

**Arguments:**
- `path` (string, optional): Repository path
- `maxCount` (number, optional, default: 10): Maximum number of commits
- `skip` (number, optional): Skip number of commits
- `since` (string, optional): Show commits after date
- `until` (string, optional): Show commits before date
- `author` (string, optional): Filter by author
- `grep` (string, optional): Filter by commit message
- `oneline` (boolean, optional): Show in oneline format
- `graph` (boolean, optional): Show graph
- `reverse` (boolean, optional): Show in reverse order
- `follow` (string, optional): Follow file history
- `all` (boolean, optional): Show all branches

**Example:**
```json
{
  "maxCount": 20,
  "author": "john@example.com",
  "since": "2024-01-01",
  "oneline": true
}
```

#### git_diff
Show changes between commits, commit and working tree, etc.

**Arguments:**
- `path` (string, optional): Repository path
- `ref1` (string, optional): First reference
- `ref2` (string, optional): Second reference
- `staged` (boolean, optional): Show staged changes
- `cached` (boolean, optional): Alias for staged
- `nameOnly` (boolean, optional): Show only file names
- `nameStatus` (boolean, optional): Show file names and status
- `stat` (boolean, optional): Show diffstat
- `numstat` (boolean, optional): Show numeric diffstat
- `shortstat` (boolean, optional): Show only summary
- `files` (array of strings, optional): Limit to specific files
- `unified` (number, optional): Number of context lines

**Example:**
```json
{
  "ref1": "main",
  "ref2": "develop",
  "stat": true
}
```

#### git_show
Show various types of objects (commits, tags, etc).

**Arguments:**
- `path` (string, optional): Repository path
- `ref` (string, required): Commit/tag/tree to show
- `format` (string, optional): Format: "full", "oneline", "short", "medium", "fuller", "email", "raw"
- `stat` (boolean, optional): Show diffstat
- `nameOnly` (boolean, optional): Show only file names
- `nameStatus` (boolean, optional): Show file names and status
- `files` (array of strings, optional): Show specific files only

**Example:**
```json
{
  "ref": "HEAD~1",
  "format": "medium",
  "stat": true
}
```

#### git_blame
Show what revision and author last modified each line of a file.

**Arguments:**
- `path` (string, optional): Repository path
- `file` (string, required): File to blame
- `startLine` (number, optional): Start line number
- `endLine` (number, optional): End line number
- `reverse` (boolean, optional): Show reverse blame
- `showEmail` (boolean, optional): Show author email
- `showTime` (boolean, optional): Show commit time
- `ignoreWhitespace` (boolean, optional): Ignore whitespace changes

**Example:**
```json
{
  "file": "src/main.ts",
  "startLine": 10,
  "endLine": 50,
  "showEmail": true
}
```

### Advanced Features

#### git_stash
Stash the changes in a dirty working directory away.

**Arguments:**
- `path` (string, optional): Repository path
- `command` (string, required): Command: "push", "pop", "apply", "drop", "list", "show", "clear"
- `message` (string, optional): Stash message
- `includeUntracked` (boolean, optional): Include untracked files
- `keepIndex` (boolean, optional): Keep staged changes in index
- `patch` (boolean, optional): Interactive mode
- `stash` (string, optional): Stash reference (for pop/apply/drop/show)

**Example:**
```json
{
  "command": "push",
  "message": "WIP: implementing feature X",
  "includeUntracked": true
}
```

#### git_tag
Create, list, delete or verify a tag object.

**Arguments:**
- `path` (string, optional): Repository path
- `name` (string, optional): Tag name
- `ref` (string, optional): Object to tag
- `message` (string, optional): Tag message (creates annotated tag)
- `annotate` (boolean, optional): Create annotated tag
- `force` (boolean, optional): Replace existing tag
- `delete` (boolean, optional): Delete tag
- `list` (boolean, optional): List tags
- `verify` (boolean, optional): Verify tag signature

**Example:**
```json
{
  "name": "v1.0.0",
  "message": "Release version 1.0.0",
  "ref": "main"
}
```

#### git_worktree
Manage multiple working trees.

**Arguments:**
- `path` (string, optional): Repository path
- `command` (string, required): Command: "add", "list", "lock", "unlock", "move", "prune", "remove"
- `worktreePath` (string, optional): Worktree path
- `branch` (string, optional): Branch for new worktree
- `commitish` (string, optional): Commit for new worktree
- `force` (boolean, optional): Force operation
- `reason` (string, optional): Lock reason
- `newPath` (string, optional): New path (for move)

**Example:**
```json
{
  "command": "add",
  "worktreePath": "/tmp/hotfix",
  "branch": "hotfix/urgent-fix"
}
```

### Utility Tools

#### git_config
Get and set repository or global options.

**Arguments:**
- `path` (string, optional): Repository path
- `scope` (string, optional): Scope: "local", "global", "system", "worktree" (default: "local")
- `key` (string, optional): Configuration key
- `value` (string, optional): Configuration value
- `unset` (boolean, optional): Unset configuration
- `list` (boolean, optional): List all configuration
- `get` (boolean, optional): Get specific value
- `add` (boolean, optional): Add new value to multi-valued key

**Example:**
```json
{
  "scope": "local",
  "key": "user.email",
  "value": "john@example.com"
}
```

#### git_rev_parse
Parse revision (or other objects) and retrieve repository information.

**Arguments:**
- `path` (string, optional): Repository path
- `ref` (string, required): Reference to parse
- `abbrevRef` (boolean, optional): Show abbreviated ref
- `symbolic` (boolean, optional): Show symbolic ref
- `showToplevel` (boolean, optional): Show repository root
- `gitDir` (boolean, optional): Show .git directory
- `isInsideWorkTree` (boolean, optional): Check if inside work tree
- `isBareRepository` (boolean, optional): Check if bare repository

**Example:**
```json
{
  "ref": "HEAD",
  "abbrevRef": true,
  "showToplevel": true
}
```

## Error Handling

All tools return structured error messages when operations fail. Common error types include:

- **ValidationError**: Invalid input parameters
- **GitError**: Git operation failed
- **SecurityError**: Operation blocked by security policy
- **ToolError**: General tool execution error

Errors include descriptive messages to help diagnose and resolve issues.
