import type { Pokedex } from "../../domain/entities/Pokedex";
import type { PokemonDataProvider } from "../../domain/ports/PokemonDataProvider";
import type { PokeApiDTO } from "./PokeApiDTO";

interface PokeApiConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  apiKey?: string; // Not used by PokeApi, left just to illustrate.
  enableCache?: boolean;
}

export class PokeApiPokemonDataProvider implements PokemonDataProvider {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly enableCache: boolean;
  private cache: Map<string, { data: PokeApiDTO; timestamp: number }> =
    new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly saveId: string = "living-dex-data";

  constructor(config: PokeApiConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout ?? 10000; // 10 Sec timeout
    this.retries = config.retries ?? 3;
    this.enableCache = config.enableCache ?? false;
  }

  fetchPokemonData(): Promise<Pokedex> {
    throw new Error("Method not implemented.");
  }

  private pokeApiResponseMapper(dto: PokeApiDTO): Pokedex {
    console.log({ dto });
    //
    throw new Error("Not yet implemented");
  }

  private getCachedData(id: string): PokeApiDTO | null {
    const cached = this.cache.get(id);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(id);
      return null;
    }

    return cached.data;
  }

  private updateCache(id: string, data: PokeApiDTO): void {
    this.cache.set(id, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}
