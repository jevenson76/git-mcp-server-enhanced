import { z } from 'zod';

// Common schemas
export const PathSchema = z.string().describe('Repository path (defaults to session working directory if set)');

export const CommitRefSchema = z.string().describe('Commit reference (SHA, branch, tag)');

export const BranchNameSchema = z.string().regex(/^[^\s~^:?*\[\]\\]+$/, {
  message: 'Invalid branch name',
});

// Tool argument schemas
export const GitInitSchema = z.object({
  path: z.string().describe('Path where to initialize the repository'),
  bare: z.boolean().optional().describe('Create a bare repository'),
  initialBranch: z.string().optional().describe('Name of the initial branch'),
  quiet: z.boolean().optional().describe('Suppress output'),
});

export const GitCloneSchema = z.object({
  url: z.string().url().describe('Repository URL to clone'),
  path: z.string().describe('Local path to clone into'),
  branch: z.string().optional().describe('Branch to checkout'),
  depth: z.number().positive().optional().describe('Create a shallow clone with history truncated'),
  recursive: z.boolean().optional().describe('Initialize submodules'),
  quiet: z.boolean().optional().describe('Suppress output'),
});

export const GitStatusSchema = z.object({
  path: PathSchema.optional(),
  short: z.boolean().optional().describe('Give output in short format'),
  branch: z.boolean().optional().describe('Show branch information'),
  showStash: z.boolean().optional().describe('Show stash information'),
});

export const GitAddSchema = z.object({
  path: PathSchema.optional(),
  files: z.array(z.string()).describe('Files or patterns to add'),
  all: z.boolean().optional().describe('Add all changes'),
  update: z.boolean().optional().describe('Update tracked files only'),
  force: z.boolean().optional().describe('Allow adding ignored files'),
});

export const GitCommitSchema = z.object({
  path: PathSchema.optional(),
  message: z.string().describe('Commit message'),
  all: z.boolean().optional().describe('Automatically stage all tracked files'),
  amend: z.boolean().optional().describe('Amend the previous commit'),
  author: z.string().optional().describe('Override author (format: "Name <email>")'),
  signoff: z.boolean().optional().describe('Add Signed-off-by line'),
  allowEmpty: z.boolean().optional().describe('Allow empty commits'),
  noVerify: z.boolean().optional().describe('Skip pre-commit hooks'),
});

export const GitPushSchema = z.object({
  path: PathSchema.optional(),
  remote: z.string().optional().default('origin').describe('Remote name'),
  branch: z.string().optional().describe('Branch to push'),
  force: z.boolean().optional().describe('Force push'),
  forceWithLease: z.boolean().optional().describe('Force push with lease'),
  setUpstream: z.boolean().optional().describe('Set upstream branch'),
  tags: z.boolean().optional().describe('Push tags'),
  delete: z.boolean().optional().describe('Delete remote branch'),
  dryRun: z.boolean().optional().describe('Dry run'),
});

export const GitPullSchema = z.object({
  path: PathSchema.optional(),
  remote: z.string().optional().default('origin').describe('Remote name'),
  branch: z.string().optional().describe('Branch to pull'),
  rebase: z.boolean().optional().describe('Rebase instead of merge'),
  ff: z.enum(['only', 'no']).optional().describe('Fast-forward preference'),
  all: z.boolean().optional().describe('Fetch all remotes'),
  tags: z.boolean().optional().describe('Fetch tags'),
  prune: z.boolean().optional().describe('Prune remote tracking branches'),
});

export const GitBranchSchema = z.object({
  path: PathSchema.optional(),
  name: BranchNameSchema.optional().describe('Branch name for creation/deletion'),
  list: z.boolean().optional().describe('List branches'),
  all: z.boolean().optional().describe('List all branches including remotes'),
  delete: z.boolean().optional().describe('Delete branch'),
  force: z.boolean().optional().describe('Force delete'),
  move: z.string().optional().describe('Rename branch to this name'),
  upstream: z.string().optional().describe('Set upstream branch'),
  unsetUpstream: z.boolean().optional().describe('Unset upstream branch'),
});

export const GitCheckoutSchema = z.object({
  path: PathSchema.optional(),
  ref: z.string().describe('Branch, tag, or commit to checkout'),
  create: z.boolean().optional().describe('Create new branch'),
  force: z.boolean().optional().describe('Force checkout'),
  orphan: z.boolean().optional().describe('Create orphan branch'),
  track: z.string().optional().describe('Set up tracking'),
  files: z.array(z.string()).optional().describe('Checkout specific files only'),
});

export const GitMergeSchema = z.object({
  path: PathSchema.optional(),
  branch: z.string().describe('Branch to merge'),
  message: z.string().optional().describe('Merge commit message'),
  strategy: z.enum(['recursive', 'resolve', 'octopus', 'ours', 'subtree']).optional(),
  strategyOption: z.array(z.string()).optional().describe('Strategy-specific options'),
  ff: z.enum(['only', 'no']).optional().describe('Fast-forward preference'),
  squash: z.boolean().optional().describe('Squash commits'),
  abort: z.boolean().optional().describe('Abort current merge'),
  continue: z.boolean().optional().describe('Continue after resolving conflicts'),
});

export const GitRebaseSchema = z.object({
  path: PathSchema.optional(),
  upstream: z.string().optional().describe('Upstream branch'),
  onto: z.string().optional().describe('New base'),
  interactive: z.boolean().optional().describe('Interactive rebase'),
  abort: z.boolean().optional().describe('Abort current rebase'),
  continue: z.boolean().optional().describe('Continue after resolving conflicts'),
  skip: z.boolean().optional().describe('Skip current commit'),
  autosquash: z.boolean().optional().describe('Automatically squash fixup commits'),
  autostash: z.boolean().optional().describe('Automatically stash changes'),
});

export const GitLogSchema = z.object({
  path: PathSchema.optional(),
  maxCount: z.number().positive().optional().default(10).describe('Maximum number of commits'),
  skip: z.number().nonnegative().optional().describe('Skip number of commits'),
  since: z.string().optional().describe('Show commits after date'),
  until: z.string().optional().describe('Show commits before date'),
  author: z.string().optional().describe('Filter by author'),
  grep: z.string().optional().describe('Filter by commit message'),
  oneline: z.boolean().optional().describe('Show in oneline format'),
  graph: z.boolean().optional().describe('Show graph'),
  reverse: z.boolean().optional().describe('Show in reverse order'),
  follow: z.string().optional().describe('Follow file history'),
  all: z.boolean().optional().describe('Show all branches'),
});

export const GitDiffSchema = z.object({
  path: PathSchema.optional(),
  ref1: CommitRefSchema.optional().describe('First reference'),
  ref2: CommitRefSchema.optional().describe('Second reference'),
  staged: z.boolean().optional().describe('Show staged changes'),
  cached: z.boolean().optional().describe('Alias for staged'),
  nameOnly: z.boolean().optional().describe('Show only file names'),
  nameStatus: z.boolean().optional().describe('Show file names and status'),
  stat: z.boolean().optional().describe('Show diffstat'),
  numstat: z.boolean().optional().describe('Show numeric diffstat'),
  shortstat: z.boolean().optional().describe('Show only summary'),
  files: z.array(z.string()).optional().describe('Limit to specific files'),
  unified: z.number().optional().describe('Number of context lines'),
});

export const GitResetSchema = z.object({
  path: PathSchema.optional(),
  mode: z.enum(['soft', 'mixed', 'hard', 'merge', 'keep']).optional().default('mixed'),
  ref: CommitRefSchema.optional().describe('Reset to this commit'),
  files: z.array(z.string()).optional().describe('Reset specific files only'),
});

export const GitStashSchema = z.object({
  path: PathSchema.optional(),
  command: z.enum(['push', 'pop', 'apply', 'drop', 'list', 'show', 'clear']).default('push'),
  message: z.string().optional().describe('Stash message'),
  includeUntracked: z.boolean().optional().describe('Include untracked files'),
  keepIndex: z.boolean().optional().describe('Keep staged changes in index'),
  patch: z.boolean().optional().describe('Interactive mode'),
  stash: z.string().optional().describe('Stash reference (for pop/apply/drop/show)'),
});

export const GitTagSchema = z.object({
  path: PathSchema.optional(),
  name: z.string().optional().describe('Tag name'),
  ref: CommitRefSchema.optional().describe('Object to tag'),
  message: z.string().optional().describe('Tag message (creates annotated tag)'),
  annotate: z.boolean().optional().describe('Create annotated tag'),
  force: z.boolean().optional().describe('Replace existing tag'),
  delete: z.boolean().optional().describe('Delete tag'),
  list: z.boolean().optional().describe('List tags'),
  verify: z.boolean().optional().describe('Verify tag signature'),
});

export const GitRemoteSchema = z.object({
  path: PathSchema.optional(),
  command: z.enum(['add', 'remove', 'rename', 'list', 'show', 'prune']).default('list'),
  name: z.string().optional().describe('Remote name'),
  url: z.string().optional().describe('Remote URL'),
  newName: z.string().optional().describe('New name (for rename)'),
  verbose: z.boolean().optional().describe('Verbose output'),
});

export const GitFetchSchema = z.object({
  path: PathSchema.optional(),
  remote: z.string().optional().describe('Remote to fetch from'),
  branch: z.string().optional().describe('Branch to fetch'),
  all: z.boolean().optional().describe('Fetch all remotes'),
  prune: z.boolean().optional().describe('Prune remote tracking branches'),
  pruneTags: z.boolean().optional().describe('Prune remote tags'),
  tags: z.boolean().optional().describe('Fetch tags'),
  depth: z.number().positive().optional().describe('Deepen shallow clone'),
  unshallow: z.boolean().optional().describe('Convert shallow to complete'),
});

export const GitCherryPickSchema = z.object({
  path: PathSchema.optional(),
  commits: z.array(CommitRefSchema).describe('Commits to cherry-pick'),
  noCommit: z.boolean().optional().describe('Apply changes without committing'),
  edit: z.boolean().optional().describe('Edit commit message'),
  signoff: z.boolean().optional().describe('Add Signed-off-by line'),
  mainline: z.number().positive().optional().describe('Parent number for merge commits'),
  strategy: z.string().optional().describe('Merge strategy'),
  strategyOption: z.array(z.string()).optional().describe('Strategy options'),
  abort: z.boolean().optional().describe('Abort current cherry-pick'),
  continue: z.boolean().optional().describe('Continue after resolving conflicts'),
  skip: z.boolean().optional().describe('Skip current commit'),
});

export const GitCleanSchema = z.object({
  path: PathSchema.optional(),
  force: z.boolean().describe('Required to actually remove files'),
  directories: z.boolean().optional().describe('Remove untracked directories'),
  ignored: z.boolean().optional().describe('Remove ignored files'),
  excludePattern: z.array(z.string()).optional().describe('Exclude patterns'),
  dryRun: z.boolean().optional().describe('Show what would be removed'),
  interactive: z.boolean().optional().describe('Interactive mode'),
});

export const GitWorktreeSchema = z.object({
  path: PathSchema.optional(),
  command: z.enum(['add', 'list', 'lock', 'unlock', 'move', 'prune', 'remove']).default('list'),
  worktreePath: z.string().optional().describe('Worktree path'),
  branch: z.string().optional().describe('Branch for new worktree'),
  commitish: CommitRefSchema.optional().describe('Commit for new worktree'),
  force: z.boolean().optional().describe('Force operation'),
  reason: z.string().optional().describe('Lock reason'),
  newPath: z.string().optional().describe('New path (for move)'),
});

export const GitConfigSchema = z.object({
  path: PathSchema.optional(),
  scope: z.enum(['local', 'global', 'system', 'worktree']).optional().default('local'),
  key: z.string().optional().describe('Configuration key'),
  value: z.string().optional().describe('Configuration value'),
  unset: z.boolean().optional().describe('Unset configuration'),
  list: z.boolean().optional().describe('List all configuration'),
  get: z.boolean().optional().describe('Get specific value'),
  add: z.boolean().optional().describe('Add new value to multi-valued key'),
});

export const GitBlameSchema = z.object({
  path: PathSchema.optional(),
  file: z.string().describe('File to blame'),
  startLine: z.number().positive().optional().describe('Start line number'),
  endLine: z.number().positive().optional().describe('End line number'),
  reverse: z.boolean().optional().describe('Show reverse blame'),
  showEmail: z.boolean().optional().describe('Show author email'),
  showTime: z.boolean().optional().describe('Show commit time'),
  ignoreWhitespace: z.boolean().optional().describe('Ignore whitespace changes'),
});

export const GitShowSchema = z.object({
  path: PathSchema.optional(),
  ref: CommitRefSchema.describe('Commit/tag/tree to show'),
  format: z.enum(['full', 'oneline', 'short', 'medium', 'fuller', 'email', 'raw']).optional(),
  stat: z.boolean().optional().describe('Show diffstat'),
  nameOnly: z.boolean().optional().describe('Show only file names'),
  nameStatus: z.boolean().optional().describe('Show file names and status'),
  files: z.array(z.string()).optional().describe('Show specific files only'),
});

export const GitRevParseSchema = z.object({
  path: PathSchema.optional(),
  ref: z.string().describe('Reference to parse'),
  abbrevRef: z.boolean().optional().describe('Show abbreviated ref'),
  symbolic: z.boolean().optional().describe('Show symbolic ref'),
  showToplevel: z.boolean().optional().describe('Show repository root'),
  gitDir: z.boolean().optional().describe('Show .git directory'),
  isInsideWorkTree: z.boolean().optional().describe('Check if inside work tree'),
  isBareRepository: z.boolean().optional().describe('Check if bare repository'),
});

export const SessionWorkingDirSchema = z.object({
  path: z.string().describe('Absolute path to set as working directory'),
  validateGitRepo: z.boolean().optional().default(true).describe('Validate that path is a Git repository'),
});

// Type exports
export type GitInitArgs = z.infer<typeof GitInitSchema>;
export type GitCloneArgs = z.infer<typeof GitCloneSchema>;
export type GitStatusArgs = z.infer<typeof GitStatusSchema>;
export type GitAddArgs = z.infer<typeof GitAddSchema>;
export type GitCommitArgs = z.infer<typeof GitCommitSchema>;
export type GitPushArgs = z.infer<typeof GitPushSchema>;
export type GitPullArgs = z.infer<typeof GitPullSchema>;
export type GitBranchArgs = z.infer<typeof GitBranchSchema>;
export type GitCheckoutArgs = z.infer<typeof GitCheckoutSchema>;
export type GitMergeArgs = z.infer<typeof GitMergeSchema>;
export type GitRebaseArgs = z.infer<typeof GitRebaseSchema>;
export type GitLogArgs = z.infer<typeof GitLogSchema>;
export type GitDiffArgs = z.infer<typeof GitDiffSchema>;
export type GitResetArgs = z.infer<typeof GitResetSchema>;
export type GitStashArgs = z.infer<typeof GitStashSchema>;
export type GitTagArgs = z.infer<typeof GitTagSchema>;
export type GitRemoteArgs = z.infer<typeof GitRemoteSchema>;
export type GitFetchArgs = z.infer<typeof GitFetchSchema>;
export type GitCherryPickArgs = z.infer<typeof GitCherryPickSchema>;
export type GitCleanArgs = z.infer<typeof GitCleanSchema>;
export type GitWorktreeArgs = z.infer<typeof GitWorktreeSchema>;
export type GitConfigArgs = z.infer<typeof GitConfigSchema>;
export type GitBlameArgs = z.infer<typeof GitBlameSchema>;
export type GitShowArgs = z.infer<typeof GitShowSchema>;
export type GitRevParseArgs = z.infer<typeof GitRevParseSchema>;
export type SessionWorkingDirArgs = z.infer<typeof SessionWorkingDirSchema>;
