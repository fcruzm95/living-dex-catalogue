import { DomainError } from "../errors/DomainError";

export const GameVersionValues = {
  RED: "red",
  BLUE: "blue",
  YELLOW: "yellow",
} as const;

export type GameVersionValues =
  (typeof GameVersionValues)[keyof typeof GameVersionValues];

export class GameVersion {
  private readonly _name: string;

  private constructor(name: string) {
    const formattedName = this._format(name);
    this._validate(formattedName);
    this._name = formattedName;
    Object.freeze(this);
  }

  static create(name: string) {
    return new GameVersion(name);
  }

  static blue() {
    return new GameVersion(GameVersionValues.BLUE);
  }

  static red() {
    return new GameVersion(GameVersionValues.RED);
  }

  static yellow() {
    return new GameVersion(GameVersionValues.YELLOW);
  }

  get name() {
    return this._name;
  }

  equals(other: GameVersion) {
    return this._name === other.name;
  }

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
