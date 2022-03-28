import mercurius from 'mercurius';

export const HTTP_STATUS_BAD_REQUEST = 400;

export const HTTP_STATUS_NOT_FOUND = 404;

export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

type AppErrorExtensions = Record<string, unknown>;

interface AppErrorOptions {
  extensions?: AppErrorExtensions;
  cause?: Error;
  statusCode?: number;
}

export class AppError extends mercurius.ErrorWithProps {
  constructor(message: string, options?: AppErrorOptions) {
    super(message, options?.extensions, options?.statusCode);
    this.cause = options?.cause;
    this.name = 'AppError';
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
