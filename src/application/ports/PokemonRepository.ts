import type { PokemonSpecies } from "../../domain/entities/PokemonSpecies";
import type { PokemonId } from "../../domain/value-objects/PokemonId";

/**
 * The DTO should live in the infrastructure folder.
 */
export interface PokemonRepository {
  getById(id: PokemonId): Promise<PokemonSpecies | null>;
  getAll(): Promise<PokemonSpecies[]>;
  getByGeneration(generation: number): Promise<PokemonSpecies[]>;
}
