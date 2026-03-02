import { DomainError } from "../errors/DomainError";
import type { PokemonSpecies } from "./PokemonSpecies";

interface PokedexData {
  generation: number;
  species: PokemonSpecies[];
  isNationalDex?: boolean;
}

export class Pokedex {
  private readonly _generation: number;
  private readonly _isNationalDex: boolean;
  private readonly _species: PokemonSpecies[];

  private constructor(data: PokedexData) {
    this._validate(data);
    this._generation = data.generation;
    this._species = data.species;
    this._isNationalDex = data.isNationalDex ?? false;
    Object.freeze(this);
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

  getPokemon(id: number): PokemonSpecies {
    const pokemon = this._species.find((pokemon) => pokemon.id === id);
    if (!pokemon) throw new DomainError("Pokemon does not exist");
    return pokemon;
  }

  getProgress() {
    return (
      (this._species.filter((pokemon) => pokemon.caughtState.isCaught).length /
        this._species.length) *
      100
    );
  }

  get isComplete() {
    return this.getProgress() === 100;
  }

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
    if (data.species.find((pokemon) => pokemon.generation !== 1) !== undefined)
      throw new DomainError(
        "Pokedex must only contain first generation pokemon",
      );
  }
}
