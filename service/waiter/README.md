# Waiter

Waiter is the service that manages/hosts templates, including JSON and images.

## Configuration

Waiter can be configured by making a file called `.env.local` and including only the environment variables you want to change. **The AUTH_SECRET absolutely needs to be changed in production.**

The included `.env` is the default configuration and shouldn't be changed.

## Database

- In **development**, use `bun db:push` to deploy the schema to your local database.
	1. If you make changes to the schema, run `bun db:push` again to redeploy the changes to your local database.
	2. Then, before committing changes that modify the database schema, use `bun db:migration:generate` to generate migration files.
	- Remember, you can use `bun db:studio` to open Drizzle Studio, a GUI to view and edit the database.
- In **production**, use `bun db:migration:apply` to deploy the migration files.