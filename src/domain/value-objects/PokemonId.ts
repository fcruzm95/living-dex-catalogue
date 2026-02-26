import { DomainError } from "../errors/DomainError";

export class PokemonId {
  private _value: number;

  constructor(value: number) {
    this._validate(value);
    this._value = value;
  }

  get value() {
    return this._value;
  }

  toString() {
    return '#' + `${this._value}`.padStart(3, '0')
  }

  equals(pokemonId: PokemonId) {
    return this._value === pokemonId.value;
  }

  private _validate(value: number): void {
    if (isNaN(value)) {
      throw new DomainError("Value is not a number");
    }
    if (value < 1 || value > 151) {
      throw new DomainError(`There's no pokemon with id ${value}`);
    }
  }
}
