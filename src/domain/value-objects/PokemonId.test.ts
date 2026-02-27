import { describe, expect, test } from "vitest";
import { PokemonId } from "./PokemonId";
import { DomainError } from "../errors/DomainError";

describe("PokemonId tests", () => {
  test("create an id correctly", () => {
    const newId = PokemonId.create(5);
    expect(newId.value).toBeLessThan(151);
    expect(newId.value).toBeGreaterThan(1);
    expect(newId.value).toBe(5);
  });

  test("rejects invalid id", () => {
    expect(() => PokemonId.create(-1)).toThrowError(DomainError);
    expect(() => PokemonId.create(NaN)).toThrowError(DomainError);
  });

  test("equals works", () => {
    const newId = PokemonId.create(5);
    const equalId = PokemonId.create(5);
    const distinctId = PokemonId.create(3);
    expect(newId.equals(equalId)).toBe(true);
    expect(newId.equals(distinctId)).toBe(false);
  });

  describe("Is immutable", () => {
    test("Cannot change the internal value", () => {
      const newId = PokemonId.create(5);

      expect(() => {
        // @ts-expect-error - Testing that value property is read-only
        newId.value = 3;
      }).toThrowError();
    });

    test("References are different from the value", () => {
      const testId = PokemonId.create(5);
      const otherId = PokemonId.create(5);
      expect(testId).not.toBe(otherId);
      expect(testId).toEqual(otherId);
    });

    test("Is frozen", () => {
      const newId = PokemonId.create(5);
      expect(Object.isFrozen(newId)).toBe(true);
    });
  });
});
