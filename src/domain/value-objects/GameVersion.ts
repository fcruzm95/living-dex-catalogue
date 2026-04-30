import { DomainError } from "../errors/DomainError";

/**
 * Enumeration of valid Game Boy game versions for Generation 1.
 * These represent the different game versions in which Pokemon can be obtained.
 */
export const GameVersionValues = {
  RED: "red",
  BLUE: "blue",
  YELLOW: "yellow",
} as const;

/** Type representing valid game version values. */
export type GameVersionValues =
  (typeof GameVersionValues)[keyof typeof GameVersionValues];

const exclusivePokemon = {
  [GameVersionValues.RED]: new Set([
    23, 24, 43, 44, 45, 56, 57, 58, 59, 123, 125,
  ]),
  [GameVersionValues.BLUE]: new Set([
    27, 28, 37, 38, 52, 53, 69, 70, 71, 126, 127,
  ]),
  [GameVersionValues.YELLOW]: new Set([]),
};

/**
 * Value Object representing a Pokemon game version.
 * Tracks which game versions a Pokemon is available in.
 *
 * Domain Rules for GameVersion:
 * - Only RED, BLUE, and YELLOW are valid for Generation 1.
 * - Game names are stored in lowercase ("red", "blue", "yellow").
 * - GameVersion is immutable and compared by name value.
 * - Factory methods provide convenient access to specific versions.
 *
 * Future Considerations (Multi-Generation Support):
 * - Additional generations will add more versions (Gold, Silver, Crystal, etc.).
 * - Consider grouping versions by generation: Gen 1 (Red/Blue/Yellow), Gen 2 (Gold/Silver/Crystal).
 * - May need methods to check generation compatibility.
 *
 * @property name The game version name in lowercase ("red", "blue", or "yellow").
 */
export class GameVersion {
  private readonly _name: string;
  private readonly _exclusivePokemon: Set<number>;

  private constructor(name: string) {
    const formattedName = this._format(name);
    this._validate(formattedName);
    this._name = formattedName;
    switch (formattedName) {
      case GameVersionValues.RED:
        this._exclusivePokemon = exclusivePokemon[GameVersionValues.RED];
        break;
      case GameVersionValues.BLUE:
        this._exclusivePokemon = exclusivePokemon[GameVersionValues.BLUE];
        break;
      default: // Yellow
        this._exclusivePokemon = exclusivePokemon[GameVersionValues.YELLOW];
        break;
    }
    Object.freeze(this);
  }

  /**
   * Factory method to create a GameVersion from a string.
   * @param name The game version name (case-insensitive).
   * @returns A new immutable GameVersion instance.
   * @throws DomainError if the name is not a valid game version.
   */
  static create(name: string) {
    return new GameVersion(name);
  }

  /**
   * Factory method for Blue version.
   * @returns GameVersion for Pokemon Blue.
   */
  static blue() {
    return new GameVersion(GameVersionValues.BLUE);
  }

  /**
   * Factory method for Red version.
   * @returns GameVersion for Pokemon Red.
   */
  static red() {
    return new GameVersion(GameVersionValues.RED);
  }

  /**
   * Factory method for Yellow version.
   * @returns GameVersion for Pokemon Yellow.
   */
  static yellow() {
    return new GameVersion(GameVersionValues.YELLOW);
  }

  get name() {
    return this._name;
  }

  get availablePokemon() {
    return this._exclusivePokemon;
  }

  /**
   * Compares this version with another for equality.
   * @param other The other GameVersion to compare with.
   * @returns True if both versions have the same name.
   */
  equals(other: GameVersion) {
    return this._name === other.name;
  }

  /**
   * Returns a formatted string representation.
   * @example "red version", "blue version", "yellow version"
   */
  toString() {
    return `${this._name} version`;
  }

  private _format(value: string) {
    return value.trim().toLowerCase();
  }

  private _validate(value: string) {
    if (!value) {
      throw new DomainError(`${value} cannot be empty`);
    }
    if (
      !Object.values(GameVersionValues).includes(value as GameVersionValues)
    ) {
      throw new DomainError(`${value} is not a valid GameVersion`);
    }
  }
}
