import { t } from 'elysia';

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

export class NotAuthorizedError extends Error {
	message: 'NOT_AUTHORIZED';
	status: 403;

	constructor() {
		super();
		this.message = 'NOT_AUTHORIZED';
		this.status = 403;
	}
}

export class BadRequestError extends Error {
	message: 'BAD_REQUEST';
	status: 400;

	constructor() {
		super();
		this.message = 'BAD_REQUEST';
		this.status = 400;
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

// Validation types

export const Slug = t.String({
	minLength: 1,
	maxLength: 32,
	pattern: '^[a-zA-Z0-9\-\_]+$'
});

// Return types

export { APIUser } from '~/controller/user';
export { APITeam, APITeamMember, Namespace } from '~/controller/team';
export { PartialAPIInvite, APIInvite } from '~/controller/team/invite';
export { APILink } from '~/controller/team/link';