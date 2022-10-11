interface AppErrorMetadata {
	cause?: Error;
	path?: string[];
	[key: string]: unknown;
}

/* eslint default-param-last:off */
/* eslint @typescript-eslint/default-param-last:error */

export class AppError<T extends AppErrorMetadata> extends Error {
	constructor(message: string, public metadata?: T) {
		super(message);
		this.metadata = metadata;
		this.name = 'AppError';
	}
}

export class AppUserError<T extends AppErrorMetadata> extends Error {
	constructor(public code: string, message: string, public metadata?: T) {
		super(message);
		this.metadata = metadata;
		this.name = 'AppUserError';
	}
}

export class AppInputError<
	T extends AppErrorMetadata & { path: string[] },
> extends AppUserError<T> {
	constructor(code: string, message: string, public metadata?: T) {
		super(code, message);
		this.metadata = metadata;
		this.name = 'AppInputError';
	}
}

export class AppNotFoundError<
	T extends AppErrorMetadata,
> extends AppUserError<T> {
	constructor(message = 'Not Found', metadata?: T) {
		super('AE404', message, metadata);
		this.name = 'AppNotFoundError';
	}
}

export class AppUnauthorizedError<
	T extends AppErrorMetadata,
> extends AppUserError<T> {
	constructor(message = 'Unauthorized', metadata?: T) {
		super('AE401', message, metadata);
		this.name = 'AppUnauthorizedError';
	}
}
