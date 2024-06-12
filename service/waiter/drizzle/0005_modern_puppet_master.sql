CREATE TABLE `slug` (
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`slug` text NOT NULL,
	`linkId` text,
	`templateId` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`templateId`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`displayName` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX IF EXISTS `link_teamId_slug_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `slug_teamId_slug_unique` ON `slug` (`teamId`,`slug`);--> statement-breakpoint
ALTER TABLE `link` DROP COLUMN `slug`;