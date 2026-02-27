export const CaughtStateValues = {
  CAUGHT: "CAUGHT",
  NOT_CAUGHT: "NOT_CAUGHT",
  PENDING: "PENDING",
} as const;

export type CaughtStateValues =
  (typeof CaughtStateValues)[keyof typeof CaughtStateValues];

export class CaughtState {
  private readonly state: CaughtStateValues;
  private constructor(state: CaughtStateValues) {
    this.state = state;
    Object.freeze(this);
  }

  static create() {
    return new CaughtState(CaughtStateValues.NOT_CAUGHT);
  }

  static notCaught() {
    return new CaughtState(CaughtStateValues.NOT_CAUGHT);
  }

  static pending() {
    return new CaughtState(CaughtStateValues.PENDING);
  }

  static caught() {
    return new CaughtState(CaughtStateValues.CAUGHT);
  }

  get isNotCaught() {
    return this.state === CaughtStateValues.NOT_CAUGHT;
  }

  get isPending() {
    return this.state === CaughtStateValues.PENDING;
  }

  get isCaught() {
    return this.state === CaughtStateValues.CAUGHT;
  }

  next(): CaughtState {
    switch (this.state) {
      case CaughtStateValues.NOT_CAUGHT:
        return CaughtState.pending();
      case CaughtStateValues.PENDING:
        return CaughtState.caught();
      case CaughtStateValues.CAUGHT:
        return CaughtState.notCaught();
    }
  }

  toString(): string {
    return this.state;
  }

  equals(other: CaughtState): boolean {
    return this.state === other.state;
  }
}
