CREATE TABLE `invite` (
	`teamId` text NOT NULL,
	`userId` text NOT NULL,
	`canManageTemplates` integer DEFAULT false NOT NULL,
	`canInviteMembers` integer DEFAULT false NOT NULL,
	`canManageMembers` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	PRIMARY KEY(`teamId`, `userId`),
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `link` (
	`id` text PRIMARY KEY NOT NULL,
	`teamId` text NOT NULL,
	`slug` text NOT NULL,
	`url` text NOT NULL,
	`text` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `teamMember` ADD `canManageTemplates` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `canInviteMembers` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `canManageMembers` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `link_teamId_slug_unique` ON `link` (`teamId`,`slug`);