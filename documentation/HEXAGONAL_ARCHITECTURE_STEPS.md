# Hexagonal Architecture Implementation Guide

A step-by-step guide for implementing a traditional hexagonal (clean) architecture for the Living Dex Catalogue.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Principles](#key-principles)
3. [Implementation Order](#implementation-order)
4. [Why This Order? (Beginner's Guide)](#why-this-order-beginners-guide)
   - [The House Building Analogy](#the-house-building-analogy)
   - [The Complete Flow](#the-complete-flow)
   - [Summary Table](#summary-table)
5. [Questions to Ask Yourself (By Step)](#questions-to-ask-yourself-by-step)
   - [Step 1: Domain Layer](#step-1-domain-layer)
   - [Step 2: Application Layer (Ports)](#step-2-application-layer-ports)
   - [Step 3: Application Layer (Use Cases)](#step-3-application-layer-use-cases)
   - [Step 4: Infrastructure Layer](#step-4-infrastructure-layer)
   - [Step 5: Composition Root](#step-5-composition-root)
   - [Step 6: UI Layer](#step-6-ui-layer)
   - [Cross-Cutting Questions](#cross-cutting-questions)
6. [Tips & Best Practices](#tips--best-practices)
   - [Keep Ports Minimal (YAGNI Principle)](#keep-ports-minimal-yagni-principle)
   - [Domain State Machines vs Use Case Logic](#domain-state-machines-vs-use-case-logic)
7. [Testing Strategy](#testing-strategy)
8. [Quick Reference: "Is This Right?"](#quick-reference-is-this-right)
9. [Implementation Steps (Detailed)](#implementation-steps-detailed)
   - [Step 1: Domain Layer (Complete)](#-step-1-domain-layer-complete)
   - [Step 2: Application Layer (Ports & Use Cases)](#-step-2-application-layer-ports--use-cases)
   - [Step 3: Infrastructure Layer (Adapters)](#-step-3-infrastructure-layer-adapters)
   - [Step 4: Composition Root (Dependency Injection)](#-step-4-composition-root-dependency-injection)
   - [Step 5: UI Layer (React Components)](#-step-5-ui-layer-react-components)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      UI / Presentation                      │
│                   (React Components)                        │
│                        ↓ depends on                         │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│              (Use Cases, Ports/Interfaces)                  │
│                        ↓ depends on                         │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                           │
│     (Entities, Value Objects, Domain Services, Errors)      │
│                     ← YOU ARE HERE                          │
└─────────────────────────────────────────────────────────────┘
         ↓                                    ↓
┌──────────────────┐              ┌──────────────────┐
│  Infrastructure  │              │  Infrastructure  │
│  (PokeAPI Client)│              │  (localStorage)  │
│  implements      │              │  implements      │
│  Repository Port │              │  Storage Port    │
└──────────────────┘              └──────────────────┘
```

**Key Principle:** Dependencies flow inward. Domain knows nothing about React, API, or Storage.

---

## Key Principles

1. **Dependency Rule:** Inner layers don't know about outer layers
2. **Dependency Inversion:** Depend on abstractions (ports), not implementations
3. **Single Responsibility:** Each layer has one reason to change
4. **Testability:** Domain and Application can be tested without React or API
5. **Swapability:** Can swap PokeAPI for mock, localStorage for IndexedDB

---

## Implementation Order

Follow this sequence to maintain clean architecture:

1. ✅ **Domain Layer** (DONE)
   - Entities
   - Value Objects
   - Domain Errors
   - Domain Tests

2. **Application Layer** (NEXT)
   - Define Ports (interfaces)
   - Implement Use Cases
   - Write Use Case tests

3. **Infrastructure Layer**
   - PokeAPI Client
   - Repository Implementation
   - localStorage Adapter

4. **Composition Root**
   - Wire dependencies together

5. **UI Layer** (LAST)
   - Custom Hooks
   - React Components
   - Styling

---

## Why This Order? (Beginner's Guide)

Think of building a hexagonal architecture like building a house with 4 floors. You must build from the foundation up.

```
4th Floor (Top)   →  UI (React - what users see)
                  ↓
3rd Floor         →  Application (WHAT your app does)
                  ↓
2nd Floor         →  Infrastructure (HOW things work)
                  ↓
1st Floor (Base)  →  Domain (Business rules) ✅ DONE
```

### The House Building Analogy

**Your Domain Layer (DONE) = The Foundation**

- This is the concrete slab of your house
- It holds everything up
- It contains your business rules (Pokemon IDs must be 1-151, names can't be empty)
- Pure TypeScript with no dependencies on React, APIs, or storage

**Step 1: Application Layer = The Blueprints**

Before electricians run wires, architects create blueprints saying "we need electricity here" and "we need water there." They don't care HOW electricity works - just that the house needs it.

**What you create:**

- **Ports (Interfaces):** Like electrical outlets - "I need to fetch Pokemon from somewhere" (`PokemonRepository`)
- **Use Cases:** Like rooms - "Load all Gen 1 Pokemon," "Mark Pokemon as caught"

**Why first?**
You define WHAT your app does without getting distracted by HOW. If you jump to "fetch from PokeAPI," you're locked into that decision. But if you say "I need Pokemon data," you could get it from PokeAPI, a database, or even a mock for testing.

**Step 2: Infrastructure Layer = The Utilities**

Now that blueprints say "we need electricity," electricians install wires and connect to the power grid.

**What you create:**

- **PokeAPI Client:** Actually fetches from `https://pokeapi.co`
- **Repository:** Uses the API client and caches results
- **Storage:** Saves to localStorage

**Why second?**
Your Application layer told you exactly what to build: "I need a way to fetch Pokemon" and "I need a way to save progress." You build those exact things without wasting time on features you don't need.

**Step 3: Composition Root = The Wiring**

The electrician connects outlets to wires. You create one file saying "Use PokeAPI for PokemonRepository" and "Use localStorage for Storage."

**What you create:**
`composition.ts` - wires everything:

```
PokeApiClientImpl → PokemonRepositoryImpl → LoadGen1Pokedex
                                               ↓
LocalStoragePokedexStorage ← TogglePokemonCaughtState
```

**Why third?**
You need both the Application layer (defining needs) AND Infrastructure layer (implementing solutions) before you can connect them.

**Step 4: UI Layer = The Interior Design**

Now that the house has power and water, you add furniture, paint walls, and hang pictures. This is what people see and use.

**What you create:**

- **Custom Hooks:** `usePokedex()`, `usePokemonToggle()`
- **Components:** `PokemonCard`, `PokedexGrid`, `ProgressBar`

**Why last?**
Because the UI is the **least important** part! (Sounds crazy, right?)

Your business rules (Domain) and app logic (Application) work whether the UI is React, Vue, or command-line. By building UI last, you ensure:

- Core logic is solid and tested
- You can change the UI later without breaking anything
- You could build a mobile app later using the same Domain and Application layers

### The Complete Flow

When someone clicks "Mark Bulbasaur as Caught":

1. **UI:** Button click triggers `usePokemonToggle` hook
2. **Application:** `TogglePokemonCaughtState` use case runs
   - Asks `PokemonRepository` to find Bulbasaur
   - Asks `PokedexStorage` to save the state
3. **Infrastructure:** Repository fetches from cache/API, Storage saves to localStorage
4. **Domain:** `PokemonSpecies.updateCaughtState()` changes NOT_CAUGHT → PENDING

**The Magic:** UI doesn't know about PokeAPI. Domain doesn't know about React. Each layer only talks to the layer directly below it.

### Summary Table

| Step | Layer          | Analogy    | What You Build           | Why This Order                   |
| ---- | -------------- | ---------- | ------------------------ | -------------------------------- |
| ✅   | Domain         | Foundation | Business rules, entities | Already done!                    |
| 1    | Application    | Blueprints | Ports, Use Cases         | Define needs before solutions    |
| 2    | Infrastructure | Utilities  | API client, Storage      | Build what Step 1 asked for      |
| 3    | Composition    | Wiring     | Connect everything       | Need Steps 1 & 2 first           |
| 4    | UI             | Interior   | React components         | Least important, most changeable |

**The Golden Rule:** Build from inside out. Domain → Application → Infrastructure → UI. Never let inner layers know about outer layers!

---

## Questions to Ask Yourself (By Step)

Use this checklist when implementing each layer. If you can't answer these questions clearly, you might be building the wrong thing.

### Step 1: Domain Layer

**Before creating an entity:**

- What are the business rules that must always be true?
- What can never change about this entity? (identity, invariants)
- What are the valid states and transitions?
- How do I prevent invalid data from existing?

**Before creating a value object:**

- Is this concept defined by its attributes or its identity?
- Should two instances with the same value be considered equal?
- Should this be immutable? (If yes → value object)
- What validation rules apply at creation time?

**For both:**

- Can I test this without React, API calls, or databases?
- If I showed this code to a Pokemon fan, would they understand the rules?

### Step 2: Application Layer (Ports)

**Before defining a port:**

- What external capability does my app need?
- Is this about fetching data, saving data, or something else?
- Will I need different implementations of this? (real API vs mock)
- Does this port change for different reasons than other ports?

**Before adding a method to a port:**

- Do I need this right now, or am I guessing about the future?
- Can I implement this with the external system I have in mind?
- Is this method specific enough, or too generic?

**Where should a port reside?**

- In hexagonal architecture ports should reside in the domain layer as they specify business logic.
- In my interpretation the ports should reside in the application layer because they are interacting with the application layer and the outside world.
- In this project the ports should reside in the domain layer as is the "strict" hexagonal architecture.

**Example decision tree:**

```
Need to get Pokemon?
├── From external API? → Create PokemonRepository port
├── Just in-memory data? → No port needed, construct in domain
└── From multiple sources? → One port, multiple adapters
```

**Repository vs Low-Level Client:**

Understand the difference between high-level Repository ports and low-level API clients:

```
┌─────────────────────────────────────┐
│         Application Layer           │
│   PokemonRepository.findById()      │ ← Returns PokemonSpecies (Domain)
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   PokemonRepositoryImpl             │
│     ↓ calls                         │
│   PokeApiClient.fetchPokemonById()  │ ← Returns raw API data (DTO)
├─────────────────────────────────────┤
│        External System              │
│        PokeAPI HTTP Endpoint        │
└─────────────────────────────────────┘
```

**PokemonRepository** (High-level, Domain-focused):

- Returns `PokemonSpecies` (domain entity)
- May cache results
- Handles "not found" gracefully (returns null)
- **Application layer** depends on this

**PokeApiClient** (Low-level, Technical):

- Returns `PokemonApiResponse` (raw DTO)
- Just makes HTTP calls
- Throws on HTTP errors
- **Infrastructure layer** uses this internally

**Rule:** Repository is what your **use cases** call. API client is what your **infrastructure** uses internally!

### Step 3: Application Layer (Use Cases)

**Before creating a use case:**

- What user goal or system operation does this represent?
- What ports does it need to accomplish this goal?
- Does it orchestrate multiple domain objects?
- What happens if part of the operation fails?

**During implementation:**

- Am I containing business logic that belongs in Domain?
- Am I doing too much? (Should this be two use cases?)
- Can I test this use case with mocked ports?
- Does the use case name describe the intent clearly?

**Naming check:**

- ❌ `UpdatePokemonData` (too vague)
- ✅ `TogglePokemonCaughtState` (specific action)
- ✅ `LoadGen1Pokedex` (clear scope)

### Step 4: Infrastructure Layer

**Before implementing an adapter:**

- Which port am I implementing?
- What external system will I integrate with?
- How do I handle failures from the external system?
- Should I cache results or call the API every time?

**Implementation questions:**

- Am I transforming external data into domain objects correctly?
- What happens if the API is down or returns unexpected data?
- Should I retry failed requests?
- Am I keeping implementation details out of the interface?

**Testing considerations:**

- Can I test this without hitting real APIs?
- Do I have test doubles (mocks/fakes) for the ports?

### Step 5: Composition Root

**Wiring questions:**

- Which implementation should I use for each port?
- Do different environments need different wiring? (dev vs test vs prod)
- Are there circular dependencies?
- Should any adapters be shared (singleton) or created fresh?

**Configuration:**

- What needs to be configurable? (API URLs, timeouts, etc.)
- Where do secrets/configurations live? (Not in the composition root!)

### Step 6: UI Layer

**Before creating a component:**

- What use case(s) does this UI feature need?
- What data does it need to display?
- What user actions trigger use cases?

**Component design:**

- Is this component doing too much? (Can I split it?)
- Am I putting business logic here that belongs in Domain/Application?
- Am I testing implementation details or user behavior?
- Does this component know about APIs, databases, or external systems? (It shouldn't!)

**Hook questions:**

- Does this hook represent a specific UI concern?
- Am I mixing UI state with domain state?
- Can I test this hook without rendering components?

### Cross-Cutting Questions (Ask at every step)

**Architecture health check:**

- Can I test the Domain and Application layers without React?
- Can I test the Domain and Application layers without real APIs?
- If I swap React for Vue, how much code changes?
- If I swap PokeAPI for a database, how much code changes?

**Code quality:**

- Does this code reveal intent or hide it?
- Would a new developer understand this without explanation?
- Am I following the project's naming conventions?
- Are my tests readable as documentation?

**When in doubt:**

- Start smaller than you think you need
- Put business rules in Domain, not Application or UI
- If you can't explain why something belongs in a layer, it probably doesn't
- Ask: "What problem am I solving?" not "What code can I write?"

---

## Tips & Best Practices

### Keep Ports Minimal (YAGNI Principle)

**Start with only what you need right now.** Don't plan for the future by adding methods "just in case."

**✅ Add now** (you know you need these):

```typescript
interface PokemonRepository {
  findById(id: PokemonId): Promise<PokemonSpecies | null>;
  findByGeneration(generation: number): Promise<PokemonSpecies[]>;
}
```

**❌ Don't add yet** (maybe later?):

```typescript
interface PokemonRepository {
  findById(id: PokemonId): Promise<PokemonSpecies | null>;
  findByGeneration(generation: number): Promise<PokemonSpecies[]>;
  searchByName(name: string): Promise<PokemonSpecies[]>; // YAGNI
  filterByType(type: string): Promise<PokemonSpecies[]>; // Not needed now
  paginate(page: number, size: number): Promise<PokemonSpecies[]>; // Future?
}
```

**Why start minimal?**

- You're probably wrong about the future - requirements change
- Dead code is technical debt - unused methods confuse developers
- Implementation burden - you must implement unused methods in tests/mocks
- Refactoring is easy - adding methods is trivial; removing them breaks things

**When to add more:** When you write a use case that needs it.

Example:

```typescript
// Writing this use case...
class SearchPokemonByName {
  execute(name: string) {
    // Oh! I need search functionality
    // Now add: repository.searchByName(name)
  }
}
```

**The sweet spot:** Start with 2-3 methods. When you think _"I wish the repository had X,"_ then add it.

**Exception:** Add obvious infrastructure stuff like error handling types, but skip speculative features.

---

### Domain State Machines vs Use Case Logic

**Keep state transition logic in Domain, not Use Cases.**

**✅ Correct - Domain owns the rule:**

```typescript
// Domain
class CaughtState {
  next(): CaughtState {
    switch (this.state) {
      case NOT_CAUGHT: return PENDING
      case PENDING: return CAUGHT
      case CAUGHT: return NOT_CAUGHT
    }
  }
}

// Use Case - just delegates
execute(pokemon) {
  pokemon.updateCaughtState() // Domain decides what "next" means
}
```

**❌ Wrong - Use Case owns the rule:**

```typescript
// Domain - just a setter
setCaughtState(state: CaughtState) {
  this._caughtState = state
}

// Use Case - contains business logic
execute(pokemon) {
  const current = pokemon.caughtState
  let next
  switch (current.value) {
    case 'NOT_CAUGHT': next = CaughtState.pending(); break
    case 'PENDING': next = CaughtState.caught(); break
    // Logic leaks out of domain!
  }
  pokemon.setCaughtState(next)
}
```

**Why Domain should own it:**

- State transitions define what the state machine IS (business rule)
- Prevents invalid transitions (can't skip from NOT_CAUGHT to CAUGHT)
- Avoids duplication across multiple use cases
- Follows "Tell, Don't Ask" - Pokemon knows how to advance its own state

**Rule of thumb:** If it defines what something IS or what it CAN DO, it belongs in Domain. Use Cases just decide WHEN to do things.

---

## Testing Strategy

| Layer          | Test Type         | Focus                             |
| -------------- | ----------------- | --------------------------------- |
| Domain         | Unit Tests        | Business rules, validation        |
| Application    | Unit Tests        | Use case logic, port interactions |
| Infrastructure | Integration Tests | API calls, storage persistence    |
| UI             | Component Tests   | User interactions, rendering      |

---

## Quick Reference: "Is This Right?"

| If you're wondering...                           | The answer is likely...                          |
| ------------------------------------------------ | ------------------------------------------------ |
| Should this validation be in Domain or Use Case? | **Domain**                                       |
| Should I add this port method "just in case"?    | **No**                                           |
| Should the UI call the repository directly?      | **No** (use use cases)                           |
| Can I skip the Application layer?                | **No** (that's not hexagonal)                    |
| Should I put this in a value object or entity?   | **Value object** if immutable and equality-based |
| Can I have business logic in the UI?             | **No**                                           |
| Should I create a port for in-memory data?       | **No**                                           |
| Can I test Domain without React?                 | **Yes** (if not, redesign)                       |

---

## Implementation Steps (Detailed)

### ✅ STEP 1: Domain Layer (COMPLETE)

**What you've built:**

```
src/domain/
├── entities/
│   ├── PokemonSpecies.ts      # Aggregate Root
│   └── Pokedex.ts             # Aggregate
├── value-objects/
│   ├── PokemonId.ts           # ID with validation
│   ├── CaughtState.ts         # State machine
│   └── GameVersion.ts         # Game version enum
└── errors/
    └── DomainError.ts         # Domain exceptions
```

**Key characteristics:**

- Pure TypeScript (no React, no fetch, no localStorage)
- All business rules validated here
- Immutable value objects (`Object.freeze()`)
- Entities use factory methods with validation
- Comprehensive unit tests

---

### 📋 STEP 2: Application Layer (PORTS & USE CASES)

**Purpose:** Define WHAT the system does, not HOW it does it.

#### 2.1 Define Ports (Interfaces)

Create: `src/application/ports/PokemonRepository.ts`

```typescript
import type { PokemonSpecies } from "../../domain/entities/PokemonSpecies.js";
import type { PokemonId } from "../../domain/value-objects/PokemonId.js";

export interface PokemonRepository {
  findById(id: PokemonId): Promise<PokemonSpecies | null>;
  findAll(): Promise<PokemonSpecies[]>;
  findByGeneration(generation: number): Promise<PokemonSpecies[]>;
}
```

Create: `src/application/ports/PokedexStorage.ts`

```typescript
import type { CaughtState } from "../../domain/value-objects/CaughtState.js";
import type { PokemonId } from "../../domain/value-objects/PokemonId.js";

export interface PokedexStorage {
  saveCaughtState(pokemonId: PokemonId, state: CaughtState): Promise<void>;
  loadCaughtState(pokemonId: PokemonId): Promise<CaughtState | null>;
  loadAllCaughtStates(): Promise<Map<number, CaughtState>>;
}
```

Create: `src/application/ports/PokeApiClient.ts`

```typescript
export interface PokeApiClient {
  fetchPokemonById(id: number): Promise<PokemonApiResponse>;
  fetchGenerationPokemon(generation: number): Promise<PokemonApiResponse[]>;
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  generation: number;
  availableIn: string[];
}
```

#### 2.2 Implement Use Cases

Create: `src/application/use-cases/LoadGen1Pokedex.ts`

```typescript
import { Pokedex } from "../../domain/entities/Pokedex.js";
import type { PokemonRepository } from "../ports/PokemonRepository.js";

export class LoadGen1Pokedex {
  constructor(private pokemonRepository: PokemonRepository) {}

  async execute(): Promise<Pokedex> {
    const allPokemon = await this.pokemonRepository.findByGeneration(1);
    return Pokedex.create({
      generation: 1,
      pokemonSpecies: allPokemon,
    });
  }
}
```

Create: `src/application/use-cases/TogglePokemonCaughtState.ts`

```typescript
import { PokemonId } from "../../domain/value-objects/PokemonId.js";
import type { PokedexStorage } from "../ports/PokedexStorage.js";
import type { PokemonRepository } from "../ports/PokemonRepository.js";

export class TogglePokemonCaughtState {
  constructor(
    private pokemonRepository: PokemonRepository,
    private pokedexStorage: PokedexStorage,
  ) {}

  async execute(pokemonId: number): Promise<void> {
    const id = PokemonId.create(pokemonId);
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new Error(`Pokemon ${pokemonId} not found`);
    }

    pokemon.updateCaughtState();
    await this.pokedexStorage.saveCaughtState(id, pokemon.caughtState);
  }
}
```

Create: `src/application/use-cases/GetPokedexProgress.ts`

```typescript
import { Pokedex } from "../../domain/entities/Pokedex.js";

export class GetPokedexProgress {
  execute(pokedex: Pokedex): ProgressResult {
    return {
      total: pokedex.totalPokemon,
      caught: pokedex.caughtCount,
      pending: pokedex.pendingCount,
      percentage: pokedex.completionPercentage,
    };
  }
}

export interface ProgressResult {
  total: number;
  caught: number;
  pending: number;
  percentage: number;
}
```

**Tests:** Create corresponding `.test.ts` files for each use case.

---

### 📋 STEP 3: Infrastructure Layer (ADAPTERS)

**Purpose:** Implement HOW the system does what the application layer defines.

#### 3.1 API Client Implementation

Create: `src/infrastructure/api/PokeApiClientImpl.ts`

```typescript
import { DomainError } from "../../domain/errors/DomainError.js";
import type {
  PokeApiClient,
  PokemonApiResponse,
} from "../../application/ports/PokeApiClient.js";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export class PokeApiClientImpl implements PokeApiClient {
  async fetchPokemonById(id: number): Promise<PokemonApiResponse> {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new DomainError(`Failed to fetch Pokemon ${id}`);
    }

    const data = await response.json();
    return this.mapToPokemonResponse(data);
  }

  async fetchGenerationPokemon(
    generation: number,
  ): Promise<PokemonApiResponse[]> {
    const response = await fetch(
      `${POKEAPI_BASE_URL}/generation/${generation}`,
    );

    if (!response.ok) {
      throw new DomainError(`Failed to fetch generation ${generation}`);
    }

    const data = await response.json();
    const pokemonSpecies = data.pokemon_species.slice(0, 151); // Gen 1 only

    // Fetch full details for each Pokemon
    const pokemonDetails = await Promise.all(
      pokemonSpecies.map((species: { name: string }) =>
        this.fetchPokemonByName(species.name),
      ),
    );

    return pokemonDetails.sort((a, b) => a.id - b.id);
  }

  private async fetchPokemonByName(name: string): Promise<PokemonApiResponse> {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name}`);
    const data = await response.json();
    return this.mapToPokemonResponse(data);
  }

  private mapToPokemonResponse(data: unknown): PokemonApiResponse {
    // Map raw API data to our interface
    return {
      id: (data as { id: number }).id,
      name: (data as { name: string }).name,
      generation: 1, // Determined by API or hardcoded for Gen 1
      availableIn: this.determineGameVersions(
        data as { game_indices: Array<{ version: { name: string } }> },
      ),
    };
  }

  private determineGameVersions(data: {
    game_indices: Array<{ version: { name: string } }>;
  }): string[] {
    const versions = new Set<string>();

    for (const gameIndex of data.game_indices) {
      const version = gameIndex.version.name;
      if (["red", "blue", "yellow"].includes(version)) {
        versions.add(version);
      }
    }

    return Array.from(versions);
  }
}
```

#### 3.2 Repository Implementation

Create: `src/infrastructure/api/PokemonRepositoryImpl.ts`

```typescript
import { PokemonSpecies } from "../../domain/entities/PokemonSpecies.js";
import { PokemonId } from "../../domain/value-objects/PokemonId.js";
import type { PokemonRepository } from "../../application/ports/PokemonRepository.js";
import type { PokeApiClient } from "../../application/ports/PokeApiClient.js";

export class PokemonRepositoryImpl implements PokemonRepository {
  private cache: Map<number, PokemonSpecies> = new Map();

  constructor(private apiClient: PokeApiClient) {}

  async findById(id: PokemonId): Promise<PokemonSpecies | null> {
    const cached = this.cache.get(id.value);
    if (cached) return cached;

    try {
      const response = await this.apiClient.fetchPokemonById(id.value);
      const species = PokemonSpecies.create({
        id: response.id,
        name: response.name,
        generation: response.generation,
        availableIn: response.availableIn,
      });

      this.cache.set(id.value, species);
      return species;
    } catch {
      return null;
    }
  }

  async findAll(): Promise<PokemonSpecies[]> {
    return this.findByGeneration(1);
  }

  async findByGeneration(generation: number): Promise<PokemonSpecies[]> {
    const responses = await this.apiClient.fetchGenerationPokemon(generation);

    return responses.map((response) => {
      const species = PokemonSpecies.create({
        id: response.id,
        name: response.name,
        generation: response.generation,
        availableIn: response.availableIn,
      });

      this.cache.set(response.id, species);
      return species;
    });
  }
}
```

#### 3.3 Storage Implementation

Create: `src/infrastructure/cache/LocalStoragePokedexStorage.ts`

```typescript
import { CaughtState } from "../../domain/value-objects/CaughtState.js";
import { PokemonId } from "../../domain/value-objects/PokemonId.js";
import type { PokedexStorage } from "../../application/ports/PokedexStorage.js";

const STORAGE_KEY = "living-dex-catalogue-caught-states";

export class LocalStoragePokedexStorage implements PokedexStorage {
  async saveCaughtState(
    pokemonId: PokemonId,
    state: CaughtState,
  ): Promise<void> {
    const states = this.loadAllStates();
    states[pokemonId.value] = state.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  }

  async loadCaughtState(pokemonId: PokemonId): Promise<CaughtState | null> {
    const states = this.loadAllStates();
    const stateValue = states[pokemonId.value];

    if (!stateValue) return null;

    return CaughtState.create(stateValue);
  }

  async loadAllCaughtStates(): Promise<Map<number, CaughtState>> {
    const states = this.loadAllStates();
    const result = new Map<number, CaughtState>();

    for (const [id, stateValue] of Object.entries(states)) {
      result.set(Number(id), CaughtState.create(stateValue as string));
    }

    return result;
  }

  private loadAllStates(): Record<number, string> {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}
```

---

### 📋 STEP 4: Composition Root (Dependency Injection)

**Purpose:** Wire everything together without dependencies knowing about each other.

Create: `src/composition.ts`

```typescript
import { PokeApiClientImpl } from "./infrastructure/api/PokeApiClientImpl.js";
import { PokemonRepositoryImpl } from "./infrastructure/api/PokemonRepositoryImpl.js";
import { LocalStoragePokedexStorage } from "./infrastructure/cache/LocalStoragePokedexStorage.js";
import { LoadGen1Pokedex } from "./application/use-cases/LoadGen1Pokedex.js";
import { TogglePokemonCaughtState } from "./application/use-cases/TogglePokemonCaughtState.js";
import { GetPokedexProgress } from "./application/use-cases/GetPokedexProgress.js";

// Infrastructure
const apiClient = new PokeApiClientImpl();
const pokemonRepository = new PokemonRepositoryImpl(apiClient);
const pokedexStorage = new LocalStoragePokedexStorage();

// Use Cases
export const loadGen1Pokedex = new LoadGen1Pokedex(pokemonRepository);
export const togglePokemonCaughtState = new TogglePokemonCaughtState(
  pokemonRepository,
  pokedexStorage,
);
export const getPokedexProgress = new GetPokedexProgress();
```

---

### 📋 STEP 5: UI Layer (React Components)

**Purpose:** Display data and handle user interactions.

#### 5.1 Custom Hooks

Create: `src/ui/hooks/usePokedex.ts`

```typescript
import { useState, useEffect } from "react";
import { Pokedex } from "../../domain/entities/Pokedex.js";
import { loadGen1Pokedex, getPokedexProgress } from "../../composition.js";
import type { ProgressResult } from "../../application/use-cases/GetPokedexProgress.js";

export function usePokedex() {
  const [pokedex, setPokedex] = useState<Pokedex | null>(null);
  const [progress, setProgress] = useState<ProgressResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPokedex();
  }, []);

  const loadPokedex = async () => {
    try {
      setLoading(true);
      const loadedPokedex = await loadGen1Pokedex.execute();
      setPokedex(loadedPokedex);
      setProgress(getPokedexProgress.execute(loadedPokedex));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pokedex");
    } finally {
      setLoading(false);
    }
  };

  return { pokedex, progress, loading, error, refresh: loadPokedex };
}
```

Create: `src/ui/hooks/usePokemonToggle.ts`

```typescript
import { useState } from "react";
import { PokemonSpecies } from "../../domain/entities/PokemonSpecies.js";
import { togglePokemonCaughtState } from "../../composition.js";

export function usePokemonToggle(onToggle: () => void) {
  const [toggling, setToggling] = useState<number | null>(null);

  const toggle = async (pokemon: PokemonSpecies) => {
    try {
      setToggling(pokemon.id);
      await togglePokemonCaughtState.execute(pokemon.id);
      onToggle();
    } finally {
      setToggling(null);
    }
  };

  return { toggle, toggling };
}
```

#### 5.2 Components

Create: `src/ui/components/PokemonCard.tsx`

```typescript
import { PokemonSpecies } from '../../domain/entities/PokemonSpecies.js'

interface PokemonCardProps {
  pokemon: PokemonSpecies
  onToggle: (pokemon: PokemonSpecies) => void
  isToggling: boolean
}

export function PokemonCard({ pokemon, onToggle, isToggling }: PokemonCardProps) {
  const caughtStateLabel = {
    'NOT_CAUGHT': 'Not Caught',
    'PENDING': 'Pending',
    'CAUGHT': 'Caught'
  }[pokemon.caughtState.value]

  return (
    <div className={`pokemon-card ${pokemon.caughtState.value.toLowerCase()}`}>
      <img src={pokemon.spriteUrl} alt={pokemon.name} />
      <div className="pokemon-info">
        <span className="pokemon-id">{pokemon.id}</span>
        <h3>{pokemon.name}</h3>
        <span className="caught-state">{caughtStateLabel}</span>
      </div>
      <button
        onClick={() => onToggle(pokemon)}
        disabled={isToggling}
      >
        Toggle
      </button>
    </div>
  )
}
```

Create: `src/ui/components/PokedexGrid.tsx`

```typescript
import { usePokedex } from '../hooks/usePokedex.js'
import { usePokemonToggle } from '../hooks/usePokemonToggle.js'
import { PokemonCard } from './PokemonCard.js'

export function PokedexGrid() {
  const { pokedex, progress, loading, error, refresh } = usePokedex()
  const { toggle, toggling } = usePokemonToggle(refresh)

  if (loading) return <div>Loading Pokedex...</div>
  if (error) return <div>Error: {error}</div>
  if (!pokedex) return <div>No pokedex loaded</div>

  return (
    <div className="pokedex-container">
      <div className="progress-bar">
        <span>{progress?.caught} / {progress?.total} ({progress?.percentage}%)</span>
      </div>

      <div className="pokemon-grid">
        {pokedex.pokemonSpecies.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onToggle={toggle}
            isToggling={toggling === pokemon.id}
          />
        ))}
      </div>
    </div>
  )
}
```

#### 5.3 Main App Component

Update: `src/App.tsx`

```typescript
import { PokedexGrid } from './ui/components/PokedexGrid.js'
import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Living Dex Catalogue</h1>
        <p>Generation 1 - Red, Blue, Yellow</p>
      </header>
      <main>
        <PokedexGrid />
      </main>
    </div>
  )
}

export default App
```
