# Contributing to Enhanced Git MCP Server

Thank you for your interest in contributing to the Enhanced Git MCP Server! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Accept feedback gracefully

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Include a clear description of the problem
3. Provide steps to reproduce
4. Include your environment details (OS, Node.js version, etc.)
5. Add relevant logs or error messages

### Suggesting Features

1. Check if the feature has already been suggested
2. Provide a clear use case
3. Explain how it would benefit users
4. Consider implementation complexity

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass (`npm test`)
6. Run linting (`npm run lint`)
7. Commit with a clear message
8. Push to your fork
9. Create a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/git-mcp-server-enhanced.git
cd git-mcp-server-enhanced

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Write unit tests for new functionality

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases

## Documentation

- Update README.md if adding new features
- Add JSDoc comments to new functions
- Update type definitions
- Include examples where helpful

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

Example:
```
feat(tools): add git bisect tool

Implement git bisect functionality to help find commits that introduced bugs.
Includes support for automated bisection with test scripts.

Closes #123
```

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a release PR
4. After merge, tag the release
5. Publish to npm

## Questions?

Feel free to open an issue for any questions about contributing!
