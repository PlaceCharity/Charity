# Charity

This is the monorepo for the new Charity rewrite.

Packages:

- `app`
	- `userscript`: The overlay userscript.
	- `website`: Website is the web client.
- `service`
	- `waiter`: Waiter is the service that manages/hosts templates, including JSON and images.
	- `place`: A microservice that returns information about the current r/place canvas.