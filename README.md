# Charity

This is the monorepo for the new Charity rewrite.

Packages:

- `app`
	- `website`: The frontend for the main Charity website.
	- `userscript`: An overlay to show your templates on the canvas.
- `service`
	- `waiter`: Waiter is the service that manages/hosts templates, including JSON and images.
	- `place`: A microservice that returns information about the current r/place canvas.