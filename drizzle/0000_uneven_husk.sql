CREATE TABLE `booking_items` (
	`id` varchar(255) NOT NULL,
	`booking_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`price_per_night` int NOT NULL,
	CONSTRAINT `booking_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`night_count` int NOT NULL,
	`total_price` int NOT NULL,
	`status` enum('PENDING','PAID','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
	`notes` text,
	`payment_url` varchar(1024),
	`created_at` datetime NOT NULL DEFAULT '2026-09-23 14:57:30.660',
	`updated_at` datetime NOT NULL DEFAULT '2026-09-23 14:57:30.660',
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bundle_items` (
	`id` varchar(255) NOT NULL,
	`bundle_id` varchar(255) NOT NULL,
	`product_id` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `bundle_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`price_per_night` int NOT NULL,
	`stock` int NOT NULL,
	`category` varchar(255) NOT NULL,
	`icon_name` varchar(255) NOT NULL,
	`is_bundle` boolean NOT NULL DEFAULT false,
	`description` text,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`whatsapp_number` varchar(20) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT '2026-09-23 14:57:30.660',
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `booking_items` ADD CONSTRAINT `booking_items_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `booking_items` ADD CONSTRAINT `booking_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bundle_items` ADD CONSTRAINT `bundle_items_bundle_id_products_id_fk` FOREIGN KEY (`bundle_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bundle_items` ADD CONSTRAINT `bundle_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;