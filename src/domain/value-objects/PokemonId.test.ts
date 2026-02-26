import { describe, expect, test } from "vitest";
import { PokemonId } from "./PokemonId";
import { DomainError } from "../errors/DomainError";


describe('PokemonId tests', () => {

  test('create an id correctly', () => {
    const newId = new PokemonId(5);
    expect(newId.value).toBeLessThan(151);
    expect(newId.value).toBeGreaterThan(1);
    expect(newId.value).toBe(5)
  })

  test('rejects invalid id', () => {
    expect(() => new PokemonId(-1)).toThrowError(DomainError)
    expect(() => new PokemonId(NaN)).toThrowError(DomainError);
  })

  test('equals works', () => {
    const newId = new PokemonId(5);
    const equalId = new PokemonId(5);
    const distinctId = new PokemonId(3);
    expect(newId.equals(equalId)).toBe(true);
    expect(newId.equals(distinctId)).toBe(false);
  })

  test('Is immutable', () => {
    const newId = new PokemonId(5);
    // @ts-expect-error - Testing that value property is read-only
    expect(() => newId.value = 3).toThrowError()
  })
})