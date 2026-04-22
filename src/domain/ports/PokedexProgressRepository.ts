import type { Pokedex } from "../entities/Pokedex";
import type { CaughtState } from "../value-objects/CaughtState";
import type { PokemonId } from "../value-objects/PokemonId";

export interface PokedexProgressRepository {
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
