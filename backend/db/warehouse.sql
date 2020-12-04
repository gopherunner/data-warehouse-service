SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Create the Database data_warehouse;
DROP DATABASE IF EXISTS data_warehouse;
CREATE DATABASE IF NOT EXISTS data_warehouse;
USE data_warehouse;

-- Create Users table
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users`(
    `user_id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`first_name`,`last_name`,`email`,`is_admin`,`password`) VALUES ('Admin','Admin','admin@admin.com',true,'$2b$05$s5lufTbOf96V88HEJg2VH.mo.YkjcKL.rwDn8ucXT0ZtCY63NDoYe');

-- Create Regions table
DROP TABLE IF EXISTS `regions`;
CREATE TABLE IF NOT EXISTS `regions`(
    `region_id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `region_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`region_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Countries table
DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries`(
    `country_id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `country_name` VARCHAR(50) NOT NULL,
    `region_id` INT(11) UNSIGNED NOT NULL,
    PRIMARY KEY (`country_id`),
    FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Cities table
DROP TABLE IF EXISTS `cities`;
CREATE TABLE IF NOT EXISTS `cities`(
    `city_id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `city_name` VARCHAR(50) NOT NULL,
    `country_id` INT(11) UNSIGNED NOT NULL,
    PRIMARY KEY (`city_id`),
    FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Companies table
DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies`(
    `company_id`INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `company_name` VARCHAR(50) NOT NULL,
    `company_address` VARCHAR(50) NOT NULL,
    `company_country_id` INT(10) NOT NULL,
    `company_city_id` INT(11) UNSIGNED NOT NULL,
    `company_email` VARCHAR(50) NOT NULL,
    `company_phone` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`company_id`),
    FOREIGN KEY (`company_city_id`) REFERENCES `cities` (`city_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Contacts table
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts`(
    `contact_id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `contact_name` VARCHAR(50) NOT NULL,
    `contact_email` VARCHAR(50) NOT NULL,
    `contact_company_id` INT(11) UNSIGNED,
    `contact_region_id` INT(11) UNSIGNED,
    `contact_country_id` INT(11) UNSIGNED,
    `contact_city_id` INT(11) UNSIGNED,
    `contact_interest_id` INT(1) UNSIGNED,
    `contact_channel_id` INT(1) UNSIGNED,
    `contact_channel_user` VARCHAR(50) NOT NULL,
    `contact_pref_id` INT(1) UNSIGNED,
    PRIMARY KEY (`contact_id`),
    FOREIGN KEY (`contact_company_id`) REFERENCES `companies` (`company_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    FOREIGN KEY (`contact_city_id`) REFERENCES `cities` (`city_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Channels table
DROP TABLE IF EXISTS `channels`;
CREATE TABLE IF NOT EXISTS `channels`(
    `channel_id` INT(1) UNSIGNED AUTO_INCREMENT NOT NULL,
    `channel_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Interests table
DROP TABLE IF EXISTS `interests`;
CREATE TABLE IF NOT EXISTS `interests`(
    `interest_id`INT(1) UNSIGNED AUTO_INCREMENT NOT NULL,
    `interest_number` INT(1) UNSIGNED NOT NULL,
    PRIMARY KEY (`interest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Preferences table
DROP TABLE IF EXISTS `preferences`;
CREATE TABLE IF NOT EXISTS `preferences`(
    `preference_id` INT(1) UNSIGNED AUTO_INCREMENT NOT NULL,
    `preference_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`preference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
