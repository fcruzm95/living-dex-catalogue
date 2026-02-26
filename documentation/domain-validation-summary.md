# Domain Layer Validation - Summary

## Overview
This document summarizes the validation approaches discussed for the Living Pokedex Tracker application following Ports and Adapters (Hexagonal) Architecture.

---

## Key Question: Should Validation Functions Throw or Return Errors?

### ✅ Recommended: Throw Directly in Validation Functions

**Pattern:**
```typescript
private _validation(value: number): void {
  if (value < 1 || value > 151) {
    throw new DomainError(`There's no pokemon with id ${value}`);
  }
}
```

**Why This Fits Ports & Adapters Best:**

1. **Fail Fast Principle**
   - Invalid objects can't be created
   - Domain invariants are protected
   - Entity is always valid after construction

2. **Always-Valid Domain Model**
   - Ensures value objects are immutable and always valid
   - Entities maintain invariants
   - No "zombie" objects in invalid states

3. **Constructor Validation is Standard**
   - Industry standard for value objects
   - Clean separation of concerns
   - Validation happens at object creation boundary

---

## Validation Location in Architecture

### Domain Layer (Value Objects & Entities)
- **Value Objects**: Validation in constructors (e.g., `PokemonId`)
- **Entity Invariants**: Business rules enforced here
- **Always-Valid Domain Model**: Entities never in invalid state

### Application Layer
- Input validation (format checking, required fields)
- Cross-entity validation
- Authorization checks
- Use-case specific validation

### Infrastructure/Adapter Layer
- Framework-specific validation (DTOs, request sanitization)
- Database constraint validation

**Key Principle**: "Put validation where it's needed." - Different contexts require different validations.

---

## Two Validation Approaches

### Approach 1: Throw Exceptions (✅ Preferred for Domain)

**When to Use:**
- Value object construction failures
- Violation of domain invariants
- Programming errors or invalid data

**Pros:**
- Clean separation
- Reusable validation logic
- Easy to test separately
- Fails fast

**Example:**
```typescript
class PokemonId {
  constructor(value: number) {
    this._validate(value); // throws if invalid
    this._value = value;
  }
  
  private _validate(value: number): void {
    if (value < 1 || value > 151) {
      throw new DomainError("Invalid Pokemon ID");
    }
  }
}
```

### Approach 2: Return Result Objects

**When to Use:**
- Expected failure scenarios
- Task-based validation with multiple errors
- Better error composition needed
- Business operations that might fail (e.g., box is full)

**Example:**
```typescript
type Result<T> = 
  | { success: true; value: T } 
  | { success: false; errors: string[] };

class PokedexEntry {
  static create(data: PokemonData): Result<PokedexEntry> {
    if (isValid) return { success: true, value: new PokedexEntry(data) };
    return { success: false, errors: ["Invalid data"] };
  }
}
```

---

## DomainError Class

**Location:** `src/domain/errors/DomainError.ts`

**Implementation:**
```typescript
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
```

**Purpose:**
- Distinguishes domain errors from technical errors
- Provides meaningful error messages
- Allows application layer to catch and convert to user-friendly messages

---

## Best Practices Summary

### Value Objects
- ✅ Validate in constructor (never allow invalid state)
- ✅ Make them immutable
- ✅ Use factory methods for complex creation
- ✅ Example: `PokemonId` validates range (1-151)

### Entities
- ✅ Protect invariants through methods, not property setters
- ✅ Use "Always-Valid Domain Model" principle
- ✅ Keep validation logic close to the data
- ✅ Validate state transitions

### Application Layer
- ✅ Validate input format
- ✅ Check cross-entity business rules
- ✅ Handle domain exceptions and convert to user messages

---

## Additional Patterns

### CanExecute Pattern (CQS Compliant)
```typescript
class Order {
  canDeliver(address: string, time: Date): ValidationResult {
    const errors: string[] = [];
    if (!address) errors.push("Must specify delivery address");
    return new ValidationResult(errors);
  }
  
  deliver(address: string, time: Date): void {
    if (!this.canDeliver(address, time).isValid) {
      throw new DomainError("Cannot deliver");
    }
    // perform delivery
  }
}
```

### Specification Pattern
- Encapsulates business rules as separate, composable objects
- Useful for complex validation spanning multiple entities
- Can be combined with AND, OR, NOT operations

---

## Architectural Principles

**Hexagonal Architecture (Ports & Adapters):**
- Business logic (domain) at the center
- Adapters connect external concerns to the domain
- Domain should not depend on infrastructure
- Validation at domain boundary protects the core

**Clean Architecture:**
- Dependencies point inward (toward the domain)
- Entities encapsulate enterprise-wide business rules
- Use Cases encapsulate application-specific rules
- Interface Adapters convert data formats

---

## Decision Summary

**For your Living Pokedex Tracker:**

1. ✅ **Continue with constructor validation** for value objects (current `PokemonId` approach)
2. ✅ **Use exceptions for domain validation** (violation of invariants)
3. ✅ **Use Result objects only for** expected business failures (e.g., box full)
4. ✅ **Keep DomainError class** for distinguishing error types
5. ✅ **Consider CanExecute pattern** for state transitions

**Bottom Line:**
> Domain layer throws exceptions, Application layer handles them.

Your current implementation where `_validation()` throws directly is **idiomatic and correct** for Ports & Adapters architecture!

---

## References

- Herberto Graça - "Explicit Architecture"
- Domain-Driven Design (Eric Evans)
- Hexagonal Architecture (Alistair Cockburn)
- Clean Architecture (Robert C. Martin)
