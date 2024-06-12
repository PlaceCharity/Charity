ALTER TABLE `invite` ADD `canManageLinks` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `canEditTeam` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `canManageLinks` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `canEditTeam` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `isOwner` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `teamMember_teamId_isOwner_unique` ON `teamMember` (`teamId`,`isOwner`);