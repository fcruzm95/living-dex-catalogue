import { describe, expect, test } from "vitest";
import { GameVersion, GameVersionValues } from "./GameVersion";
import { DomainError } from "../errors/DomainError";

describe("GameVersion tests", () => {
  describe("GameVersion Creation", () => {
    test("should create a game version", () => {
      expect(() => {
        GameVersion.create(GameVersionValues.RED);
      }).not.toThrowError(DomainError);
    });

    test("Should NOT create a game version", () => {
      expect(() => {
        GameVersion.create("");
      }).toThrowError(DomainError);
      expect(() => {
        GameVersion.create("test");
      }).toThrowError(DomainError);
    });

    test("Should create a game version directly", () => {
      expect(GameVersion.red()).toEqual(
        GameVersion.create(GameVersionValues.RED),
      );
      expect(GameVersion.blue()).not.toEqual(
        GameVersion.create(GameVersionValues.RED),
      );
      expect(GameVersion.yellow()).not.toEqual(
        GameVersion.create(GameVersionValues.RED),
      );

      expect(GameVersion.blue()).toEqual(
        GameVersion.create(GameVersionValues.BLUE),
      );
      expect(GameVersion.yellow()).toEqual(
        GameVersion.create(GameVersionValues.YELLOW),
      );
    });

    test("should validate version name", () => {
      const testVersion = GameVersion.create(GameVersionValues.RED);
      expect(testVersion.name).toBe(GameVersionValues.RED);
    });
  });

  describe("Should be immutable", () => {
    test("Should be frozen", () => {
      const version = GameVersion.create(GameVersionValues.RED);
      expect(Object.isFrozen(version));
    });

    test("References are different from the value", () => {
      const version = GameVersion.create(GameVersionValues.RED);
      const otherVersion = GameVersion.create(GameVersionValues.RED);
      expect(version).not.toBe(otherVersion);
      expect(version).toEqual(otherVersion);
    });
  });

  test("should compare versions", () => {
    const red = GameVersion.create(GameVersionValues.RED);
    const otherRed = GameVersion.create(GameVersionValues.RED);
    const blue = GameVersion.create(GameVersionValues.BLUE);

    expect(red.equals(otherRed)).toBe(true);
    expect(red.equals(red)).toBe(true);
    expect(red.equals(blue)).toBe(false);
    expect(otherRed.equals(blue)).toBe(false);
  });

  test("toString returns formatted version", () => {
    const red = GameVersion.red();
    expect(red.toString()).toBe("red version");

    const blue = GameVersion.blue();
    expect(blue.toString()).toBe("blue version");

    const yellow = GameVersion.yellow();
    expect(yellow.toString()).toBe("yellow version");
  });
});
