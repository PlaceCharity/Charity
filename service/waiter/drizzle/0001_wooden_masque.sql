CREATE TABLE `teamMember` (
	`teamId` text NOT NULL,
	`userId` text NOT NULL,
	PRIMARY KEY(`teamId`, `userId`),
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `team` (
	`id` text PRIMARY KEY NOT NULL,
	`namespace` text NOT NULL,
	`displayName` text NOT NULL,
	`description` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_namespace_unique` ON `team` (`namespace`);