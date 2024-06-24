CREATE TABLE `entry` (
	`id` text PRIMARY KEY NOT NULL,
	`templateId` text NOT NULL,
	`displayName` text NOT NULL,
	`fileId` text,
	`description` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`templateId`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fileId`) REFERENCES `file`(`id`) ON UPDATE no action ON DELETE set default
);
--> statement-breakpoint
ALTER TABLE `file` ADD `uploaderId` text REFERENCES user(id);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/