import { env } from '~/util/env';
import { Context, Elysia, t } from 'elysia';
import { AlreadyExistsError, BadRequestError, NotAuthenticatedError, NotAuthorizedError, NotImplementedError, ResourceNotFoundError } from '~/types';
import * as schema from '~/instance/database/schema';
import db from '~/instance/database';
import { InferSelectModel, and, eq } from 'drizzle-orm';
import { getSession } from '~/instance/auth';
import { SQLiteError } from 'bun:sqlite';

const tags = ['team/relationship'];

export class APIRelationshipInternalToInternalTeam {
	teamId: string;
	isBlacklist: boolean;
	targetTeamId: string;

	constructor(relationship: InferSelectModel<typeof schema.relationshipsInternalToInternalTeam>) {
		this.teamId = relationship.teamId;
		this.isBlacklist = relationship.isBlacklist;
		this.targetTeamId = relationship.targetTeamId;
	}
};

export class APIRelationshipInternalToInternalTemplate {
	teamId: string;
	isBlacklist: boolean;
	targetTemplateId: string;

	constructor(relationship: InferSelectModel<typeof schema.relationshipsInternalToInternalTemplate>) {
		this.teamId = relationship.teamId;
		this.isBlacklist = relationship.isBlacklist;
		this.targetTemplateId = relationship.targetTemplateId;
	}
};

export class APIRelationshipInternalToExternal {
	teamId: string;
	isBlacklist: boolean;
	targetTemplateUri: string;

	constructor(relationship: InferSelectModel<typeof schema.relationshipsInternalToExternal>) {
		this.teamId = relationship.teamId;
		this.isBlacklist = relationship.isBlacklist;
		this.targetTemplateUri = relationship.targetTemplateUri;
	}
};

export type APIRelationship = APIRelationshipInternalToInternalTeam | APIRelationshipInternalToInternalTemplate | APIRelationshipInternalToExternal;

export default new Elysia()
	.get('/team/:namespace/relationships', 
		async (context) => {
			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase()),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Get InternalToInternalTeam relationships
			const internalToInternalTeamRelationships = await db.query.relationshipsInternalToInternalTeam.findMany({
				where: eq(schema.relationshipsInternalToInternalTeam.teamId, team.id)
			});

			// Get InternalToInternalTemplate relationships
			const internalToInternalTemplateRelationships = await db.query.relationshipsInternalToInternalTemplate.findMany({
				where: eq(schema.relationshipsInternalToInternalTemplate.teamId, team.id)
			});

			// Get InternalToExternal relationships
			const internalToExternalRelationships = await db.query.relationshipsInternalToExternal.findMany({
				where: eq(schema.relationshipsInternalToExternal.teamId, team.id)
			});

			// Return
			return Response.json([
				...internalToInternalTeamRelationships.map(r => new APIRelationshipInternalToInternalTeam(r)),
				...internalToInternalTemplateRelationships.map(r => new APIRelationshipInternalToInternalTemplate(r)),
				...internalToExternalRelationships.map(r => new APIRelationshipInternalToExternal(r))
			]);
		},
		{ detail: { tags, summary: 'Get team relationships' } }
	)
	.post('/team/:namespace/relationship', 
		async (context) => {
			// Get session
			const session = await getSession(context as Context);
			if (!session || !session.user) throw new NotAuthenticatedError();

			// Get team
			const team = await db.query.teams.findFirst({
				where: eq(schema.teams.namespace, context.params.namespace.toLowerCase()),
			});
			if (team == undefined) throw new ResourceNotFoundError();

			// Check permissions to see if we can manage relationships
			const member = await db.query.teamMembers.findFirst({
				where: and(
					eq(schema.teamMembers.teamId, team.id),
					eq(schema.teamMembers.userId, session.user.id)
				)
			});
			if (member == undefined || !member.canManageRelationships) throw new NotAuthorizedError();

			// Catch callback
			const catchCallback = (err: any) => {
				if (err instanceof SQLiteError) {
					if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
						throw new AlreadyExistsError('RELATIONSHIP');
					}
				}
				throw err;
			}

			// Determine type of relationship
			if (context.body.targetTeamId != undefined) {
				// InternalToInternalTeam
				const targetTeam = await db.query.teams.findFirst({
					where: eq(schema.teams.id, context.body.targetTeamId)
				});
				if (targetTeam == undefined) throw new ResourceNotFoundError();

				const relationship = await db.insert(schema.relationshipsInternalToInternalTeam).values({
					teamId: team.id,
					isBlacklist: context.body.isBlacklist,
					targetTeamId: targetTeam.id
				}).returning().catch(catchCallback);

				return Response.json(new APIRelationshipInternalToInternalTeam(relationship[0]));
			} else if (context.body.targetTemplateId != undefined) {
				// InternalToInternalTemplate
				const targetTemplate = await db.query.templates.findFirst({
					where: eq(schema.templates.id, context.body.targetTemplateId)
				});
				if (targetTemplate == undefined) throw new ResourceNotFoundError();

				const relationship = await db.insert(schema.relationshipsInternalToInternalTemplate).values({
					teamId: team.id,
					isBlacklist: context.body.isBlacklist,
					targetTemplateId: targetTemplate.id
				}).returning().catch(catchCallback);

				return Response.json(new APIRelationshipInternalToInternalTemplate(relationship[0]));
			} else if (context.body.targetTemplateUri != undefined) {
				// InternalToExternal
				const relationship = await db.insert(schema.relationshipsInternalToExternal).values({
					teamId: team.id,
					isBlacklist: context.body.isBlacklist,
					targetTemplateUri: context.body.targetTemplateUri
				}).returning().catch(catchCallback);

				return Response.json(new APIRelationshipInternalToExternal(relationship[0]));
			} else throw new BadRequestError();
		},
		{
			detail: { 
				tags, summary: 'Create a new relationship',
				description: 'Provide targetTeamId or targetTemplateId for a relationship with an internal team/template (i.e. hosted on this Waiter instance) or targetTemplateUri for a relationship with an external template. If isBlacklist is false, the relationship is an ally/whitelist. If isBlacklist is true, the relationship is an enemy/blacklist.'
			},
			params: t.Object({
				namespace: t.String()
			}),
			body: t.Object({
				targetTeamId: t.Optional(t.String()),
				targetTemplateId: t.Optional(t.String()),
				targetTemplateUri: t.Optional(t.String({ format: 'uri' })),
				isBlacklist: t.Boolean()
			})
		}
	)
	.get('/team/:namespace/relationship/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Get relationship details' } }
	)
	.patch('/team/:namespace/relationship/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Update relationship details' } }
	)
	.delete('/team/:namespace/relationship/:id', 
		() => { throw new NotImplementedError() },
		{ detail: { tags, summary: 'Delete a relationship' } }
	)