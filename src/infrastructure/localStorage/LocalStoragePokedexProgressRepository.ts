import type { Pokedex } from "../../domain/entities/Pokedex";
import type { PokedexProgressRepository } from "../../domain/ports/PokedexProgressRepository";
import type { CaughtState } from "../../domain/value-objects/CaughtState";
import type { PokemonId } from "../../domain/value-objects/PokemonId";

export class LocalStoragePokedexProgressRepository implements PokedexProgressRepository {
  updatePokemonCaughtState(id: PokemonId, state: CaughtState): Promise<void> {
    throw new Error("Method not implemented.");
  }
  savePokedexState(pokedex: Pokedex): Promise<void> {
    throw new Error("Method not implemented.");
  }
  loadPokedexState(): Promise<Pokedex> {
    throw new Error("Method not implemented.");
  }
}
