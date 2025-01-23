ALTER TABLE `toursLocations` ADD `order` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `toursLocations_tourId_order_unique` ON `toursLocations` (`tourId`,`order`);