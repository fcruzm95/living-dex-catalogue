import type { PokemonRepository } from "../../application/ports/PokemonRepository";
import type { PokemonSpecies } from "../../domain/entities/PokemonSpecies";
import type { PokemonId } from "../../domain/value-objects/PokemonId";

export class PokeApiPokemonRepository implements PokemonRepository {
  getById(id: PokemonId): Promise<PokemonSpecies | null> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<PokemonSpecies[]> {
    throw new Error("Method not implemented.");
  }

  getByGeneration(generation: number): Promise<PokemonSpecies[]> {
    throw new Error("Method not implemented.");
  }
}
