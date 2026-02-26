import { describe, expect, test } from "vitest";
import { CaughtState } from "./CaughtState";

describe('CaughtState tests', () => {

  test('create a caught state correctly', () => {
    expect(() => {
      CaughtState.create();
    }).not.toThrowError()
  })

  test('has default value of NOT_CAUGHT', () => {
    const state = CaughtState.create();
    expect(state.equals(CaughtState.notCaught())).toBe(true);
  })

  test('states are cyclical', () => {
    const firstState = CaughtState.create(); // Default value NOT_CAUGHT
    const secondState = firstState.next(); // New value PENDING
    const thirdState = secondState.next(); // New Value CAUGHT
    const fourthState = thirdState.next(); // New Value NOT_CAUGHT
    console.log({firstState, secondState, thirdState, fourthState})
    expect(firstState.equals(fourthState)).toBe(true);
    let forLoopState = CaughtState.create();
    for (let index = 0; index < 3; index++) {
      console.log({forLoopState})
      forLoopState = forLoopState.next();
    }
    expect(firstState.equals(forLoopState)).toBe(true)
  })

  test('equals works', () => {
    const defaultState = CaughtState.create();
    expect(defaultState.equals(CaughtState.create())).toBe(true);
    expect(defaultState.equals(CaughtState.caught())).toBe(false);
    expect(defaultState.equals(CaughtState.pending())).toBe(false);
    expect(defaultState.equals(CaughtState.notCaught())).toBe(true);
  })

  // test('Is immutable', () => {
    
  // })
})