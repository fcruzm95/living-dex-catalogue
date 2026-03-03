/**
 * Custom Error class for all domain-level validation failures.
 * Used to distinguish business rule violations from technical errors.
 *
 * When to use DomainError:
 * - Invalid Pokemon ID (e.g., 999 for Gen 1)
 * - Empty Pokemon name
 * - Pokemon not available in any game version
 * - Invalid generation number
 * - State machine violations
 *
 * Example:
 * ```typescript
 * if (id > 151) {
 *   throw new DomainError("Pokemon ID must be between 1 and 151 for Generation 1");
 * }
 * ```
 *
 * @extends Error
 */
export class DomainError extends Error {
  /**
   * Creates a new DomainError with the specified message.
   * @param message A descriptive error message explaining the domain rule violation.
   */
  constructor(message: string) {
    super(message);
    this.name = "DomainError"
  }
}