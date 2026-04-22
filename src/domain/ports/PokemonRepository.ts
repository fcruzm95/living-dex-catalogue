import type { PokemonSpecies } from "../entities/PokemonSpecies";
import type { PokemonId } from "../value-objects/PokemonId";

/**
 * The DTO should live in the infrastructure folder.
 */
export interface PokemonRepository {
  getById(id: PokemonId): Promise<PokemonSpecies | null>;
  getAll(): Promise<PokemonSpecies[]>;
  getByGeneration(generation: number): Promise<PokemonSpecies[]>;
}
