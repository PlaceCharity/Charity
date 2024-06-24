CREATE TABLE `relationshipInternalToExternal` (
	`teamId` text NOT NULL,
	`isBlacklist` integer DEFAULT false NOT NULL,
	`targetTemplateUri` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `relationshipInternalToInternal` (
	`teamId` text NOT NULL,
	`isBlacklist` integer DEFAULT false NOT NULL,
	`targetTeamId` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`targetTeamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `relationshipInternalToExternal_teamId_targetTemplateUri_unique` ON `relationshipInternalToExternal` (`teamId`,`targetTemplateUri`);--> statement-breakpoint
CREATE UNIQUE INDEX `relationshipInternalToInternal_teamId_targetTeamId_unique` ON `relationshipInternalToInternal` (`teamId`,`targetTeamId`);