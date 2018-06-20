-- MySQL Script generated by MySQL Workbench
-- Wed 20 Jun 2018 03:12:12 AM -05
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema organizer
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema organizer
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `organizer` DEFAULT CHARACTER SET utf8 ;
USE `organizer` ;

-- -----------------------------------------------------
-- Table `organizer`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `birthday` DATE NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` TIMESTAMP NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `organizer`.`projects_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer`.`projects_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `summary` INT(5) NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `organizer`.`projects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer`.`projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT NULL,
  `private` TINYINT(1) NULL DEFAULT 0,
  `status` TINYINT(1) NULL DEFAULT 1,
  `users_id` INT NOT NULL,
  `types_id` INT NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` TIMESTAMP NULL,
  PRIMARY KEY (`id`, `users_id`, `types_id`),
  INDEX `fk_projects_users_idx` (`users_id` ASC),
  INDEX `fk_projects_types1_idx` (`types_id` ASC),
  CONSTRAINT `fk_projects_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `organizer`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_projects_types1`
    FOREIGN KEY (`types_id`)
    REFERENCES `organizer`.`projects_types` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `organizer`.`tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer`.`tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `description` TEXT NULL,
  `status` TINYINT(1) NULL DEFAULT 1,
  `projects_id` INT NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` TIMESTAMP NULL,
  PRIMARY KEY (`id`, `projects_id`),
  INDEX `fk_tasks_projects1_idx` (`projects_id` ASC),
  CONSTRAINT `fk_tasks_projects1`
    FOREIGN KEY (`projects_id`)
    REFERENCES `organizer`.`projects` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `organizer`.`tasks_assignee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer`.`tasks_assignee` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tasks_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` TIMESTAMP NULL,
  PRIMARY KEY (`id`, `tasks_id`, `users_id`),
  INDEX `fk_tasks_asignee_tasks1_idx` (`tasks_id` ASC),
  INDEX `fk_tasks_asignee_users1_idx` (`users_id` ASC),
  UNIQUE INDEX `asignee_UNIQUE` (`tasks_id` ASC, `users_id` ASC),
  CONSTRAINT `fk_tasks_asignee_tasks1`
    FOREIGN KEY (`tasks_id`)
    REFERENCES `organizer`.`tasks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_asignee_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `organizer`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `organizer`.`tasks_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `organizer`.`tasks_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tasks_id` INT NOT NULL,
  `users_id` INT NOT NULL,
  `text` TEXT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` TIMESTAMP NULL,
  PRIMARY KEY (`id`, `tasks_id`, `users_id`),
  INDEX `fk_tasks_comments_tasks1_idx` (`tasks_id` ASC),
  INDEX `fk_tasks_comments_users1_idx` (`users_id` ASC),
  CONSTRAINT `fk_tasks_comments_tasks1`
    FOREIGN KEY (`tasks_id`)
    REFERENCES `organizer`.`tasks` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tasks_comments_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `organizer`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
