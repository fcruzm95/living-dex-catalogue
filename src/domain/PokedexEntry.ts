export interface PokemonSpecies {
  // generation: number; // TODO: Add when updating for multiple generations
  pokedexNumber: number;
  name: string;
  sprite: string;
  exclusiveGame: "red" | "blue" | null;
  // caughtLocations: any[]; // TODO: Update with caught locations by game by pokemon when adding location.
}
