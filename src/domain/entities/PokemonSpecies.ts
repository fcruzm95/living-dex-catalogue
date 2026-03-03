import { DomainError } from "../errors/DomainError";
import { CaughtState } from "../value-objects/CaughtState";
import { GameVersion } from "../value-objects/GameVersion";
import { PokemonId } from "../value-objects/PokemonId";

export interface PokemonSpeciesData {
  id: number;
  name: string;
  generation: number;
  availableIn: string[];
  caughtState?: CaughtState;
}

/**
 * This Entity represents a pokemon species in the Gen 1 pokedex.
 * It contains the caught state to keep track of all of the pokemon
 * caught to fill the living pokedex.
 * Domain Rules for PokemonSpecies:
 * - The Id must be valid for the currentPokedex (Gen 1: 1-151)
 * - The Pokemon MUST be available in at least 1 GameVersion.
 * - The name of the Pokemon MUST NOT be empty or have spaces at the beginning or the end.
 * - Pokemon equality is check by id number.
 * - The pokemon generation is going to be used in the future when adding multiple pokedex.
 * - The only mutable property should be the caughtState.
 *
 * TODO:
 * - Add boolean property to know if its an event pokemon.
 * - Not sure but add a appearsInRed, ... property
 *
 * @property id
 * @property caughtState
 * @property name
 * @property spriteUrl
 * @property generation Game Generation by pokeApi
 * @property availableIn specifies the GameVersion in which the pokemon is available.
 * @property isRedExclusive
 * @property isBlueExclusive
 * @property isYellowExclusive
 */
export class PokemonSpecies {
  private readonly _id: PokemonId;
  private _caughtState: CaughtState;
  private readonly _name: string;
  private readonly _spriteUrl: string;
  private readonly _generation: number; // Not sure if this goes here or in pokedex.
  private readonly _availableIn: GameVersion[];

  private constructor(
    id: PokemonId,
    name: string,
    generation: number,
    availableIn: GameVersion[],
    caughtState?: CaughtState,
  ) {
    this._id = id;
    this._caughtState = caughtState ?? CaughtState.create();
    this._name = name;
    this._spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/${id.value}.png`;
    this._generation = generation;
    this._availableIn = availableIn;
  }

  static create(pokemonSpeciesData: PokemonSpeciesData) {
    this._validate(pokemonSpeciesData);
    const validId = PokemonId.create(pokemonSpeciesData.id);
    const validAvailableIn = pokemonSpeciesData.availableIn.map((version) =>
      GameVersion.create(version),
    );
    const validName = this._formatName(pokemonSpeciesData.name);
    return new PokemonSpecies(
      validId,
      validName,
      pokemonSpeciesData.generation,
      validAvailableIn,
      pokemonSpeciesData.caughtState,
    );
  }

  get id(): number {
    return this._id.value;
  }

  get caughtState(): CaughtState {
    return this._caughtState;
  }

  get name(): string {
    return this._name;
  }

  get spriteUrl(): string {
    return this._spriteUrl;
  }

  get generation(): number {
    return this._generation;
  }

  get availableIn(): GameVersion[] {
    return this._availableIn;
  }

  get isRedExclusive(): boolean {
    return (
      this._availableIn.length === 1 &&
      GameVersion.red().equals(this._availableIn[0])
    );
  }

  get isBlueExclusive(): boolean {
    return (
      this._availableIn.length === 1 &&
      GameVersion.blue().equals(this._availableIn[0])
    );
  }

  get isYellowExclusive(): boolean {
    return (
      this._availableIn.length === 1 &&
      GameVersion.yellow().equals(this._availableIn[0])
    );
  }

  updateCaughtState() {
    this._caughtState = this._caughtState.next();
  }

  equals(other: PokemonSpecies) {
    return this._id.value === other.id;
  }

  private static _formatName(value: string) {
    const trimmedValue = value.trim();
    return `${trimmedValue.substring(0, 1).toUpperCase()}${trimmedValue.substring(1).toLowerCase()}`;
  }

  private static _validate(speciesData: PokemonSpeciesData) {
    if (!speciesData.name)
      throw new DomainError("PokemonSpecies name cannot be empty");
    if (!speciesData.name.trim())
      throw new DomainError("PokemonSpecies name cannot be only whitespace");
    if (speciesData.availableIn.length === 0)
      throw new DomainError(
        "PokemonSpecies must be available in at least one GameVersion",
      );
    if (speciesData.generation !== 1)
      throw new DomainError(
        "PokemonSpecies must belong to the first generation",
      );
  }
}
