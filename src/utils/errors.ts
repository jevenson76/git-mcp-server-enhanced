export class GitError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'GitError';
  }
}

export class ToolError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export function isGitError(error: any): error is GitError {
  return error instanceof GitError || 
         (error?.name === 'GitError') ||
         (error?.message?.includes('fatal:') || error?.message?.includes('error:'));
}

export function formatError(error: any): string {
  if (error instanceof Error) {
    if (isGitError(error)) {
      // Extract git-specific error message
      const gitMessage = error.message
        .replace(/^fatal:\s*/i, '')
        .replace(/^error:\s*/i, '')
        .trim();
      return gitMessage;
    }
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Unknown error occurred';
}

export function wrapError(error: any, context: string): Error {
  const formattedError = formatError(error);
  
  if (error instanceof Error) {
    const wrapped = new Error(`${context}: ${formattedError}`);
    wrapped.stack = error.stack;
    return wrapped;
  }
  
  return new Error(`${context}: ${formattedError}`);
}
