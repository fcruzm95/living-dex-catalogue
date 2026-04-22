import type { CaughtState } from "../value-objects/CaughtState";
import type { PokemonId } from "../value-objects/PokemonId";

export interface PokedexStorage {
  savePokemonCaughtState(id: PokemonId, state: CaughtState): Promise<void>;
  loadAllPokemonCaughtState(): Promise<Map<number, CaughtState>>;
}
