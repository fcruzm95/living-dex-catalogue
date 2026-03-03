import { beforeEach, describe, expect, test } from "vitest";
import { DomainError } from "../errors/DomainError";
import { PokemonSpecies } from "./PokemonSpecies";
import { GameVersionValues } from "../value-objects/GameVersion";
import { Pokedex } from "./Pokedex";
import { CaughtState } from "../value-objects/CaughtState";

describe("Pokedex tests", () => {
  describe("Can create a pokedex", () => {
    let bulbasaur: PokemonSpecies;
    let charmander: PokemonSpecies;
    let squirtle: PokemonSpecies;

    beforeEach(() => {
      bulbasaur = PokemonSpecies.create({
        id: 1,
        name: "bulbasaur",
        generation: 1,
        availableIn: [
          GameVersionValues.BLUE,
          GameVersionValues.RED,
          GameVersionValues.YELLOW,
        ],
      });
      charmander = PokemonSpecies.create({
        id: 4,
        name: "Charmander",
        generation: 1,
        availableIn: [
          GameVersionValues.BLUE,
          GameVersionValues.RED,
          GameVersionValues.YELLOW,
        ],
      });
      squirtle = PokemonSpecies.create({
        id: 7,
        name: "squirtle",
        generation: 1,
        availableIn: [
          GameVersionValues.BLUE,
          GameVersionValues.RED,
          GameVersionValues.YELLOW,
        ],
      });
    });

    test("Should create a pokedex", () => {
      const pokemonSpecies = [bulbasaur, charmander, squirtle];
      expect(() => {
        Pokedex.create({ generation: 1, species: pokemonSpecies });
      }).not.toThrowError(DomainError);
      const pokedex = Pokedex.create({
        generation: 1,
        species: pokemonSpecies,
      });
      expect(pokedex.generation).toBe(1);
      expect(pokedex.species.length).toBe(3);
      expect(pokedex.isNationalDex).toBe(false);
    });

    test("Should create a national pokedex", () => {
      const pokemonSpecies = [bulbasaur, charmander, squirtle];
      expect(() => {
        Pokedex.create({
          generation: 1,
          species: pokemonSpecies,
          isNationalDex: true,
        });
      }).not.toThrowError(DomainError);
      const pokedex = Pokedex.create({
        generation: 1,
        species: pokemonSpecies,
        isNationalDex: true,
      });
      expect(pokedex.generation).toBe(1);
      expect(pokedex.species.length).toBe(3);
      expect(pokedex.isNationalDex).toBe(true);
    });

    test("Should not create an empty pokedex", () => {
      expect(() => Pokedex.create({ generation: 1, species: [] })).toThrowError(
        DomainError,
      );
    });

    // TODO: Add this test when there is more than one possible pokedex
    // test("Should not create a pokedex with more pokemon", () => {
    //   const emptyArray = Array.from({ length: 200 }, (_, i) => i + 1);
    //   const newSpecies = emptyArray.map((element) =>
    //     PokemonSpecies.create({
    //       id: element,
    //       name: `${element}`,
    //       generation: 1,
    //       availableIn: [GameVersionValues.BLUE],
    //     }),
    //   );
    //   expect(() => {
    //     Pokedex.create({ generation: 1, species: newSpecies });
    //   }).toThrowError(DomainError);
    // });

    // test("The pokedex should be ordered", () => {});

    // This is for the expansions.
    // test("Should not create a pokedex with pokemon that do not belong", () => {});
    test("Should not create a pokedex for other generations", () => {
      expect(() => {
        Pokedex.create({
          generation: 2,
          species: [bulbasaur, charmander, squirtle],
        });
      }).toThrowError(DomainError);
    });
  });

  describe("Computed values", () => {
    let pokedex: Pokedex;
    beforeEach(() => {
      pokedex = Pokedex.create({
        generation: 1,
        species: [
          PokemonSpecies.create({
            id: 1,
            name: "Bulbasaur",
            availableIn: [GameVersionValues.BLUE],
            generation: 1,
          }),
        ],
      });
    });

    test("Should be able to get progress", () => {
      expect(pokedex.getProgress()).toBe(0);
      pokedex.getPokemon(1).updateCaughtState();
      pokedex.getPokemon(1).updateCaughtState();
      expect(pokedex.getProgress()).toBe(100);
    });

    test("Should be able to get the pokemon information", () => {
      const bulbasaur = pokedex.getPokemon(1);
      expect(bulbasaur.id).toBe(1);
      expect(bulbasaur.caughtState).toEqual(CaughtState.notCaught());
      expect(bulbasaur.name).toBe("Bulbasaur");
    });

    test("Should be able to know if the pokedex is complete", () => {
      const bulbasaur = pokedex.getPokemon(1);
      bulbasaur.updateCaughtState();
      bulbasaur.updateCaughtState();
      expect(pokedex.isComplete).toBe(true);
    });

    test("Should throw an error when the getPokemon is using an invalid id", () => {
      expect(() => {
        pokedex.getPokemon(999);
      }).toThrowError(DomainError);
    });
  });

  test("Equality is based in species.length", () => {
    const emptyArray = Array.from({ length: 5 }, (_, i) => i + 1);
    const emptyArray2 = Array.from({ length: 20 }, (_, i) => i + 1);
    const gen1Pokedex = Pokedex.create({
      generation: 1,
      species: emptyArray.map((el) =>
        PokemonSpecies.create({
          id: el,
          name: `${el}`,
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      ),
    });
    const gen1AltPokedex = Pokedex.create({
      generation: 1,
      species: emptyArray2.map((el) =>
        PokemonSpecies.create({
          id: el,
          name: `${el}`,
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      ),
    });
    const gen1PokedexCopy = Pokedex.create({
      generation: 1,
      species: emptyArray.map((el) =>
        PokemonSpecies.create({
          id: el,
          name: `${el}`,
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      ),
    });
    expect(gen1Pokedex.equals(gen1Pokedex)).toBe(true);
    expect(gen1PokedexCopy.equals(gen1Pokedex)).toBe(true);
    expect(gen1Pokedex.equals(gen1AltPokedex)).toBe(false);
    expect(gen1AltPokedex.equals(gen1Pokedex)).toBe(false);
    expect(gen1PokedexCopy.equals(gen1AltPokedex)).toBe(false);
  });

  describe("Is immutable", () => {
    let gen1Pokedex: Pokedex;
    let gen1AltPokedex: Pokedex;

    beforeEach(() => {
      const emptyArray = Array.from({ length: 5 }, (_, i) => i + 1);
      const emptyArray2 = Array.from({ length: 20 }, (_, i) => i + 1);

      gen1Pokedex = Pokedex.create({
        generation: 1,
        species: emptyArray.map((element) =>
          PokemonSpecies.create({
            id: element,
            name: `${element}`,
            generation: 1,
            availableIn: [GameVersionValues.RED],
          }),
        ),
      });
      gen1AltPokedex = Pokedex.create({
        generation: 1,
        species: emptyArray2.map((el) =>
          PokemonSpecies.create({
            id: el,
            name: `${el}`,
            generation: 1,
            availableIn: [GameVersionValues.YELLOW],
          }),
        ),
      });
    });

    test("Reference is different from value", () => {
      const clone = gen1Pokedex;
      expect(clone).toBe(gen1Pokedex);
      expect(clone).toEqual(gen1Pokedex);
      expect(gen1Pokedex).not.toBe(gen1AltPokedex);
      expect(clone).not.toBe(gen1AltPokedex);
    });

    test("is Frozen", () => {
      const emptyArray = Array.from({ length: 5 }, (_, i) => i + 1);
      const species = emptyArray.map((element) =>
        PokemonSpecies.create({
          id: element,
          name: `${element}`,
          generation: 1,
          availableIn: [GameVersionValues.BLUE],
        }),
      );
      const pokedex = Pokedex.create({ generation: 1, species: species });
      expect(Object.isFrozen(pokedex)).toBe(true);
    });
  });
});
