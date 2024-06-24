import { t } from 'elysia';

// Errors
// Remember that these should be registered in the main Elysia object in main.ts!

export class NotImplementedError extends Error {
	message: 'NOT_IMPLEMENTED' = 'NOT_IMPLEMENTED';
	status: 501 = 501;

	constructor() {
		super();
	}
}

export class NotAuthenticatedError extends Error {
	message: 'NOT_AUTHENTICATED' = 'NOT_AUTHENTICATED';
	status: 401 = 401;

	constructor() {
		super();
	}
}

export class NotAuthorizedError extends Error {
	message: 'NOT_AUTHORIZED' = 'NOT_AUTHORIZED';
	status: 403 = 403;

	constructor() {
		super();
	}
}

export class BadRequestError extends Error {
	message: 'BAD_REQUEST' = 'BAD_REQUEST';
	status: 400 = 400;

	constructor() {
		super();
	}
}

// This signifies that a *resource* wasn't found, unlike NotFoundError which
// signifies that a *route* wasn't found.
//
// Example: GET /team/not-a-team -> ResourceNotFoundError
//          GET /not-a-route -> NotFoundError
export class ResourceNotFoundError extends Error {
	message: 'RESOURCE_NOT_FOUND' = 'RESOURCE_NOT_FOUND';
	status: 404 = 404;

	constructor() {
		super();
	}
}

export class AlreadyExistsError extends Error {
	message: 'ALREADY_EXISTS' = 'ALREADY_EXISTS';
	status: 409 = 409;

	details: string;

	constructor(details: string) {
		super();
		this.details = details;
	}
}

export class KnownInternalServerError extends Error {
	message: 'KNOWN_INTERNAL_SERVER_ERROR' = 'KNOWN_INTERNAL_SERVER_ERROR';
	internal: object;

	constructor(internal: object) {
		super();
		this.internal = internal;
	}
}

// Validation
export const Slug = t.String({
	minLength: 1,
	maxLength: 32,
	pattern: '^[a-zA-Z0-9\-\_]+$'
});

export const TeamMemberPermissions = t.Object({
	canManageTemplates: t.Boolean(),
	canManageLinks: t.Boolean(),
	canManageRelationships: t.Boolean(),
	canInviteMembers: t.Boolean(),
	canManageMembers: t.Boolean(),
	canEditTeam: t.Boolean()
});

// Charity Overlay types
export interface OverlayNamedURL {
	name?: string;
    url: string;
}

export interface OverlayTemplate {
	faction: string;
	contact: string;
	templates: OverlayTemplateEntry[];
	whitelist: OverlayNamedURL[];
	blacklist: OverlayNamedURL[];
}

export interface OverlayTemplateEntry {
	name: string;
	sources: string[];
	x: number;
	y: number;
}

// These are closer to the actual ones used by the overlay:
/*
export type Template = {
	faction: string | undefined;
	contact: string | undefined;
    contactInfo: string | undefined; // alias for contact
    templates: TemplateEntry[];
    notifications: string | undefined; // url to broadcaster
    whitelist: NamedURL[];
    blacklist: NamedURL[];
}

export type TemplateEntry = {
	name: string | undefined;
    sources: string[];
    priorityMaskSources: string[];
    x: number;
    y: number;
    frameWidth: number | undefined;
    frameHeight: number | undefined;
    frameCount: number | undefined;
    frameRate: number | undefined;
    frameSpeed: number | undefined; // alias for frameRate
    startTime: number | undefined;
    looping: boolean | undefined;
}
*/