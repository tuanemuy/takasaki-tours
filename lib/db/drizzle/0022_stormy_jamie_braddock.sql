DROP INDEX "asset_fileId_label_unique";--> statement-breakpoint
DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "file_path_unique";--> statement-breakpoint
DROP INDEX "locationContent_locationId_locale_unique";--> statement-breakpoint
DROP INDEX "locationsFiles_locationId_order_unique";--> statement-breakpoint
DROP INDEX "profile_userId_unique";--> statement-breakpoint
DROP INDEX "schedule_tourContentId_order_unique";--> statement-breakpoint
DROP INDEX "tourContent_tourId_locale_unique";--> statement-breakpoint
DROP INDEX "tour_slug_unique";--> statement-breakpoint
DROP INDEX "toursFiles_tourId_order_unique";--> statement-breakpoint
DROP INDEX "toursLocations_tourId_order_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `application` ALTER COLUMN "status" TO "status" text NOT NULL DEFAULT 'new';--> statement-breakpoint
CREATE UNIQUE INDEX `asset_fileId_label_unique` ON `asset` (`fileId`,`label`);--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `file_path_unique` ON `file` (`path`);--> statement-breakpoint
CREATE UNIQUE INDEX `locationContent_locationId_locale_unique` ON `locationContent` (`locationId`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `locationsFiles_locationId_order_unique` ON `locationsFiles` (`locationId`,`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_userId_unique` ON `profile` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `schedule_tourContentId_order_unique` ON `schedule` (`tourContentId`,`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `tourContent_tourId_locale_unique` ON `tourContent` (`tourId`,`locale`);--> statement-breakpoint
CREATE UNIQUE INDEX `tour_slug_unique` ON `tour` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `toursFiles_tourId_order_unique` ON `toursFiles` (`tourId`,`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `toursLocations_tourId_order_unique` ON `toursLocations` (`tourId`,`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);