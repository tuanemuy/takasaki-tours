ALTER TABLE `application` ADD `createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;--> statement-breakpoint
ALTER TABLE `application` ADD `updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL;