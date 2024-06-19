ALTER TABLE `invite` ADD `canManageRelationships` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `teamMember` ADD `canManageRelationships` integer DEFAULT false NOT NULL;