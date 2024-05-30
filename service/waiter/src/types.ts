// Errors
// Remember that these should be registered in the main Elysia object in main.ts!

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

// This signifies that a *resource* wasn't found, unlike NotFoundError which
// signifies that a *route* wasn't found.
//
// Example: GET /team/not-a-team -> ResourceNotFoundError
//          GET /not-a-route -> NotFoundError
export class ResourceNotFoundError extends Error {
	message: 'RESOURCE_NOT_FOUND';
	status: 404;

	constructor() {
		super();
		this.message = 'RESOURCE_NOT_FOUND';
		this.status = 404;
	}
}

export class AlreadyExistsError extends Error {
	message: 'ALREADY_EXISTS';
	status: 409;

	details: string;

	constructor(details: string) {
		super();
		this.message = 'ALREADY_EXISTS';
		this.status = 409;
		this.details = details;
	}
}

export { APIUser } from '~/controller/user';
export { APITeam, APITeamMember } from '~/controller/team';
export { APILink } from '~/controller/link';