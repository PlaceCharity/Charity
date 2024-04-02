// Errors
export class NotImplementedError extends Error {
	message: 'NOT_IMPLEMENTED';
	status: 501;

	constructor() {
		super();
		this.message = 'NOT_IMPLEMENTED';
		this.status = 501;
	}
}

export class NotAuthenticatedError extends Error {
	message: 'NOT_AUTHENTICATED';
	status: 401;

	constructor() {
		super();
		this.message = 'NOT_AUTHENTICATED';
		this.status = 401;
	}
}

export { APIUser } from '~/controller/user';