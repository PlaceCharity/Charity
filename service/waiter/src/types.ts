// Errors
class NotAuthenticatedError extends Error {
	message: 'NOT_AUTHENTICATED';
	status: 401;

	constructor() {
		super();
		this.message = 'NOT_AUTHENTICATED';
		this.status = 401;
	}
}

export { NotAuthenticatedError };
export { APIUser } from '~/controller/user';