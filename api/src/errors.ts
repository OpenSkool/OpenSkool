export const HTTP_STATUS_BAD_REQUEST = 400;

export const HTTP_STATUS_UNAUTHORIZED = 401;

export const HTTP_STATUS_NOT_FOUND = 404;

export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

type AppErrorExtensions = Record<string, unknown>;

interface AppErrorOptions {
  extensions?: AppErrorExtensions;
  cause?: Error;
  statusCode?: number;
}

export class AppError extends Error {
  public extensions?: AppErrorExtensions;

  public statusCode?: number;

  constructor(message: string, options?: AppErrorOptions) {
    super(message);
    this.extensions = options?.extensions;
    this.statusCode = options?.statusCode;
    this.cause = options?.cause;
    this.name = 'AppError';
  }
}

export class AppUnauthorizedError extends AppError {
  constructor(
    message = 'Unauthorized',
    options: Omit<AppErrorOptions, 'statusCode'> = {},
  ) {
    super(message, options);
    this.name = 'AppUnauthorizedError';
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

export interface AppValidationErrorExtensions extends AppErrorExtensions {
  code: string;
  path: string[];
}

export class AppValidationError extends AppError {
  public extensions: AppValidationErrorExtensions;

  constructor(
    message: string,
    options: Omit<AppErrorOptions, 'statusCode'> & {
      extensions: AppValidationErrorExtensions;
    },
  ) {
    super(message, options);
    this.extensions = options.extensions;
    this.name = 'AppValidationError';
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}
