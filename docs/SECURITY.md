# Security Guide

This document outlines the security features and best practices for using the Enhanced Git MCP Server.

## Security Features

### Path Validation

The server validates all file paths to prevent unauthorized access:

1. **Path Traversal Prevention**: Blocks paths containing `..` to prevent directory traversal attacks
2. **Allowed Paths**: Optionally restrict operations to specific directories
3. **Denied Paths**: Block access to sensitive directories
4. **Absolute Path Resolution**: All paths are resolved to absolute paths for validation

### Operation Restrictions

Configurable restrictions on potentially dangerous operations:

1. **Force Push Protection**: Disable force pushing to prevent history rewriting
2. **Destructive Operations**: Block operations like `git clean` and `git reset --hard`
3. **Push Confirmation**: Require explicit confirmation for push operations

### Input Validation

All inputs are validated using Zod schemas:

1. **Type Safety**: Ensures inputs match expected types
2. **Format Validation**: Validates branch names, URLs, and other formats
3. **Sanitization**: Removes or escapes potentially harmful characters

## Configuration

### Environment Variables

```bash
# Security settings
ALLOW_FORCE_PUSH=false
ALLOW_DESTRUCTIVE_OPERATIONS=false
REQUIRE_CONFIRMATION_FOR_PUSH=true

# Path restrictions
ALLOWED_REPOSITORY_PATHS=/home/user/projects,/home/user/work
DENIED_REPOSITORY_PATHS=/home/user/.ssh,/etc,/var

# Operational limits
GIT_MAX_DIFF_SIZE=1000000
GIT_OPERATION_TIMEOUT=30000
```

### Path Restrictions

#### Allowed Paths

When `ALLOWED_REPOSITORY_PATHS` is set, operations are restricted to these directories:

```bash
ALLOWED_REPOSITORY_PATHS=/home/user/projects,/opt/repos
```

- Only repositories within these paths can be accessed
- Subdirectories are automatically included
- Empty list means no restrictions (except denied paths)

#### Denied Paths

Paths listed in `DENIED_REPOSITORY_PATHS` are always blocked:

```bash
DENIED_REPOSITORY_PATHS=/etc,/var,/home/user/.ssh,/home/user/.gnupg
```

- Takes precedence over allowed paths
- Protects sensitive system and user directories
- Subdirectories are automatically blocked

### Operation Security

#### Force Push Protection

```bash
ALLOW_FORCE_PUSH=false
```

When disabled:
- `git push --force` is blocked
- `git push --force-with-lease` is still allowed (safer alternative)
- Prevents accidental history rewriting

#### Destructive Operations

```bash
ALLOW_DESTRUCTIVE_OPERATIONS=false
```

When disabled, blocks:
- `git clean` (without `--dry-run`)
- `git reset --hard`
- Other operations that permanently delete data

#### Push Confirmation

```bash
REQUIRE_CONFIRMATION_FOR_PUSH=true
```

When enabled:
- Push operations require explicit confirmation
- Prevents accidental pushes to wrong branches/remotes
- Can be bypassed with auto-approval configuration

## Best Practices

### 1. Principle of Least Privilege

- Only allow access to necessary repository paths
- Disable destructive operations unless required
- Use read-only access where possible

### 2. Secure Configuration

```json
{
  "mcpServers": {
    "git-secure": {
      "command": "npx",
      "args": ["@jevenson76/git-mcp-server-enhanced"],
      "env": {
        "ALLOWED_REPOSITORY_PATHS": "/home/user/work",
        "DENIED_REPOSITORY_PATHS": "/home/user/work/sensitive",
        "ALLOW_FORCE_PUSH": "false",
        "ALLOW_DESTRUCTIVE_OPERATIONS": "false",
        "REQUIRE_CONFIRMATION_FOR_PUSH": "true"
      }
    }
  }
}
```

### 3. Audit Logging

Enable detailed logging for security auditing:

```bash
LOG_LEVEL=debug
LOG_FORMAT=json
```

Logs include:
- All operations performed
- User/session information
- Success/failure status
- Error details

### 4. Regular Updates

Keep the server updated to receive security patches:

```bash
npm update @jevenson76/git-mcp-server-enhanced
```

### 5. Network Security

When using HTTP/SSE transport:
- Use HTTPS in production
- Configure CORS appropriately
- Use authentication tokens
- Restrict to localhost for development

## Security Considerations

### Remote Repository Access

1. **SSH Keys**: Store SSH keys securely, use ssh-agent
2. **HTTPS Credentials**: Use credential helpers, avoid hardcoding
3. **Access Tokens**: Use minimal scopes, rotate regularly

### Commit Signing

```bash
GIT_SIGN_COMMITS=true
```

When enabled:
- Commits are signed with GPG/SSH keys
- Requires proper key configuration
- Provides commit authenticity

### Sensitive Data

1. **Never commit secrets**: Use `.gitignore` for sensitive files
2. **Review diffs**: Check for accidental secret exposure
3. **Use git-secrets**: Integrate secret scanning tools

## Incident Response

### Suspicious Activity

If you notice suspicious activity:

1. Check logs for unauthorized operations
2. Review recent commits and pushes
3. Disable server if compromise suspected
4. Rotate credentials and access tokens
5. Audit repository history

### Recovery

1. **Backups**: Maintain regular repository backups
2. **Reflog**: Use git reflog to recover lost commits
3. **Remote copies**: Keep remote repositories synchronized

## Compliance

### Data Protection

- No user data is collected or transmitted by the server
- All operations are performed locally
- Logs are stored locally and can be disabled

### Access Control

- Integrates with system file permissions
- Respects Git credential configuration
- No additional authentication layer

## Security Checklist

- [ ] Configure allowed/denied repository paths
- [ ] Disable force push if not needed
- [ ] Disable destructive operations if not needed
- [ ] Enable push confirmation
- [ ] Set appropriate operation timeout
- [ ] Configure maximum diff size
- [ ] Enable appropriate logging level
- [ ] Review and test security configuration
- [ ] Document security policies for team
- [ ] Regular security audits

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Email security details to [maintainer email]
3. Include steps to reproduce
4. Allow time for patch before disclosure

We take security seriously and will respond promptly to valid reports.
