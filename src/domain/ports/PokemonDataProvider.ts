import type { Pokedex } from "../entities/Pokedex";

export interface PokemonDataProvider {
  /**
   * Loads the data of the pokemon that form a pokedex from the api.
   */
  fetchPokemonData(): Promise<Pokedex>;
}
