PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`tourContentId` text NOT NULL,
	`order` integer NOT NULL,
	`kind` text DEFAULT 'location' NOT NULL,
	`heading` text NOT NULL,
	`details` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tourContentId`) REFERENCES `tourContent`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_schedule`("id", "userId", "tourContentId", "order", "kind", "heading", "details") SELECT "id", "userId", "tourContentId", "order", "kind", "heading", "details" FROM `schedule`;--> statement-breakpoint
DROP TABLE `schedule`;--> statement-breakpoint
ALTER TABLE `__new_schedule` RENAME TO `schedule`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `schedule_tourContentId_order_unique` ON `schedule` (`tourContentId`,`order`);