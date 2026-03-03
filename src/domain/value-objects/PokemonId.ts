import { DomainError } from "../errors/DomainError";

/**
 * Value Object representing a Pokemon's ID number.
 * IDs are immutable, validated at creation, and compared by value.
 *
 * Domain Rules for PokemonId:
 * - ID must be a valid number (not NaN).
 * - For Generation 1: IDs range from 1 to 151.
 * - IDs are unique identifiers for Pokemon species.
 * - Two PokemonId instances with the same value are considered equal.
 * - IDs are formatted as #001, #002, etc. for display.
 *
 * Future Considerations (Multi-Generation Support):
 * - These constants will need to be dynamic per generation:
 *   - Gen 1: 1-151
 *   - Gen 2: 1-251
 *   - Gen 3: 1-386
 *   - etc.
 * - Consider creating a Generation value object to manage ID ranges.
 *
 * @property value The numeric ID value (1-151 for Gen 1).
 */
export class PokemonId {
  /** Minimum valid Pokemon ID (1). */
  static readonly minimum = 1;
  /** Maximum valid Pokemon ID for Generation 1 (151). */
  static readonly maximum = 151;
  private readonly _value: number;

  private constructor(value: number) {
    this._validate(value);
    this._value = value;
    Object.freeze(this);
  }

  /**
   * Factory method to create a new PokemonId.
   * @param value The numeric ID to validate and wrap.
   * @returns A new immutable PokemonId instance.
   * @throws DomainError if the value is invalid.
   */
  static create(value: number) {
    return new PokemonId(value);
  }

  get value() {
    return this._value;
  }

  /**
   * Returns a formatted string representation of the ID.
   * @example "#001", "#025", "#151"
   */
  toString() {
    return "#" + `${this._value}`.padStart(3, "0");
  }

  /**
   * Compares this ID with another for equality.
   * @param pokemonId The other PokemonId to compare with.
   * @returns True if both IDs have the same numeric value.
   */
  equals(pokemonId: PokemonId) {
    return this._value === pokemonId.value;
  }

  private _validate(value: number): void {
    if (isNaN(value)) {
      throw new DomainError("Value is not a number");
    }
    if (value < PokemonId.minimum || value > PokemonId.maximum) {
      throw new DomainError(`There's no pokemon with id ${value}`);
    }
  }
}
