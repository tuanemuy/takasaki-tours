DROP INDEX "asset_path_unique";--> statement-breakpoint
DROP INDEX "asset_fileId_label_unique";--> statement-breakpoint
DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "file_path_unique";--> statement-breakpoint
DROP INDEX "locationContent_locationId_locale_unique";--> statement-breakpoint
DROP INDEX "profile_userId_unique";--> statement-breakpoint
DROP INDEX "tourContent_tourId_locale_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `locationContent` ALTER COLUMN "locale" TO "locale" text NOT NULL DEFAULT 'ja';--> statement-breakpoint
CREATE UNIQUE INDEX `asset_path_unique` ON `asset` (`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `asset_fileId_label_unique` ON `asset` (`fileId`,`label`);--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `file_path_unique` ON `file` (`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `locationContent_locationId_locale_unique` ON `locationContent` (`locationId`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `tourContent_tourId_locale_unique` ON `tourContent` (`tourId`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `locationContent` ADD `userId` text NOT NULL REFERENCES user(id);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_location` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_location`("id", "userId", "name", "createdAt", "updatedAt") SELECT "id", "userId", "name", "createdAt", "updatedAt" FROM `location`;--> statement-breakpoint
DROP TABLE `location`;--> statement-breakpoint
ALTER TABLE `__new_location` RENAME TO `location`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `tourContent` ALTER COLUMN "locale" TO "locale" text NOT NULL DEFAULT 'ja';--> statement-breakpoint
ALTER TABLE `tourContent` ADD `userId` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `schedule` ADD `userId` text NOT NULL REFERENCES user(id);