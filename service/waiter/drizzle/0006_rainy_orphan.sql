CREATE UNIQUE INDEX `teamSlugIndex` ON `slug` (`teamId`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `teamNamespaceIndex` ON `team` (`namespace`);