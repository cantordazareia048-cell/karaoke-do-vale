CREATE TABLE `karaokeRooms` (
	`id` varchar(32) NOT NULL,
	`code` varchar(8) NOT NULL,
	`hostToken` varchar(80) NOT NULL,
	`status` enum('active','closed') NOT NULL DEFAULT 'active',
	`state` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `karaokeRooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `karaokeRooms_code_unique` UNIQUE(`code`)
);
