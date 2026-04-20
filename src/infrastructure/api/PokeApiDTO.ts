export interface PokeApiDTO {
  id: number;
  name: string;
  species: PokeApiSpeciesDTO;
  is_default: boolean;
  order: number;
  forms: PokeApiFormDTO[];
  game_indices: PokeApiGameIndexDTO[];
  location_area_encounters: string;
  types: PokeApiTypeDTO[];
  past_types: PokeApiTypeDTO[];
  sprites: PokeApiSpriteDTO[];
}

export interface PokeApiSpeciesDTO {
  name: string;
  url: string;
}

export interface PokeApiFormDTO {
  name: string;
  url: string;
}

export interface PokeApiGameIndexDTO {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface PokeApiTypeDTO {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokeApiPastTypeDTO {
  generation: {
    name: string;
    url: string;
  };
  types: PokeApiTypeDTO[];
}

export interface PokeApiSpriteDTO {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
  other: {
    dream_world: {
      front_default: string;
      front_female: string;
    };
    home: {
      front_default: string;
      front_female: string;
      front_shiny: string;
      front_shiny_female: string;
    };
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
    showdown: {
      back_default: string;
      back_female: string;
      back_shiny: string;
      back_shiny_female: string;
      front_default: string;
      front_female: string;
      front_shiny: string;
      front_shiny_female: string;
    };
  };
  versions: {
    "generation-i": {
      "red-blue": {
        back_default: string;
        back_gray: string;
        front_default: string;
        front_grey: string;
      };
      yellow: {
        back_default: string;
        back_gray: string;
        front_default: string;
        front_grey: string;
      };
    };
    // "generation-ii": {}  // Not Used currently
    // "generation-iii": {} // Not Used currently
    // "generation-iv": {} // Not Used currently
    // "generation-v": {} // Not Used currently
    // "generation-vi": {} // Not Used currently
    // "generation-vii": {} // Not Used currently
    // "generation-viii": {} // Not Used currently
  };
}
