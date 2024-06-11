ALTER TABLE `teamMember` ADD `isOwner` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `teamMember_teamId_isOwner_unique` ON `teamMember` (`teamId`,`isOwner`);