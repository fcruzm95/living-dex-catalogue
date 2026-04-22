# Naming Conventions

This document describes the naming conventions used for **ports** (interfaces), **adapters** (implementations), and **domain files** in this project.

---

## Table of Contents

1. [Core Principle](#core-principle)
2. [Domain File Naming](#domain-file-naming)
3. [Port Suffixes](#port-suffixes)
4. [Port vs Adapter Naming](#port-vs-adapter-naming)
5. [How to Choose a Suffix](#how-to-choose-a-suffix)
6. [Anti-Patterns](#anti-patterns)
7. [Summary](#summary)

---

## Core Principle

> Port names should never reveal **how** or **where** — only **what** and **why**.

Ports define **what** the domain needs, not how it's implemented.

---

## Domain File Naming

| Type          | Convention                       | Example                                |
| ------------- | -------------------------------- | -------------------------------------- |
| Entities      | PascalCase, singular noun        | `Pokedex.ts`, `PokemonSpecies.ts`      |
| Value Objects | PascalCase, descriptive noun     | `PokemonId.ts`, `CaughtState.ts`       |
| Errors        | PascalCase, ends with `Error`    | `DomainError.ts`                       |
| Ports         | PascalCase, noun describing role | `PokedexRepository.ts`                 |
| Tests         | Same as source + `.test` suffix  | `Pokedex.test.ts`, `PokemonId.test.ts` |

### Entities

Entities represent **domain concepts with identity**.

```typescript
// src/domain/entities/Pokedex.ts
export class Pokedex { ... }
```

- Group related domain logic
- Have identity that persists across state changes
- May have mutable properties (tracked carefully)

### Value Objects

Value Objects are **immutable, equality-based** components.

```typescript
// src/domain/value-objects/PokemonId.ts
export class PokemonId { ... }
```

- No identity of their own
- Compared by value, not reference
- Always frozen after creation

### Errors

Errors represent **domain rule violations**.

```typescript
// src/domain/errors/DomainError.ts
export class DomainError extends Error { ... }
```

- Thrown when domain rules are violated
- Named descriptively (e.g., `InvalidPokemonIdError`)
- Includes context about what went wrong

### Ports (Interfaces)

Ports define **what the domain needs**, without specifying how.

```typescript
// src/domain/ports/PokedexRepository.ts
export interface PokedexRepository { ... }
```

- Abstract interfaces in `src/domain/ports/`
- Implementation lives in `src/infrastructure/`
- Named after their role in the domain

---

## Port Suffixes

| Suffix       | Meaning                   | Use When                              |
| ------------ | ------------------------- | ------------------------------------- |
| `Provider`   | Supplies/fetches data     | Read-only, on-demand access           |
| `Repository` | Stores and retrieves      | Full data lifecycle (CRUD)            |
| `Gateway`    | Talks to external systems | Integration with third-party services |
| `Service`    | Business operations       | Coordinated actions or complex logic  |
| `Client`     | Initiates communication   | Outbound calls to external systems    |

---

## Port vs Adapter Naming

```
Port (Interface)         → describes WHAT + role (abstract)
Adapter (Implementation) → describes HOW + where (concrete)
```

### Examples

| Port (Interface)         | Adapter (Implementation)             | Rationale                        |
| ------------------------ | ------------------------------------ | -------------------------------- |
| `PokemonDataProvider`    | `PokeApiPokemonDataProvider`         | "Provider" = read-only fetch     |
| `UserProgressRepository` | `LocalStorageUserProgressRepository` | "Repository" = full persistence  |
| `PaymentGateway`         | `StripePaymentGateway`               | "Gateway" = external integration |
| `EmailService`           | `SmtpEmailService`                   | "Service" = business operation   |

---

## How to Choose a Suffix

### Provider

Use when the primary purpose is **fetching data on demand**.

- Read-only operations
- No storage lifecycle
- External data source

```typescript
interface PokemonDataProvider {
  fetchAllPokemon(): Promise<PokemonSpeciesData[]>;
}
```

### Repository

Use when you need **full CRUD lifecycle** — create, read, update, delete.

- Persistent storage
- State management
- Loading and saving user data

```typescript
interface UserProgressRepository {
  save(progress: Map<PokemonId, CaughtState>): Promise<void>;
  load(): Promise<Map<PokemonId, CaughtState>>;
}
```

### Gateway

Use when **integrating with an external system** that has its own protocols.

- Third-party APIs
- External services
- Protocol translations

### Service

Use when performing **business operations** that may involve multiple steps.

- Complex calculations
- Coordinated workflows
- Business rules

### Client

Use when **initiating outbound communication**.

- HTTP clients
- WebSocket connections
- Event emitters

---

## Anti-Patterns

- ❌ `MySQLUserRepository` — port name reveals **how** (MySQL)
- ❌ `ApiDataProvider` — port name reveals **where** (API)
- ❌ `LocalStorageRepository` — port name reveals **implementation**

- ✅ `UserRepository` — port name reveals **what**
- ✅ `PokemonDataProvider` — port name reveals **what**
- ✅ `UserProgressRepository` — port name reveals **what**

---

## Summary

### Port Suffix Decision Tree

```
Does it fetch data on-demand (read-only)?
  → YES → Provider
  → NO  → Is it persistent (CRUD)?
           → YES → Repository
           → NO  → Is it an external integration?
                    → YES → Gateway
                    → NO  → Is it a business operation?
                             → YES → Service
                             → NO  → Client
```

### Naming Summary

| Question                              | Answer Determines                   |
| ------------------------------------- | ----------------------------------- |
| Is it read-only?                      | `Provider`                          |
| Is it persistent?                     | `Repository`                        |
| Is it external?                       | `Gateway`                           |
| Is it a business operation?           | `Service`                           |
| Does it initiate outbound calls?      | `Client`                            |
| Is it a domain concept with identity? | Entity (PascalCase)                 |
| Is it immutable and equality-based?   | Value Object (PascalCase)           |
| Does it represent a domain violation? | Error (PascalCase, ends with Error) |