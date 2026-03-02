# AGENTS.md - Coding Guidelines for Living Dex Catalogue

## Project Overview

React + TypeScript Pokédex app using **Hexagonal/Clean Architecture** with Domain-Driven Design principles.

---

## Build/Lint/Test Commands

```bash
# Development
pnpm dev              # Start Vite dev server
pnpm build            # Type-check and build for production
pnpm preview          # Preview production build locally

# Testing
pnpm test             # Run all tests in watch mode
pnpm test -- run      # Run tests once (CI mode)
pnpm test <pattern>   # Run single test file (e.g., pnpm test PokemonId)
pnpm test:coverage    # Run with coverage report
pnpm test:browser     # Run browser tests with Playwright

# Linting
pnpm lint             # Run ESLint on all files
```

**Running a single test:**
```bash
pnpm test PokemonId              # Runs PokemonId.test.ts
pnpm test -- run src/domain/value-objects/PokemonId.test.ts
```

---

## Code Style Guidelines

### TypeScript Configuration

- **Target:** ES2022, strict mode enabled
- **Module:** ESNext with bundler resolution
- **JSX:** react-jsx transform
- `verbatimModuleSyntax: true` - use `import type` for type imports
- No unused locals/parameters allowed
- No unchecked side-effect imports

### Imports & Module Organization

```typescript
// Group imports: external → internal → types
import { useState } from 'react'                    // External libs
import { DomainError } from '../errors/DomainError' // Internal modules
import type { PokemonSpeciesData } from './types'   // Type imports

// Use .js extension for imports (TS allows importing .ts with .js extension)
import { PokemonId } from './PokemonId.js'
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Classes | PascalCase | `PokemonSpecies`, `GameVersion` |
| Interfaces | PascalCase | `PokemonSpeciesData` |
| Value Objects | PascalCase | `PokemonId`, `CaughtState` |
| Methods/Functions | camelCase | `create()`, `updateCaughtState()` |
| Private fields | underscore prefix | `_id`, `_name` |
| Constants | UPPER_SNAKE_CASE | `MINIMUM_ID`, `MAXIMUM_ID` |
| Files | PascalCase for classes | `PokemonSpecies.ts`, `PokemonId.test.ts` |

### Code Formatting

- 2 spaces indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multi-line objects/arrays
- Max line length: ~100 characters

---

## Architecture Patterns

### Layer Structure

```
src/
├── domain/           # Core business logic (no deps)
│   ├── entities/     # Aggregate roots with identity
│   ├── value-objects/# Immutable, equality-based
│   └── errors/       # Domain-specific errors
├── application/      # Use cases & ports
├── infrastructure/   # External adapters (API, storage)
└── ui/              # React components & hooks
```

### Value Objects Pattern

```typescript
export class PokemonId {
  private readonly _value: number
  
  private constructor(value: number) {
    this._validate(value)
    this._value = value
    Object.freeze(this)  // Ensure immutability
  }
  
  static create(value: number): PokemonId {
    return new PokemonId(value)
  }
  
  get value(): number {
    return this._value
  }
  
  equals(other: PokemonId): boolean {
    return this._value === other._value
  }
  
  private _validate(value: number): void {
    if (value < 1 || value > 151) {
      throw new DomainError(`Invalid Pokemon ID: ${value}`)
    }
  }
}
```

### Entity Pattern

```typescript
export class PokemonSpecies {
  private readonly _id: PokemonId
  private _caughtState: CaughtState  // Mutable state
  
  private constructor(/* ... */) { }
  
  static create(data: PokemonSpeciesData): PokemonSpecies {
    // Validation happens here
    return new PokemonSpecies(/* ... */)
  }
}
```

### Error Handling

Use `DomainError` for domain violations:

```typescript
import { DomainError } from '../errors/DomainError'

throw new DomainError('PokemonSpecies name cannot be empty')
```

---

## Testing Guidelines

### Test File Location

Place tests next to source files:
```
src/domain/value-objects/
├── PokemonId.ts
└── PokemonId.test.ts
```

### Test Structure

```typescript
import { describe, expect, test } from 'vitest'
import { PokemonId } from './PokemonId'
import { DomainError } from '../errors/DomainError'

describe('PokemonId', () => {
  describe('creation', () => {
    test('creates valid PokemonId', () => {
      const id = PokemonId.create(1)
      expect(id.value).toBe(1)
    })
    
    test('rejects invalid values', () => {
      expect(() => PokemonId.create(999)).toThrow(DomainError)
    })
  })
  
  describe('immutability', () => {
    test('instance is frozen', () => {
      const id = PokemonId.create(5)
      expect(Object.isFrozen(id)).toBe(true)
    })
  })
})
```

### Testing Principles

✅ **DO:**
- Test domain logic and business rules
- Test validation at boundaries
- Test immutability (Object.isFrozen)
- Use descriptive test names
- Group related tests with `describe`

❌ **DON'T:**
- Test TypeScript compilation errors
- Test private methods directly
- Test implementation details
- Use `@ts-expect-error` to test TypeScript protection

See [TESTING_PRINCIPLES.md](documentation/TESTING_PRINCIPLES.md) for full guidelines.

---

## React Components

- Use React 19 with Compiler
- Prefer function components
- Use hooks for state management
- Co-locate tests in `*.test.tsx` files

---

## Git Workflow

- Write descriptive commit messages
- Run `pnpm lint` and `pnpm test -- run` before committing
- Keep commits focused on single concerns
