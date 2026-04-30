import { DomainError } from "../errors/DomainError";
import type { GameVersion } from "../value-objects/GameVersion";
import type { PokemonSpecies } from "./PokemonSpecies";

interface PokedexData {
  generation: number;
  species: PokemonSpecies[];
  gameVersion: GameVersion;
  isNationalDex?: boolean;
}

/**
 * This Entity represents a Pokedex collection for a specific generation.
 * It aggregates PokemonSpecies and tracks completion progress.
 *
 * Domain Rules for Pokedex:
 * - A Pokedex must contain at least one PokemonSpecies.
 * - The generation determines which Pokemon are valid (Gen 1: 1-151, Gen 2: 1-251, etc.).
 * - Progress is calculated based on the caught state of all Pokemon in the collection.
 * - A Pokedex can be a regional dex (specific generation) or a national dex (all generations).
 * - Pokedex is immutable after creation.
 * - If its a generation 1 pokedex, then it can only be national (no more pokemon).
 *
 * TODO:
 * - Add constraint to have a fixed size (no partial pokedex)
 * - Add support for multiple generations (Gen 2, Gen 3, etc.).
 * - Add filtering by caught state (show only caught, pending, or not caught).
 * - Add sorting options (by ID, by name, by caught state).
 * - Add support for formDex. Should have the different form of pokemon (Deoxys, Rotom, etc.) or female form in case it exists.
 *
 * @property generation The generation this Pokedex represents (e.g., 1 for Gen 1).
 * @property species Contains PokemonSpecies in this Pokedex. // Should it be an array or Map?
 * @property isNationalDex Whether this is a national Pokedex (spanning multiple generations).
 * @property gameVersion Indicates in which game version you're filling the pokedex.
 */
export class Pokedex {
  private readonly _generation: number;
  private readonly _isNationalDex: boolean;
  private readonly _species: PokemonSpecies[];
  private readonly _gameVersion: GameVersion;

  private constructor(data: PokedexData) {
    this._validate(data);
    this._generation = data.generation;
    this._species = data.species;
    this._gameVersion = data.gameVersion;
    this._isNationalDex =
      data.generation === 1 ? true : (data.isNationalDex ?? false);
  }

  static create(data: PokedexData) {
    return new Pokedex(data);
  }

  get generation() {
    return this._generation;
  }

  get species() {
    return this._species;
  }

  get isNationalDex() {
    return this._isNationalDex;
  }

  get gameVersion() {
    return this._gameVersion;
  }

  /**
   * Retrieves a Pokemon by its ID.
   * @param id The Pokemon's ID number.
   * @returns The PokemonSpecies matching the ID.
   * @throws DomainError if no Pokemon with the given ID exists in this Pokedex.
   */
  getPokemon(id: number): PokemonSpecies {
    const pokemon = this._species.find((pokemon) => pokemon.id === id);
    if (!pokemon) throw new DomainError("Pokemon does not exist");
    return pokemon;
  }

  /**
   * Calculates the completion percentage of this Pokedex.
   * @returns A number between 0 and 100 representing the percentage of caught Pokemon.
   */
  getProgress() {
    return (
      (this._species.filter((pokemon) => pokemon.caughtState.isCaught).length /
        this._species.length) *
      100
    );
  }

  /**
   * Checks if the Pokedex is 100% complete (all Pokemon caught).
   */
  get isComplete() {
    return this.getProgress() === 100;
  }

  /**
   * Compares this Pokedex with another for equality.
   * Two Pokedexes are equal if they have the same generation, national dex status, and species count.
   * @param other The Pokedex to compare against.
   */
  equals(other: Pokedex) {
    return (
      this._generation === other.generation &&
      this._isNationalDex === other.isNationalDex &&
      this._species.length === other.species.length
    );
  }

  private _validate(data: PokedexData) {
    if (data.generation !== 1)
      throw new DomainError("Pokedex must only be for the first generation");
    if (data.species.length === 0)
      throw new DomainError("Pokedex must contain at least one pokemon");
  }
}
