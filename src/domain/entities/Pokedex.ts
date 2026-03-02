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

  get pokemonList() {
    return this._species;
  }

  get isNationalDex() {
    return this._isNationalDex;
  }

  equals(other: Pokedex) {}

  private _validate(data: PokedexData) {}
}
