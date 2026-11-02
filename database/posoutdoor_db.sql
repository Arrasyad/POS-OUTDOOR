-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 02, 2026 at 01:49 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `posoutdoor_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `name`, `created_at`) VALUES
('c5b83821-fc13-4e07-9d2b-95dc584c0306', 'admin', '$2b$10$K.JDLox4IKRUACbrXvLVZOfSYy2cFmzXz8iDzzNRhELlFicCFU4Om', 'Super Admin', '2026-09-25 21:37:42');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `night_count` int NOT NULL,
  `total_price` int NOT NULL,
  `status` enum('PENDING','DP_PAID','PAID','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `notes` text,
  `payment_url` varchar(1024) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2026-09-23 14:57:09',
  `updated_at` datetime NOT NULL DEFAULT '2026-09-23 14:57:09'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `start_date`, `end_date`, `night_count`, `total_price`, `status`, `notes`, `payment_url`, `created_at`, `updated_at`) VALUES
('POS-202609-628', '2dc08131-7d99-4d8d-a54c-81db336bd804', '2026-09-25 00:00:00', '2026-09-26 00:00:00', 1, 50000, 'COMPLETED', '', NULL, '2026-09-23 14:57:09', '2026-09-23 14:57:09'),
('POS-202609-669', 'd576932b-aade-4b5e-bfc0-c9d652dd9510', '2026-09-25 00:00:00', '2026-09-26 00:00:00', 1, 50000, 'COMPLETED', '', NULL, '2026-09-23 14:57:09', '2026-09-23 14:57:09'),
('POS-202609-725', 'a28ce559-4684-4288-ad63-1de9bf692785', '2026-09-25 00:00:00', '2026-09-26 00:00:00', 1, 50000, 'COMPLETED', '', NULL, '2026-09-23 14:57:09', '2026-09-23 14:57:09'),
('POS-202609-756', '869ce37c-dcc0-48b3-8ac0-d65dd3d4ca96', '2026-09-25 00:00:00', '2026-09-26 00:00:00', 1, 50000, 'PAID', '', NULL, '2026-09-23 14:57:09', '2026-09-23 14:57:09');

-- --------------------------------------------------------

--
-- Table structure for table `booking_items`
--

CREATE TABLE `booking_items` (
  `id` varchar(255) NOT NULL,
  `booking_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `price_per_night` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking_items`
--

INSERT INTO `booking_items` (`id`, `booking_id`, `product_id`, `quantity`, `price_per_night`) VALUES
('0e072632-8a67-4393-a641-987a49645190', 'POS-202609-628', 'fa30516b-c739-4a70-9cb8-a63466af04b9', 1, 50000),
('5a250451-3050-41f9-8e1e-4eeec401106b', 'POS-202609-756', 'fa30516b-c739-4a70-9cb8-a63466af04b9', 1, 50000),
('94b14f0a-b915-4d21-8c0c-45f005e1d57c', 'POS-202609-669', 'fa30516b-c739-4a70-9cb8-a63466af04b9', 1, 50000),
('9df0a4a0-2943-4f7c-a275-fce4f650383c', 'POS-202609-725', 'fa30516b-c739-4a70-9cb8-a63466af04b9', 1, 50000);

-- --------------------------------------------------------

--
-- Table structure for table `bundle_items`
--

CREATE TABLE `bundle_items` (
  `id` varchar(255) NOT NULL,
  `bundle_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price_per_night` int NOT NULL,
  `stock` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `icon_name` varchar(255) DEFAULT NULL,
  `is_bundle` tinyint(1) NOT NULL DEFAULT '0',
  `description` text,
  `image_url` varchar(1024) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price_per_night`, `stock`, `category`, `icon_name`, `is_bundle`, `description`, `image_url`) VALUES
('fa30516b-c739-4a70-9cb8-a63466af04b9', 'Eiger 60L', 50000, 5, 'tenda', NULL, 0, NULL, '/uploads/1790348241333-293556003.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `whatsapp_number` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '2026-09-23 14:57:09'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `whatsapp_number`, `created_at`) VALUES
('2dc08131-7d99-4d8d-a54c-81db336bd804', 'user B', '08363736732', '2026-09-23 14:57:09'),
('869ce37c-dcc0-48b3-8ac0-d65dd3d4ca96', 'user x', '0856784563', '2026-09-23 14:57:09'),
('a28ce559-4684-4288-ad63-1de9bf692785', 'user B', '08363736732', '2026-09-23 14:57:09'),
('d576932b-aade-4b5e-bfc0-c9d652dd9510', 'user B', '08363736732', '2026-09-23 14:57:09');

-- --------------------------------------------------------

--
-- Table structure for table `__drizzle_migrations`
--

CREATE TABLE `__drizzle_migrations` (
  `id` bigint UNSIGNED NOT NULL,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_user_id_users_id_fk` (`user_id`);

--
-- Indexes for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_items_booking_id_bookings_id_fk` (`booking_id`),
  ADD KEY `booking_items_product_id_products_id_fk` (`product_id`);

--
-- Indexes for table `bundle_items`
--
ALTER TABLE `bundle_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bundle_items_bundle_id_products_id_fk` (`bundle_id`),
  ADD KEY `bundle_items_product_id_products_id_fk` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `booking_items`
--
ALTER TABLE `booking_items`
  ADD CONSTRAINT `booking_items_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `booking_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `bundle_items`
--
ALTER TABLE `bundle_items`
  ADD CONSTRAINT `bundle_items_bundle_id_products_id_fk` FOREIGN KEY (`bundle_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `bundle_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
