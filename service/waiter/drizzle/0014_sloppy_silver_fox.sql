CREATE TABLE `relationshipInternalToInternalTemplate` (
	`teamId` text NOT NULL,
	`isBlacklist` integer DEFAULT false NOT NULL,
	`targetTemplateId` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`targetTemplateId`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `relationshipInternalToInternal` RENAME TO `relationshipInternalToInternalTeam`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
DROP INDEX IF EXISTS `relationshipInternalToInternal_teamId_targetTeamId_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `relationshipInternalToInternalTemplate_teamId_targetTemplateId_unique` ON `relationshipInternalToInternalTemplate` (`teamId`,`targetTemplateId`);--> statement-breakpoint
CREATE UNIQUE INDEX `relationshipInternalToInternalTeam_teamId_targetTeamId_unique` ON `relationshipInternalToInternalTeam` (`teamId`,`targetTeamId`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/