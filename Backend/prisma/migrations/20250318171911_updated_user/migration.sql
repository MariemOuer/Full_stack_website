-- CreateTable
CREATE TABLE `event_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_email` VARCHAR(255) NULL,
    `event_name` VARCHAR(255) NULL,
    `event_type` VARCHAR(255) NULL,
    `event_date` DATE NULL,
    `event_length` INTEGER NULL,
    `guest_count` INTEGER NULL,
    `location` VARCHAR(255) NULL,
    `catering` VARCHAR(255) NULL,
    `theme` VARCHAR(255) NULL,
    `entertainment` VARCHAR(255) NULL,
    `budget` DECIMAL(10, 2) NULL,
    `accommodations` VARCHAR(255) NULL,
    `special_requests` TEXT NULL,
    `event_timeline` JSON NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
