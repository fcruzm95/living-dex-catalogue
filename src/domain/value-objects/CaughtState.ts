/**
 * Enumeration of all possible caught states for a Pokemon.
 * - NOT_CAUGHT: Pokemon has not been caught yet.
 * - PENDING: Pokemon is caught but needs evolution/trade/etc.
 * - CAUGHT: Pokemon is fully obtained (including evolution/trade if needed).
 */
export const CaughtStateValues = {
  CAUGHT: "CAUGHT",
  NOT_CAUGHT: "NOT_CAUGHT",
  PENDING: "PENDING",
} as const;

/** Type representing valid caught state values. */
export type CaughtStateValues =
  (typeof CaughtStateValues)[keyof typeof CaughtStateValues];

/**
 * Value Object representing the caught state of a Pokemon in the living Pokedex.
 * Implements a state machine with cyclical transitions.
 *
 * Domain Rules for CaughtState:
 * - CaughtState is immutable; transitions create new instances.
 * - Transitions follow a cycle: NOT_CAUGHT → PENDING → CAUGHT → NOT_CAUGHT.
 * - Default state for new Pokemon is NOT_CAUGHT.
 * - Two CaughtState instances with the same value are considered equal.
 *
 * State Machine:
 * ```
 * NOT_CAUGHT --next()--> PENDING --next()--> CAUGHT --next()--> NOT_CAUGHT
 * ```
 *
 * @property isNotCaught True if state is NOT_CAUGHT.
 * @property isPending True if state is PENDING.
 * @property isCaught True if state is CAUGHT.
 */
export class CaughtState {
  private readonly state: CaughtStateValues;

  private constructor(state: CaughtStateValues) {
    this.state = state;
    Object.freeze(this);
  }

  /**
   * Factory method creating a CaughtState in NOT_CAUGHT state.
   * This is the default state for newly added Pokemon.
   */
  static create() {
    return new CaughtState(CaughtStateValues.NOT_CAUGHT);
  }

  /** Factory method for NOT_CAUGHT state. */
  static notCaught() {
    return new CaughtState(CaughtStateValues.NOT_CAUGHT);
  }

  /** Factory method for PENDING state. */
  static pending() {
    return new CaughtState(CaughtStateValues.PENDING);
  }

  /** Factory method for CAUGHT state. */
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

  /**
   * Transitions to the next state in the cycle.
   * @returns A new CaughtState instance representing the next state.
   * @example NOT_CAUGHT → PENDING, PENDING → CAUGHT, CAUGHT → NOT_CAUGHT
   */
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

  /**
   * Compares this state with another for equality.
   * @param other The other CaughtState to compare with.
   * @returns True if both states have the same value.
   */
  equals(other: CaughtState): boolean {
    return this.state === other.state;
  }
}
