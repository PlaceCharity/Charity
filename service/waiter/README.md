# Waiter

Waiter is the main service behind the cloud functionality of Charity. It manages user accounts, teams, templates, template entries/artworks, serving their JSONs/images, etc...

## Configuration

Waiter can be configured by making a file called `.env.local` and including only the environment variables you want to change. **The AUTH_SECRET absolutely needs to be changed in production.**

The included `.env` is the default configuration and shouldn't be changed.

## Database

- In **development**, use `bun db:push` to deploy the schema to your local database.
	1. If you make changes to the schema, run `bun db:push` again to redeploy the changes to your local database.
	2. Then, before committing changes that modify the database schema, use `bun db:migration:generate` to generate migration files.
	- Remember, you can use `bun db:studio` to open Drizzle Studio, a GUI to view and edit the database.
- In **production**, use `bun db:migration:apply` to deploy the migration files.

## Cloudflare

The following Cloudflare configuration should be applied:

- Create a new R2 bucket
	- In theory, it should work fine with any S3-compatible service, but you'll have to figure out serving the bucket publically yourself.
		- If your S3-compatible service does not natively provide a way to serve the bucket publically (like Cloudflare does), you can handle this yourself with some sort of reverse proxy that gets its own access key and serves the bucket publically. This proxy should be pretty cheap to run considering the Cloudflare caching settings we set later.
	- Set up the configuration in .env:
		- Set `S3_BUCKET` to the bucket name (i.e. `waiter`) and `S3_REGION` to `auto`
		- Set `S3_ENDPOINT` to your *account's* R2 endpoint (not the bucket's!)
			- You can get this in the bucket settings, but make sure to remove the bucket name, to make it your account's endpoint and not the bucket's. For example:
			- ✅ `https://{account-id}.r2.cloudflarestorage.com`
			- ❌ `https://{account-id}.r2.cloudflarestorage.com/waiter`
	- Create an access key with Object Read & Write, and add it to .env (`S3_ACCESSKEY_ID` and `S3_ACCESSKEY_SECRET`)
	- Assign a custom domain to the bucket for public access, and add it to .env as `S3_PUBLIC_BASE` (with protocol and leading slash, i.e. `https://waiter.bucket.faction.place/`)
		- Add a corresponding Cache Rule in the Cloudflare configuration for the site that has the custom domain
			- Expression: `(http.host eq "{The custom domain goes here, i.e. waiter.bucket.faction.place}")`
			- Cache Eligibility: Eligible for cache
			- Edge TTL: Ignore cache-control header and use this TTL, 1 year
			- Browser TTL: Override origin and use this TTL, 1 year
- Create 2 Transform Rules of type Rewrite URL (Optional)
	- This rule will rewrite shortlinks like `faction.place/team_name/template_name.json` to the corresponding backend path like `api.faction.place/team/team_name/template/template_name/overlay`
	- Usually this will be handled by the frontend, but if you have a **Business plan or WAF Advanced plan** on Cloudflare, you can use this rule to make Cloudflare do this work instead.
		- Because it requires a plan, this is untested. But it should work. Hopefully.
		- Don't buy a plan just for this. It really isn't necessary.
	- Rule 1 (Templates)
		- When incoming requests match...
			- Custom filter expression: `(http.request.full_uri ~ r"^https://faction\.place/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)\.json$")`
		- Then rewrite path to:
			- Dynamic `regex_replace(http.request.full_uri, r"^https://faction\.place/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)\.json$", "https://api.faction.place/team/${1}/template/${2}/overlay")`
	- Rule 2 (Teams)
		- When incoming requests match...
			- Custom filter expression: `(http.request.full_uri ~ r"^https://faction\.place/([a-zA-Z0-9-_]+)\.json$")`
		- Then rewrite path to: 
			- Dynamic: `regex_replace(http.request.full_uri, r"^https://faction\.place/([a-zA-Z0-9-_]+)\.json$", "https://api.faction.place/team/${1}/overlay")`