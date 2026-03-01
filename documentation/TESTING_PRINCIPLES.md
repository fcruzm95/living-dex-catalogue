# Testing Principles for Living Dex Catalogue

This document outlines the testing principles and best practices for the Living Dex Catalogue project.

## Table of Contents

1. [General Testing Philosophy](#general-testing-philosophy)
2. [Testing Value Objects](#testing-value-objects)
3. [Testing Entities](#testing-entities)
4. [Immutability Testing](#immutability-testing)
5. [Validation Testing](#validation-testing)
6. [What NOT to Test](#what-not-to-test)
7. [Test Organization](#test-organization)

---

## General Testing Philosophy

### Test Domain Logic, Not Implementation Details

Focus on testing:
- Domain invariants and business rules
- Public API behavior
- Edge cases and boundary conditions
- Error handling

Avoid testing:
- Private implementation details
- TypeScript compilation (type checking)
- Framework internals

### Test-Driven Development (TDD)

Follow the Red-Green-Refactor cycle:
1. Write a failing test (Red)
2. Write minimal code to pass (Green)
3. Refactor while keeping tests passing (Refactor)

---

## Testing Value Objects

### Key Characteristics to Test

Value objects (like `PokemonId`, `GameVersion`) should be tested for:

1. **Identity-free equality** - Two instances with same value are equal
2. **Immutability** - Cannot be changed after creation
3. **Validation** - Invalid values are rejected at creation
4. **Value comparison** - `equals()` method works correctly

### Example: Testing a Value Object

```typescript
describe('PokemonId', () => {
  describe('creation', () => {
    test('creates valid PokemonId', () => {
      const id = new PokemonId(1);
      expect(id.value).toBe(1);
    });

    test('rejects invalid values', () => {
      expect(() => new PokemonId(-1)).toThrow(DomainError);
      expect(() => new PokemonId(999)).toThrow(DomainError);
      expect(() => new PokemonId(NaN)).toThrow(DomainError);
    });
  });

  describe('equality', () => {
    test('equal when values are same', () => {
      const id1 = new PokemonId(5);
      const id2 = new PokemonId(5);
      expect(id1.equals(id2)).toBe(true);
    });

    test('not equal when values differ', () => {
      const id1 = new PokemonId(5);
      const id2 = new PokemonId(3);
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('immutability', () => {
    test('properties cannot be changed', () => {
      const id = new PokemonId(5);
      // @ts-expect-error - Attempting to modify read-only property
      id.value = 3;
      expect(id.value).toBe(5); // Original value preserved
    });

    test('instance is frozen', () => {
      const id = new PokemonId(5);
      expect(Object.isFrozen(id)).toBe(true);
    });
  });
});
```

---

## Testing Entities

### Key Characteristics to Test

Entities (like `PokemonSpecies`) should be tested for:

1. **Identity-based equality** - Same ID means same entity
2. **Factory method validation** - `create()` validates all inputs
3. **Business rules** - Domain invariants are enforced
4. **Behavior** - Methods perform correct operations

### Factory Method Testing

When using static factory methods:

```typescript
describe('PokemonSpecies creation', () => {
  test('creates with valid data', () => {
    const species = PokemonSpecies.create({
      id: 1,
      name: 'Bulbasaur',
      generation: 1,
      availableIn: [GameVersionValues.RED]
    });
    
    expect(species).toBeDefined();
    expect(species.name).toBe('Bulbasaur');
  });

  test('validates all required fields', () => {
    expect(() => PokemonSpecies.create({})).toThrow(DomainError);
  });
});
```

---

## Immutability Testing

### Approaches

#### 1. Verify Value Doesn't Change (Recommended)

```typescript
test('is immutable', () => {
  const obj = new MyClass('value');
  // @ts-expect-error - Attempting to modify
  obj.property = 'new value';
  expect(obj.property).toBe('value'); // Verify unchanged
});
```

#### 2. Verify Object is Frozen

```typescript
test('is frozen', () => {
  const obj = new MyClass('value');
  expect(Object.isFrozen(obj)).toBe(true);
});
```

#### 3. Verify References Are Different

```typescript
test('new instances are different references', () => {
  const obj1 = MyClass.create('value');
  const obj2 = MyClass.create('value');
  expect(obj1).not.toBe(obj2); // Different reference
  expect(obj1).toEqual(obj2);  // But equal value
});
```

### Common Mistake

❌ **Don't do this:**
```typescript
test('is immutable', () => {
  const obj = new MyClass('value');
  // @ts-expect-error
  expect(() => obj.property = 'new').toThrow(); // May not throw!
});
```

Assigning to read-only properties doesn't always throw an error at runtime - TypeScript prevents it at compile time.

---

## Validation Testing

### What to Test

✅ **DO test these validation scenarios:**

1. **Domain value constraints**
   ```typescript
   test('rejects invalid Pokemon ID', () => {
     expect(() => new PokemonId(999)).toThrow(DomainError);
   });
   ```

2. **Business rules**
   ```typescript
   test('rejects empty availableIn array', () => {
     expect(() => PokemonSpecies.create({
       id: 1,
       name: 'Test',
       generation: 1,
       availableIn: [] // Invalid: must be in at least one version
     })).toThrow(DomainError);
   });
   ```

3. **Boundary values**
   ```typescript
   test('accepts boundary values', () => {
     expect(() => new PokemonId(1)).not.toThrow();   // Min valid
     expect(() => new PokemonId(151)).not.toThrow(); // Max valid
   });
   ```

4. **Edge cases**
   - Empty strings
   - Null/undefined where not allowed
   - Invalid enum values

### Test Structure

```typescript
describe('PokemonSpecies validation', () => {
  describe('id validation', () => {
    test('rejects negative IDs', () => { /* ... */ });
    test('rejects ID > 151', () => { /* ... */ });
    test('rejects non-numeric IDs', () => { /* ... */ });
    test('accepts valid IDs', () => { /* ... */ });
  });

  describe('name validation', () => {
    test('rejects empty name', () => { /* ... */ });
    test('rejects whitespace-only name', () => { /* ... */ });
    test('accepts valid name', () => { /* ... */ });
  });
});
```

---

## What NOT to Test

### ❌ TypeScript Compilation Errors

Don't write runtime tests for things TypeScript catches at compile time:

```typescript
// DON'T DO THIS - TypeScript already prevents this
test('requires id property', () => {
  // @ts-expect-error
  expect(() => PokemonSpecies.create({})).toThrow();
});

// DON'T DO THIS - TypeScript prevents wrong types
test('requires number for id', () => {
  // @ts-expect-error
  expect(() => PokemonSpecies.create({ id: 'one' })).toThrow();
});
```

**Why?** TypeScript will fail compilation before tests even run. Use `@ts-expect-error` to document that TypeScript prevents invalid usage, but don't test it.

### ❌ Private Constructor Access

Private constructors are enforced by TypeScript, not runtime:

```typescript
// DON'T DO THIS
class GameVersion {
  private constructor() {}
}

test('constructor is private', () => {
  // @ts-expect-error
  expect(() => new GameVersion()).toThrow(); // Won't throw!
});
```

**Why?** JavaScript doesn't enforce `private` at runtime. The `@ts-expect-error` alone proves TypeScript protection works.

### ❌ Implementation Details

Don't test how something works, test what it does:

```typescript
// DON'T DO THIS
class PokemonId {
  private readonly _value: number;
  constructor(value: number) {
    this._validate(value);
    this._value = value;
  }
}

// DON'T test private methods
test('_validate rejects negative numbers', () => {
  const id = new PokemonId(1);
  expect(id['_validate'](-1)).toThrow(); // Don't access private methods!
});
```

**Why?** Private methods can change. Test the public behavior instead.

---

## Test Organization

### Naming Conventions

```typescript
// File naming
PokemonSpecies.test.ts          // ✅ 
PokemonSpecies.spec.ts          // ✅
pokemon-species-test.ts         // ❌

// Test descriptions
describe('PokemonSpecies', () => {                    // ✅ Feature/module name
  describe('when creating', () => {                   // ✅ Context
    test('validates all required fields', () => {     // ✅ Behavior
      // ...
    });
  });
});

// Avoid
test('test1', () => {});                              // ❌ Not descriptive
test('should work', () => {});                        // ❌ Too vague
```

### Test Structure

```typescript
describe('Feature Name', () => {
  describe('Scenario/Context', () => {
    test('expected behavior', () => {
      // Arrange
      const input = setupTestData();
      
      // Act
      const result = featureUnderTest(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Grouping Related Tests

```typescript
describe('PokemonSpecies', () => {
  describe('creation', () => {
    // All creation tests here
  });

  describe('immutability', () => {
    // All immutability tests here
  });

  describe('equality', () => {
    // All equality tests here
  });

  describe('behavior', () => {
    // Method-specific tests here
  });
});
```

---

## Summary Checklist

Before writing a test, ask:

- [ ] Does this test domain logic or implementation details?
- [ ] Will TypeScript catch this error at compile time?
- [ ] Is the test description clear about what's being tested?
- [ ] Are edge cases and boundary values covered?
- [ ] Does the test document a business rule or invariant?
- [ ] Is the test independent of other tests?

Remember: **Tests are documentation**. Write them so they explain the system's behavior to future developers (including yourself).
