import type { Pokedex } from "../entities/Pokedex";
import type { CaughtState } from "../value-objects/CaughtState";
import type { PokemonId } from "../value-objects/PokemonId";

/**
 * DO NOT USE.
 * This repository is mixing 2 concerns:
 *
 * - 1. Data fetching
 * - 2. Persistance of data.
 *
 * Instead this repository should be divided in 2.
 * The PokemonDataProvider
 */
export interface PokedexRepository {
  /**
   * Loads the data of the pokemon that form a pokedex from the api.
   */
  fetchPokemonData(): Promise<Pokedex>;
  /**
   * Updates the caught state of a pokemon.
   * NOTE: Should check the implementation of the state and if i have to pass it.
   * @param id Id of the pokemon to update.
   * @param state State to store
   */
  updatePokemonCaughtState(id: PokemonId, state: CaughtState): Promise<void>;
  /**
   * Stores the current state of the pokedex so that the user can share the state between sessions.
   * @param pokedex In memory pokedex state.
   */
  savePokedexState(pokedex: Pokedex): Promise<void>;
  /**
   * Retrieves the state of a saved pokedex so that the user can continue.
   */
  loadPokedexState(): Promise<Pokedex>;
}
