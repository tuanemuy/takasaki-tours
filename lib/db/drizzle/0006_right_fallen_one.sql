DROP INDEX `locationsFiles_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `locationsFiles_locationId_order_unique` ON `locationsFiles` (`locationId`,`order`);--> statement-breakpoint
DROP INDEX `schedule_order_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `schedule_tourContentId_order_unique` ON `schedule` (`tourContentId`,`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `toursFiles_tourId_order_unique` ON `toursFiles` (`tourId`,`order`);