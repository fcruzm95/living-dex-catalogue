import { beforeEach, describe, expect, test } from "vitest";
import { DomainError } from "../errors/DomainError";
import { PokemonSpecies } from "./PokemonSpecies";
import { GameVersion, GameVersionValues } from "../value-objects/GameVersion";
import { CaughtState } from "../value-objects/CaughtState";

describe("PokemonSpecies tests", () => {
  describe("Can create a pokemonSpecies", () => {
    test("Can create a pokemonSpecies", () => {
      const newPokemonData = {
        id: 1,
        name: "Bulbasaur",
        availableIn: [
          GameVersionValues.BLUE,
          GameVersionValues.RED,
          GameVersionValues.YELLOW,
        ],
        generation: 1,
      };
      expect(() => PokemonSpecies.create(newPokemonData)).not.toThrowError();
      const bulbasaur = PokemonSpecies.create(newPokemonData);
      expect(bulbasaur.id.value).toBe(1);
      expect(bulbasaur.name).toBe("Bulbasaur");
      expect(bulbasaur.spriteUrl).toBe(
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/1.png",
      );
      expect(bulbasaur.generation).toBe(1);
      expect(bulbasaur.availableIn).toEqual([
        GameVersion.blue(),
        GameVersion.red(),
        GameVersion.yellow(),
      ]);
      expect(bulbasaur.caughtState).toEqual(CaughtState.notCaught());
    });

    test("Rejects invalid Pokemon Id", () => {
      expect(() =>
        PokemonSpecies.create({
          id: 999,
          name: "Test",
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      ).toThrowError(DomainError);
    });

    test("Rejects empty name", () => {
      expect(() =>
        PokemonSpecies.create({
          id: 1,
          name: "",
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      ).toThrowError(DomainError);
    });

    test("Rejects whitespace-only name", () => {
      expect(() =>
        PokemonSpecies.create({
          id: 1,
          name: "    ",
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      ).toThrowError(DomainError);
    });

    test("Formats name correctly", () => {
      const uppercaseName = PokemonSpecies.create({
        id: 1,
        name: "BULBASAUR",
        generation: 1,
        availableIn: [GameVersionValues.BLUE],
      });
      const spacesAroundName = PokemonSpecies.create({
        id: 1,
        name: "   Bulbasaur  ",
        generation: 1,
        availableIn: [GameVersionValues.BLUE],
      });
      const lowecaseName = PokemonSpecies.create({
        id: 1,
        name: "bulbasaur",
        generation: 1,
        availableIn: [GameVersionValues.BLUE],
      });
      expect(uppercaseName.name).toBe("Bulbasaur");
      expect(lowecaseName.name).toBe("Bulbasaur");
      expect(spacesAroundName.name).toBe("Bulbasaur");
    });

    test("Rejects invalid generation", () => {
      expect(() =>
        PokemonSpecies.create({
          id: 1,
          name: "Test",
          generation: 2,
          availableIn: [GameVersionValues.BLUE],
        }),
      ).toThrowError(DomainError);
    });

    test("Rejects empty availableIn array", () => {
      expect(() =>
        PokemonSpecies.create({
          id: 1,
          name: "Test",
          generation: 1,
          availableIn: [],
        }),
      ).toThrowError(DomainError);
    });
  });

  describe("PokemonSpecies Exclusivity", () => {
    let ekans: PokemonSpecies;
    let meowth: PokemonSpecies;
    let pikachu: PokemonSpecies;

    beforeEach(() => {
      ekans = PokemonSpecies.create({
        id: 23,
        name: "ekans",
        generation: 1,
        availableIn: [GameVersionValues.RED],
      });
      meowth = PokemonSpecies.create({
        id: 52,
        name: "meowth",
        generation: 1,
        availableIn: [GameVersionValues.BLUE],
      });
      pikachu = PokemonSpecies.create({
        id: 25,
        name: "pikachu",
        generation: 1,
        availableIn: [
          GameVersionValues.BLUE,
          GameVersionValues.RED,
          GameVersionValues.YELLOW,
        ],
      });
    });

    test("PokemonSpecies is red exclusive", () => {
      expect(ekans.isRedExclusive).toBe(true);
      expect(meowth.isRedExclusive).toBe(false);
      expect(pikachu.isRedExclusive).toBe(false);
    });

    test("PokemonSpecies is blue exclusive", () => {
      expect(ekans.isBlueExclusive).toBe(false);
      expect(meowth.isBlueExclusive).toBe(true);
      expect(pikachu.isBlueExclusive).toBe(false);
    });

    test("PokemonSpecies is yellow exclusive", () => {
      expect(ekans.isYellowExclusive).toBe(false);
      expect(meowth.isYellowExclusive).toBe(false);
      expect(pikachu.isYellowExclusive).toBe(false);
    });
  });

  test("Can update caughtState", () => {
    const charmander = PokemonSpecies.create({
      id: 4,
      name: "Charmander",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });
    expect(charmander.caughtState).toEqual(CaughtState.notCaught());
    charmander.updateCaughtState();
    expect(charmander.caughtState).toEqual(CaughtState.pending());
    charmander.updateCaughtState();
    expect(charmander.caughtState).toEqual(CaughtState.caught());
  });

  test("PokemonSpecies equality is based on Id", () => {
    const bulbasaur = PokemonSpecies.create({
      id: 1,
      name: "Bulbasaur",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });
    const charmander = PokemonSpecies.create({
      id: 4,
      name: "Charmander",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });
    const charmander2 = PokemonSpecies.create({
      id: 4,
      name: "Charmander",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });
    const disguisedSquirtle = PokemonSpecies.create({
      id: 4,
      name: "Squirtle",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });

    expect(charmander.equals(bulbasaur)).toBe(false);
    expect(charmander.equals(charmander2)).toBe(true);
    expect(charmander.equals(disguisedSquirtle)).toBe(true);
  });

  test("references are different from value", () => {
    const pokemon = PokemonSpecies.create({
      id: 4,
      name: "Charmander",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });
    const anotherPokemon = PokemonSpecies.create({
      id: 4,
      name: "Charmander",
      generation: 1,
      availableIn: [GameVersionValues.BLUE],
    });
    const clone = pokemon;
    expect(clone).toBe(pokemon);
    expect(pokemon).not.toBe(anotherPokemon);
    expect(pokemon).toEqual(anotherPokemon);
    expect(clone).toEqual(anotherPokemon);
  });
});
