import { describe, expect, test } from "vitest";
import { CaughtState } from "./CaughtState";

describe("CaughtState tests", () => {
  test("create a caught state correctly", () => {
    expect(() => {
      CaughtState.create();
    }).not.toThrowError();
  });

  test("has default value of NOT_CAUGHT", () => {
    const state = CaughtState.create();
    expect(state).toEqual(CaughtState.notCaught());
    expect(state).not.toEqual(CaughtState.caught());
    expect(state).not.toEqual(CaughtState.pending());
  });

  test("states are cyclical", () => {
    const firstState = CaughtState.create(); // Default value NOT_CAUGHT
    const secondState = firstState.next(); // New value PENDING
    const thirdState = secondState.next(); // New Value CAUGHT
    const fourthState = thirdState.next(); // New Value NOT_CAUGHT
    expect(firstState).toEqual(fourthState);
    let forLoopState = CaughtState.create();
    for (let index = 0; index < 3; index++) {
      forLoopState = forLoopState.next();
    }
    expect(firstState).toEqual(forLoopState);
  });

  test("equals works", () => {
    const defaultState = CaughtState.create();
    expect(defaultState.equals(CaughtState.create())).toBe(true);
    expect(defaultState.equals(CaughtState.caught())).toBe(false);
    expect(defaultState.equals(CaughtState.pending())).toBe(false);
    expect(defaultState.equals(CaughtState.notCaught())).toBe(true);
  });

  describe("Is immutable", () => {
    test("Cannot change the internal value", () => {
      const state = CaughtState.create();
      expect(() => {
        // @ts-expect-error - Testing that value property is read-only
        state.state = "ERROR";
      }).toThrowError();
    });

    test("References are different from the value", () => {
      const notCaughtState = CaughtState.notCaught();
      const anotherNotCaughtState = CaughtState.notCaught();
      expect(notCaughtState).not.toBe(anotherNotCaughtState);
      expect(notCaughtState).toEqual(anotherNotCaughtState);
    });

    test("Is frozen", () => {
      const state = CaughtState.create();
      expect(Object.isFrozen(state)).toBe(true);
    });
  });
});
