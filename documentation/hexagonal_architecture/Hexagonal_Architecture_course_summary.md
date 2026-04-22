# Hexagonal Architecture Applied to Frontend (React + TypeScript)

**Author:** Nacho Rodriguez Sanz  
**Reference Project:** Todo List with ports and adapters  
**Adapted for:** Living Dex Catalogue

This document explains the **theory** behind hexagonal architecture applied to frontend and how it has been implemented in this project.

---

## Table of Contents

1. Objective of Hexagonal Architecture
2. Project Map
3. Operation Flow
4. Key Concepts Implemented
5. Best Practices Implemented
6. Anti-Patterns
7. Switching Adapters
8. Why React Stays Clean
9. Testing Strategy
10. Review Checklist
11. Quality Metrics
12. Learning Structure
13. FAQ

---

## 1. Objective of Hexagonal Architecture

Separate the **core** (rules and use cases) from the **details** (UI, HTTP, storage).  
In frontend, this prevents UI (React) and infrastructure (fetch, LocalStorage) from contaminating the domain.

- **Domain**: entities, invariants, business errors.
- **Application**: use cases that orchestrate the domain through **ports**.
- **Infrastructure**: **adapters** that implement those ports (memory, LocalStorage, HTTP).
- **UI**: React; consumes **use cases** through a **Provider** (dependency injection).

**Dependencies** point inward: UI/Infra -> Application -> Domain. Never the other way around.

---

## 2. Project Map

```
src/
 |-- domain/                  # Core: entities + ports + errors
 |     |-- entities/           # PokemonSpecies.ts, Pokedex.ts
 |     |-- value-objects/      # PokemonId, CaughtState, GameVersion
 |     |-- ports/             # PokemonRepository.ts
 |     |-- errors/           # DomainError.ts
 |
 |-- application/            # Use cases
 |     |-- ports/            # Application ports
 |     |-- use-cases/        # LoadGen1Pokedex, TogglePokemonCaughtState
 |
 |-- infrastructure/         # Concrete adapters
 |     |-- api/              # PokeApiPokemonRepository
 |     |-- cache/            # LocalStoragePokedexStorage
 |     |-- http/             # HTTP Adapters
 |
 |-- ui/                    # React
 |     |-- providers/        # PokedexProvider
 |     |-- hooks/            # usePokedex, usePokemonToggle
 |     |-- components/       # PokemonCard, PokedexGrid
 |     |-- containers/       # PokedexApp
 |
 |-- anti-patterns/         # Examples of what NOT to do
```

### Decisions

- **Domain does not know** about React, fetch, or anything from the browser.
- **Application** only knows **interfaces** (ports) from the domain.
- **UI** does not know infrastructure; **uses injected** use cases.
- Infrastructure is **replaceable** (memory, LocalStorage, HTTP).

---

## 3. Operation Flow

1. User clicks "Mark as caught" on a Pokemon.
2. Component calls `TogglePokemonCaughtStateUseCase.execute`.
3. Use case validates and delegates to `PokemonRepository`.
4. Adapter (e.g., `PokeApiPokemonRepository`) fetches data.
5. State is saved to `PokedexStorage` (localStorage).
6. UI re-lists and renders.

### Flow Diagram

```
[User] -> [PokemonCard] -> [TogglePokemonCaughtStateUseCase]
                                    |
                                    v
                          [PokemonSpecies Entity]
                                    |
                                    v
                          [PokemonRepository]
                                    |
                                    v
                               [Adapter]
                                    |
                                    v
                               [PokeAPI]
                                      
                          [PokedexStorage]
                                    |
                                    v
                              [LocalStorage]
```

---

## 4. Key Concepts Implemented

### 4.1 Rich Entities vs Anemic Entities

- **Rich Domain**: `PokemonSpecies.ts` with behavior (`updateCaughtState()`, validations)
- **Anemic Domain**: See anti-patterns for contrast

### 4.2 Value Objects

- `PokemonId`: Type-safe identifiers with validation (1-151 for Gen 1)
- `CaughtState`: Valid states with controlled transitions (NOT_CAUGHT -> PENDING -> CAUGHT)
- `GameVersion`: Valid game versions (Red, Blue, Yellow)

### 4.3 Ports and Adapters

- **Port**: `PokemonRepository` (application interface in this project)
- **Adapters**:
  - `PokeApiPokemonRepository` (production)
  - `PokeApiPokemonRepositoryMock` (development/testing)

### 4.4 Use Cases

- `LoadGen1Pokedex`: Load all Gen 1 Pokemon
- `TogglePokemonCaughtState`: Toggle caught state of a Pokemon
- `GetPokedexProgress`: Get Pokedex progress

### 4.5 Dependency Injection

- `PokedexProvider`: React Context for DI
- Environment configuration (development, production)
- Custom hooks that encapsulate use cases

---

## 5. Best Practices Implemented

### 5.1 Domain

- **Model the domain first**: business names, rules, and invariants.
- **Value Objects** for important concepts (ID, Title, Status)
- **Rich entities** with encapsulated behavior
- **Protected invariants** in constructors and methods

### 5.2 Application

- **Thin use cases**: orchestrate, validate, delegate.
- **Specific DTOs** for input and output
- **Functional error handling** with `Result<T, E>` type
- **Atomic transactions** per use case

### 5.3 Infrastructure

- **Narrow ports** (clear methods, no infra detail leaking).
- **Interchangeable adapters** without modifying domain code
- **Error translation** from infrastructure to domain
- **Externalized configuration** per environment

### 5.4 UI

- **Dependency injection** in UI (Context/Provider) to change adapters without touching components.
- **Custom hooks** that encapsulate use case logic
- **Pure components** separated from smart containers
- **Local vs global state** well differentiated

---

## 6. Anti-Patterns

### 6.1 Tight Coupling

- **Problem**: Direct fetch in React components
- **Solution**: Use cases injected via hooks

### 6.2 Anemic Domain

- **Problem**: Entities without behavior, only getters/setters
- **Solution**: Rich entities with business methods

### 6.3 God Components

- **Problem**: Components that do fetch, validation, UI, and state
- **Solution**: Separation of responsibilities with hooks and use cases

### 6.4 Leaky Abstractions

- **Problem**: Use cases that return HTTP Response or API errors
- **Solution**: Specific domain errors

---

## 7. Switching Adapters

The project's `PokedexProvider` creates use cases with a default repository based on environment.

```typescript
// In src/main.tsx
<PokedexProvider environment="development">     // Mock
<PokedexProvider environment="production">     // PokeAPI
```

Or inject custom use cases:

```typescript
const customRepository = new CustomPokemonRepository({
  baseUrl: 'https://my-api.com',
});
const customUseCases = createPokedexUseCases(customRepository);

<PokedexProvider useCases={customUseCases}>
  <PokedexApp />
</PokedexProvider>
```

---

## 8. Why React Stays Clean

Components only **invoke use cases** and display data. They do not know how a task is persisted.  
This reduces cognitive load and allows infrastructure to evolve without rewriting the UI.

### Before (Anti-pattern)

```typescript
// Component coupled to HTTP
const response = await fetch('/api/pokemon', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});
```

### After (Hexagonal)

```typescript
// Component using use case
const success = await togglePokemonCaughtState(pokemonId);
```

---

## 9. Testing Strategy

### 9.1 Domain (Unit Tests)

```typescript
describe('PokemonSpecies Entity', () => {
  it('should transition caught state correctly', () => {
    const pokemon = PokemonSpecies.create({ id: 1, name: 'Bulbasaur' });
    expect(pokemon.caughtState.value).toBe('NOT_CAUGHT');
    
    pokemon.updateCaughtState();
    expect(pokemon.caughtState.value).toBe('PENDING');
    
    pokemon.updateCaughtState();
    expect(pokemon.caughtState.value).toBe('CAUGHT');
  });
});
```

### 9.2 Use Cases (Integration Tests)

```typescript
describe('TogglePokemonCaughtStateUseCase', () => {
  it('should toggle pokemon caught state successfully', async () => {
    const mockRepo = new PokemonRepositoryMock();
    const mockStorage = new PokedexStorageMock();
    const useCase = new TogglePokemonCaughtState(mockRepo, mockStorage);

    const result = await useCase.execute(1);
    expect(result.isSuccess).toBe(true);
  });
});
```

### 9.3 UI (Component Tests)

```typescript
describe('PokemonCard', () => {
  it('should render pokemon data', () => {
    const mockUseCases = createMockUseCases();
    render(
      <PokedexProvider useCases={mockUseCases}>
        <PokemonCard pokemon={mockPokemon} />
      </PokedexProvider>
    );
  });
});
```

---

## 10. Review Checklist

- [x] Domain without UI or infra dependencies.
- [x] Clear and minimal ports.
- [x] Use cases independent of adapters.
- [x] UI with dependency injection.
- [x] Interchangeable repository (mock, real API).
- [x] Value Objects for important concepts.
- [x] Rich entities with behavior.
- [x] Functional error handling.
- [x] Tests for each layer.
- [x] Documentation and anti-pattern examples.

---

## 11. Quality Metrics

### Achieved

- **Test coverage**: Prepared for 90%+ coverage
- **Coupling**: Low - independent layers
- **Cohesion**: High - clear responsibilities
- **Cyclomatic complexity**: Low - simple functions
- **Duplication**: Minimal - centralized logic

### Comparison with Anti-patterns

| Metric               | Anti-pattern | Hexagonal |
| -------------------- | ------------ | --------- |
| Lines per function   | 50+          | <20       |
| External deps        | 10+          | 2-3       |
| Required tests       | Integration  | Unit      |
| Build time           | Slow         | Fast      |
| Ease of change       | Difficult    | Easy      |

---

## 12. Learning Structure

### For Students

1. **Start with the domain** (`src/domain/`)
   - Read `PokemonSpecies.ts` to understand rich entities
   - Study Value Objects (`PokemonId`, `CaughtState`, `GameVersion`)
   - Analyze the `PokemonRepository` port

2. **Continue with application** (`src/application/`)
   - Examine use cases like `LoadGen1Pokedex`
   - Understand the Request/Response pattern
   - Analyze error handling with `Result<T, E>`

3. **Explore infrastructure** (`src/infrastructure/`)
   - Compare adapters: Mock vs Real API
   - Understand configuration and dependency injection

4. **Analyze UI** (`src/ui/`)
   - See how hooks encapsulate use cases
   - Study the Provider pattern for DI

5. **Contrast anti-patterns** (`src/anti-patterns/`)
   - Analyze problems in BAD_ code
   - Compare with GOOD_ solutions

### For Instructors

- **Module 1**: Hexagonal architecture theory (1h)
- **Module 2**: Domain implementation (2h)
- **Module 3**: Use cases and application (1.5h)
- **Module 4**: Infrastructure adapters (1.5h)
- **Module 5**: UI and dependency injection (2h)
- **Module 6**: Anti-patterns and refactoring (1h)
- **Module 7**: Testing strategy (1h)

---

## 13. FAQ

### Is this overkill for a simple app?

Yes and no. For a real simple app, probably yes. But to learn architecture and apply it in complex enterprise projects, it is perfect.

### Can it be used without TypeScript?

Technically yes, but you would lose a lot of the value. TypeScript is essential for enforcing interfaces and contracts.

### Does it work with other frameworks?

Yes, the principles are framework-agnostic. Only the UI layer would change (React, Vue, Angular, etc.).

### How do I handle global state?

With use cases and custom hooks. State is maintained in repositories and accessed via use cases.

### What about performance?

For small apps, it might be slightly slower. For large apps, separation of concerns usually improves performance.

---

## Architecture Layers

### Domain Layer

The **domain layer** is the core of hexagonal architecture. It represents pure business logic without external dependencies.

#### Fundamental Principles

1. **Independence**: Does not depend on frameworks, databases, or UI
2. **Purity**: Only contains business logic
3. **Stability**: It is the layer that changes the least
4. **Expressiveness**: Uses the domain language (ubiquitous language)

#### Main Components

**Entities**
- Objects with unique identity
- Encapsulate data and behaviors
- Maintain domain invariants

**Value Objects**
- Immutable objects without identity
- Compared by value, not reference
- Provide type safety and expressiveness

**Invariants**
- Business rules that must always hold
- Validated in constructors and methods

#### Advantages in Frontend

1. **Testability**: Pure logic, easy to test
2. **Reusability**: Independent of UI framework
3. **Maintainability**: Isolated changes
4. **Clarity**: Expresses business rules clearly

---

### Application Layer

The **application layer** orchestrates domain operations and coordinates the workflow of use cases.

#### Responsibilities

1. **Orchestration**: Coordinates multiple entities and domain services
2. **Transactions**: Maintains consistency of operations
3. **Control flow**: Defines the sequence of steps for each use case
4. **Translation**: Converts between external and internal formats
5. **Coordination**: Handles communication between ports

#### Design Principles

**Single Responsibility**
- Each use case has a specific responsibility
- Focuses on WHAT to do, not HOW to do it

**Dependency Inversion**
- Depends on interfaces (ports), not implementations
- Adapters are injected from outside

**Composition**
- Use cases can use other use cases
- Complex operations are composed from simple operations

#### Use Case Structure

```typescript
export class LoadGen1Pokedex {
  constructor(private pokemonRepository: PokemonRepository) {}

  async execute(): Promise<Result<Pokedex, UseCaseError>> {
    // 1. Validate input
    // 2. Get data from repository
    // 3. Apply business rules
    // 4. Return result
  }
}
```

#### Error Handling

1. **Domain errors**: Propagated as-is
2. **Infrastructure errors**: Translated to application errors
3. **Validation errors**: Handled before reaching the domain

---

### Infrastructure Layer

The **infrastructure layer** contains adapters that implement ports defined in the application.

#### Responsibilities

1. **Implement ports**: Provides concrete implementations
2. **Data management**: Handles persistence, APIs, caches
3. **Data translation**: Converts between internal and external formats
4. **Configuration**: Handles technology-specific configurations
5. **Error handling**: Translates infrastructure errors to domain errors

#### Design Principles

**Adapter Pattern**
- Adapts external interfaces to domain interfaces
- Allows changing technologies without affecting the domain

**Dependency Inversion**
- Implements interfaces defined by higher layers
- Does not define contracts, fulfills them

**Strategy Pattern**
- Multiple implementations of the same port
- Interchangeable based on context or configuration

#### Types of Adapters

**Data Repositories**
- In-Memory: For fast testing and development
- LocalStorage: Browser persistence
- HTTP: REST API communication (PokeAPI)

**External Services**
- HTTP Client: For REST APIs
- Cache: For performance optimization

#### Structure by Technology

```
infrastructure/
|-- api/           # API client implementations
|-- cache/         # Browser persistence
|-- http/          # HTTP/REST communication
|-- shared/        # Shared utilities
```

#### Error Handling

1. **Capture**: Intercepts infrastructure-specific errors
2. **Translate**: Converts to domain errors
3. **Preserve**: Maintains original information for debugging
4. **Propagate**: Returns errors using the Result pattern

---

### UI Layer

The UI layer is designed following Hexagonal Architecture principles. UI acts as an **external adapter** that consumes domain use cases through well-defined ports.

#### Key Principles

- **Dependency Inversion**: UI depends on abstractions (use cases), not concrete implementations
- **Separation of Concerns**: Each layer has a specific responsibility
- **Testability**: Easy injection of mocks and stubs
- **Flexibility**: Changing implementations without affecting the UI

#### UI Structure

```
src/ui/
|-- components/          # Pure presentational components
|     |-- PokemonCard.tsx
|     |-- PokedexGrid.tsx
|-- containers/          # Smart container components
|     |-- PokedexApp.tsx
|-- hooks/              # Custom hooks for UI logic
|     |-- usePokedex.ts
|     |-- usePokemonToggle.ts
|-- providers/          # Context providers and DI
|     |-- PokedexProvider.tsx
```

#### Implemented Patterns

**Dependency Injection Container**
- Location: `providers/PokedexProvider.tsx`
- Purpose: Centralize configuration and dependency injection
- Benefit: Total decoupling between UI and concrete implementations

**Container/Presentational Pattern**
- Containers: Handle logic and state
- Presentational: Presentational only
- Benefit: Clear separation between logic and presentation

**Custom Hooks Pattern**
- Location: `hooks/usePokedex.ts`, `hooks/usePokemonToggle.ts`
- Purpose: Encapsulate state logic and side effects
- Benefit: Logic reuse between components

#### Architecture Benefits

1. **Extreme Testability**: Easy mocking and complete isolation
2. **Implementation Flexibility**: Changing implementations without touching UI
3. **Maintainability**: Domain changes do not affect UI
4. **Developer Experience**: Hot reload, DevTools, easy debugging

---

### Anti-Patterns

This folder contains examples of common anti-patterns that violate hexagonal architecture principles.

#### Types of Anti-Patterns

**1. Tight Coupling**
- Problem: UI components that know infrastructure details
- Example: React component that directly fetches from APIs
- Solution: Use use cases and dependency injection

**2. Anemic Domain**
- Problem: Entities without behavior, only data
- Example: Pokemon as a simple interface without logic
- Solution: Rich entities with behavior and validations

**3. God Components**
- Problem: Component that does too many things
- Example: PokedexApp that handles fetch, validation, UI, and state
- Solution: Separation of responsibilities across components/hooks

**4. Leaky Abstractions**
- Problem: Implementation details that leak to upper layers
- Example: Use cases that return HTTP Response or API errors
- Solution: Appropriate abstractions and error translation

---

## Additional Resources

### Recommended Readings

- Hexagonal Architecture - Alistair Cockburn
  - https://alistair.cockburn.us/hexagonal-architecture/
- Clean Architecture - Robert C. Martin
  - https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- DDD and Hexagonal Architecture
  - https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/

### Tools Used

- React 18+ with Hooks and Context
- TypeScript for type safety
- Vite for fast development
- Vitest for testing
- ESLint + React Compiler for code quality
