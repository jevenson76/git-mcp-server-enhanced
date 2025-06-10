import { config } from '../config/index.js';
import path from 'path';
import { z } from 'zod';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validatePath(inputPath: string): void {
  const normalizedPath = path.normalize(inputPath);
  const absolutePath = path.isAbsolute(normalizedPath) ? normalizedPath : path.resolve(normalizedPath);
  
  // Check if path is in denied list
  if (config.security.deniedRepositoryPaths) {
    for (const deniedPath of config.security.deniedRepositoryPaths) {
      const deniedAbsolute = path.resolve(deniedPath);
      if (absolutePath.startsWith(deniedAbsolute)) {
        throw new ValidationError(`Access denied: Path is in denied list: ${inputPath}`);
      }
    }
  }
  
  // Check if path is in allowed list (if specified)
  if (config.security.allowedRepositoryPaths && config.security.allowedRepositoryPaths.length > 0) {
    let isAllowed = false;
    for (const allowedPath of config.security.allowedRepositoryPaths) {
      const allowedAbsolute = path.resolve(allowedPath);
      if (absolutePath.startsWith(allowedAbsolute)) {
        isAllowed = true;
        break;
      }
    }
    
    if (!isAllowed) {
      throw new ValidationError(`Access denied: Path is not in allowed list: ${inputPath}`);
    }
  }
  
  // Prevent path traversal attacks
  if (normalizedPath.includes('..')) {
    throw new ValidationError(`Invalid path: Path traversal detected: ${inputPath}`);
  }
}

export function validateBranchName(name: string): void {
  // Git branch name validation rules
  const invalidChars = /[\s~^:?*\[\]\\]/;
  if (invalidChars.test(name)) {
    throw new ValidationError(`Invalid branch name: Contains invalid characters: ${name}`);
  }
  
  if (name.startsWith('.') || name.startsWith('-')) {
    throw new ValidationError(`Invalid branch name: Cannot start with '.' or '-': ${name}`);
  }
  
  if (name.endsWith('.') || name.endsWith('.lock')) {
    throw new ValidationError(`Invalid branch name: Invalid ending: ${name}`);
  }
  
  if (name === '@') {
    throw new ValidationError(`Invalid branch name: Cannot be '@': ${name}`);
  }
  
  if (name.includes('..') || name.includes('@{')) {
    throw new ValidationError(`Invalid branch name: Contains invalid sequence: ${name}`);
  }
}

export function validateRemoteUrl(url: string): void {
  // Basic URL validation for git remotes
  const urlSchema = z.string().refine((val) => {
    // SSH URLs
    if (val.match(/^[\w.-]+@[\w.-]+:[\w./-]+\.git$/)) {
      return true;
    }
    
    // HTTP(S) URLs
    if (val.match(/^https?:\/\/.+\.git$/)) {
      return true;
    }
    
    // Git protocol
    if (val.match(/^git:\/\/.+\.git$/)) {
      return true;
    }
    
    // File URLs
    if (val.match(/^file:\/\/.+$/)) {
      return true;
    }
    
    // Local paths
    if (val.match(/^[./].+$/)) {
      return true;
    }
    
    return false;
  }, 'Invalid Git remote URL');
  
  try {
    urlSchema.parse(url);
  } catch (error) {
    throw new ValidationError(`Invalid remote URL: ${url}`);
  }
}

export function validateCommitMessage(message: string): void {
  if (!message || message.trim().length === 0) {
    throw new ValidationError('Commit message cannot be empty');
  }
  
  // Warn about conventional commit format
  const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?: .+/;
  if (!conventionalCommitPattern.test(message)) {
    // This is just a warning, not an error
    // logger.warn('Commit message does not follow conventional commit format');
  }
}

export function validateFilePattern(pattern: string): void {
  // Basic validation for file patterns
  if (pattern.includes('\0')) {
    throw new ValidationError('File pattern contains null character');
  }
  
  // Warn about potentially dangerous patterns
  if (pattern === '.' || pattern === '*' || pattern === '**') {
    // This could stage/unstage everything
    // logger.warn(`Broad file pattern used: ${pattern}`);
  }
}

export function requireConfirmation(operation: string): boolean {
  // In a real implementation, this would prompt the user
  // For now, we'll check configuration
  switch (operation) {
    case 'push':
      return config.security.requireConfirmationForPush;
    case 'force-push':
      return true; // Always require confirmation for force push
    case 'hard-reset':
      return true; // Always require confirmation for hard reset
    case 'clean':
      return true; // Always require confirmation for clean
    default:
      return false;
  }
}
