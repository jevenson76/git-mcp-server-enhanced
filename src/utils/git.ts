import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import { config } from '../config/index.js';
import { logger } from './logger.js';
import { validatePath } from './validation.js';
import path from 'path';

export interface GitOptions extends SimpleGitOptions {
  timeout?: number;
}

export function createGitInstance(repoPath?: string, options?: GitOptions): SimpleGit {
  // Validate path if provided
  if (repoPath) {
    validatePath(repoPath);
  }
  
  const gitOptions: SimpleGitOptions = {
    baseDir: repoPath || process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: true,
    ...options,
  };
  
  // Add timeout if specified
  if (options?.timeout || config.git.operationTimeout) {
    gitOptions.timeout = {
      block: options?.timeout || config.git.operationTimeout,
    };
  }
  
  const git = simpleGit(gitOptions);
  
  // Configure git if needed
  if (config.git.signCommits) {
    git.addConfig('commit.gpgsign', 'true').catch((error) => {
      logger.warn('Failed to enable commit signing:', error);
    });
  }
  
  return git;
}

export async function isGitRepository(repoPath: string): Promise<boolean> {
  try {
    const git = createGitInstance(repoPath);
    await git.status();
    return true;
  } catch (error) {
    return false;
  }
}

export async function getRepositoryRoot(startPath: string): Promise<string | null> {
  try {
    const git = createGitInstance(startPath);
    const root = await git.revparse(['--show-toplevel']);
    return root.trim();
  } catch (error) {
    return null;
  }
}

export function formatGitError(error: any): string {
  if (error.message) {
    // Extract meaningful git error message
    const gitError = error.message.match(/fatal: (.+)/)?.[1] || 
                     error.message.match(/error: (.+)/)?.[1] ||
                     error.message;
    return gitError;
  }
  
  return 'Unknown git error';
}

export function parseAuthor(author: string): { name: string; email: string } | null {
  const match = author.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return {
      name: match[1].trim(),
      email: match[2].trim(),
    };
  }
  return null;
}

export async function ensureRepository(repoPath: string): Promise<void> {
  const isRepo = await isGitRepository(repoPath);
  if (!isRepo) {
    throw new Error(`Not a git repository: ${repoPath}`);
  }
}

export function sanitizeBranchName(name: string): string {
  // Replace invalid characters with hyphens
  return name
    .replace(/[\s~^:?*\[\]\\]/g, '-')
    .replace(/\.{2,}/g, '-')
    .replace(/^[.-]|[.-]$/g, '')
    .replace(/-{2,}/g, '-');
}

export function isValidBranchName(name: string): boolean {
  // Git branch name rules
  const invalidPatterns = [
    /[\s~^:?*\[\]\\]/, // Invalid characters
    /\.{2,}/, // Consecutive dots
    /^[.-]/, // Starts with dot or dash
    /[.-]$/, // Ends with dot or dash
    /\.lock$/, // Ends with .lock
    /^@$/, // Just @ symbol
  ];
  
  return !invalidPatterns.some(pattern => pattern.test(name));
}

export function resolveGitPath(basePath: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }
  return path.resolve(basePath, relativePath);
}
