import type { CaughtState } from "../../domain/value-objects/CaughtState";
import type { PokemonId } from "../../domain/value-objects/PokemonId";

export interface PokedexStorage {
  savePokemonCaughtState(id: PokemonId, state: CaughtState): Promise<void>;
  // loadPokemonCaughtState(id: PokemonId): Promise<CaughtState>; // Not used but left just in case
  loadAllPokemonCaughtState(): Promise<Map<number, CaughtState>>;
}
