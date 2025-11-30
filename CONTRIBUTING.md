# Contributing to FairTradeWorker

Thank you for your interest in contributing to FairTradeWorker! This document provides guidelines and information for contributors.

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone. We pledge to:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or personal attacks
- Publishing others' private information
- Any conduct that could reasonably be considered inappropriate

### Reporting Issues

Report unacceptable behavior to conduct@fairtradeworker.com. All complaints will be reviewed and investigated promptly.

---

## 🤝 How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** using the bug report template
3. Include:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Open a discussion** to gather feedback
3. **Create a feature request issue** with:
   - Problem description
   - Proposed solution
   - Alternative approaches considered
   - Implementation considerations

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

---

## 💻 Development Environment Setup

### Prerequisites

- **Node.js** 18 or higher
- **npm** 8 or higher
- **Git** 2.x or higher

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/fairtradeworker.git
cd fairtradeworker

# Add upstream remote
git remote add upstream https://github.com/FairTradeWorker/fairtradeworker.git

# Install dependencies
npm install

# Install mobile dependencies
cd mobile && npm install && cd ..

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Type checking
npm run typecheck
```

---

## 🌿 Branch Naming Conventions

Use descriptive branch names with the following prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/video-upload` |
| `bugfix/` | Bug fixes | `bugfix/login-error` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |
| `docs/` | Documentation changes | `docs/api-reference` |
| `refactor/` | Code refactoring | `refactor/auth-service` |
| `test/` | Test additions/fixes | `test/payment-flow` |

### Examples

```bash
git checkout -b feature/contractor-dashboard
git checkout -b bugfix/territory-map-loading
git checkout -b docs/deployment-guide
```

---

## 📝 Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

### Examples

```bash
feat(auth): add OAuth2 login with Google
fix(jobs): resolve infinite loading on job details
docs(readme): update installation instructions
refactor(api): simplify error handling middleware
test(payments): add Stripe webhook tests
```

### Breaking Changes

Add `!` after the type or use `BREAKING CHANGE:` in footer:

```bash
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: /api/auth/login now requires email instead of username
```

---

## 🔀 Pull Request Process

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

3. **Update documentation** if needed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Added/updated tests
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. At least one maintainer review required
2. All CI checks must pass
3. Conflicts must be resolved
4. Squash merge preferred for clean history

---

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define explicit types (avoid `any`)
- Use interfaces for object shapes
- Use type for unions and intersections

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { ... };
```

### React Components

- Use functional components with hooks
- Use named exports
- Props interface should be defined
- Keep components focused and small

```tsx
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

### Formatting

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: 100 characters max
- **Trailing commas**: ES5 compatible

ESLint and Prettier handle formatting automatically:

```bash
npm run lint:fix
```

### File Naming

- **Components**: PascalCase (`JobCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useJobs.ts`)
- **Utilities**: camelCase (`formatters.ts`)
- **Types**: PascalCase (`types.ts`)

### Import Order

```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal modules
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 3. Types
import type { User, Job } from '@/types';

// 4. Styles
import './styles.css';
```

---

## 🧪 Testing Requirements

### Test Files

- Place tests next to source files: `Component.tsx` → `Component.test.tsx`
- Or use `__tests__` directory

### What to Test

- Component rendering
- User interactions
- API integrations
- Edge cases
- Error states

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📖 Documentation Standards

### Code Comments

- Comment complex logic
- Use JSDoc for public APIs
- Avoid obvious comments

```typescript
/**
 * Calculates the optimal route for a contractor's jobs.
 * Uses a modified nearest-neighbor algorithm.
 * 
 * @param jobs - Array of jobs to route
 * @param startLocation - Contractor's starting location
 * @returns Ordered array of jobs with distances
 */
export function calculateOptimalRoute(
  jobs: Job[],
  startLocation: Location
): RouteResult {
  // ...
}
```

### README Files

- Include in new feature directories
- Document purpose, usage, and examples
- Keep up-to-date with changes

### API Documentation

- Document all endpoints
- Include request/response examples
- List possible error codes

---

## 🆘 Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs and request features
- **Email**: contributors@fairtradeworker.com

---

## 🙏 Recognition

Contributors are recognized in:

- CHANGELOG.md for each release
- GitHub contributors page
- Annual contributor spotlight

---

**Thank you for contributing to FairTradeWorker!**

*Together, we're building the future of fair trade infrastructure.*
