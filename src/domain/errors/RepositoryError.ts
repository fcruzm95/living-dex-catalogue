export const RepositoryErrorType = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PERSISTENCE_ERROR: "PERSISTENCE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;
export type RepositoryErrorType =
  (typeof RepositoryErrorType)[keyof typeof RepositoryErrorType];

export class RepositoryError extends Error {
  constructor(
    public readonly type: RepositoryErrorType,
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "RepositoryError";
  }

  static notFound(id: string): RepositoryError {
    return new RepositoryError(
      RepositoryErrorType.NOT_FOUND,
      `Pokemon with ID ${id} not found`,
    );
  }

  static validationError(message: string): RepositoryError {
    return new RepositoryError(
      RepositoryErrorType.VALIDATION_ERROR,
      `Validation Error: ${message}`,
    );
  }

  static persistanceError(message: string, originalError?: unknown) {
    return new RepositoryError(
      RepositoryErrorType.PERSISTENCE_ERROR,
      `Persistance Error: ${message}`,
      originalError,
    );
  }

  static networkError(message: string, originalError?: unknown) {
    return new RepositoryError(
      RepositoryErrorType.NETWORK_ERROR,
      `Network Error: ${message}`,
      originalError,
    );
  }

  static unknownError(originalError: unknown) {
    const message =
      originalError instanceof Error ? originalError.message : "Unknown Error";
    return new RepositoryError(
      RepositoryErrorType.UNKNOWN_ERROR,
      `Unknown Error: ${message}`,
      originalError,
    );
  }

  isType(type: RepositoryErrorType): boolean {
    return this.type === type;
  }
}
