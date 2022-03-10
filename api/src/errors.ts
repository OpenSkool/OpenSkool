export const HTTP_STATUS_BAD_REQUEST = 400;

export const HTTP_STATUS_NOT_FOUND = 404;

export enum UserErrorCode {
  VALUE_INVALID = 'valueInvalid',
  VALUE_NOT_UNIQUE = 'valueNotUnique',
}

export class UserError extends Error {
  public name = 'UserError';

  constructor(
    message: string,
    public extensions: Record<string, unknown> = {},
    public statusCode = HTTP_STATUS_BAD_REQUEST,
  ) {
    super(message);
  }
}

export interface ValidationErrorExtensions {
  code: string;
  path: string[];
}

export class ValidationError extends UserError {
  public name = 'ValidationError';

  constructor(
    message: string,
    public extensions: ValidationErrorExtensions & Record<string, unknown>,
  ) {
    super(message, extensions);
  }
}
