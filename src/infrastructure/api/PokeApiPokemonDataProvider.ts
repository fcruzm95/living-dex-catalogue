import type { Pokedex } from "../../domain/entities/Pokedex";
import type { PokemonDataProvider } from "../../domain/ports/PokemonDataProvider";

export class PokeApiPokemonDataProvider implements PokemonDataProvider {
  fetchPokemonData(): Promise<Pokedex> {
    throw new Error("Method not implemented.");
  }
}
