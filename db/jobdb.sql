-- create database jobdb;
-- use jobdb;
CREATE TABLE
  `users` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255),
    `last_name` VARCHAR(255),
    `role_id` INT,
    `status` VARCHAR(255) DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  `password_resets` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` VARCHAR(255) UNIQUE NOT NULL,
    `expires_at` TIMESTAMP NOT NULL
  );

CREATE TABLE
  `roles` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `permissions` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `module` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `role_permissions` (
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL
  );

CREATE TABLE
  `categories` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `slug` VARCHAR(255) UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `companies` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `logo_url` VARCHAR(255),
    `description` TEXT,
    `website` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `company_recruiters` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `recruiter_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `job_postings` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `company_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `requirements` TEXT,
    `salary_min` DECIMAL(10, 2),
    `salary_max` DECIMAL(10, 2),
    `location` VARCHAR(255) NOT NULL,
    `job_type` VARCHAR(255) COMMENT 'full-time, part-time, contract, internship',
    `experience_level` VARCHAR(255) COMMENT 'entry, mid, senior',
    `number_of_positions` INTEGER DEFAULT 1,
    `status` VARCHAR(255) DEFAULT 'published',
    `deadline` DATE,
    `required_skills` TEXT COMMENT 'Comma-separated list or JSON array of skill names',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  `candidate_profiles` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER UNIQUE NOT NULL,
    `headline` VARCHAR(255),
    `summary` TEXT,
    `total_experience` INTEGER,
    `profile_visibility` VARCHAR(255) DEFAULT 'public',
    `is_open_to_work` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `cv_files` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `candidate_id` INTEGER NOT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `approval_status` VARCHAR(255) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `applications` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `candidate_id` INTEGER NOT NULL,
    `job_posting_id` INTEGER NOT NULL,
    `cv_id` INTEGER,
    `cover_letter` TEXT,
    `status` ENUM (
      'submitted',
      'reviewed',
      'shortlisted',
      'rejected',
      'accepted'
    ) DEFAULT 'submitted',
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `interviews` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `application_id` INTEGER NOT NULL,
    `interviewer_id` INTEGER NOT NULL,
    `scheduled_date` TIMESTAMP NOT NULL,
    `interview_type` VARCHAR(255) COMMENT 'phone, video, in-person',
    `status` ENUM ('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    `feedback` TEXT,
    `rating` INTEGER,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `skills` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) UNIQUE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `user_skills` (
    `user_id` INTEGER NOT NULL,
    `skill_id` INTEGER NOT NULL,
    `proficiency_level` VARCHAR(255) COMMENT 'beginner, intermediate, advanced'
  );

CREATE TABLE
  `saved_jobs` (
    `user_id` INTEGER NOT NULL,
    `job_posting_id` INTEGER NOT NULL,
    `saved_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `user_follows` (
    `follower_id` INTEGER NOT NULL,
    `followed_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `company_follows` (
    `user_id` INTEGER NOT NULL,
    `company_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `notifications` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(255),
    `message` TEXT,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  `messages` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
    `sender_id` INTEGER NOT NULL,
    `recipient_id` INTEGER NOT NULL,
    `body` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- 🔗 RÀNG BUỘC NGOẠI KHÓA
ALTER TABLE `password_resets` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `role_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `role_permissions` ADD FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);

ALTER TABLE `company_recruiters` ADD FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `company_recruiters` ADD FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`);

ALTER TABLE `job_postings` ADD FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `job_postings` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

ALTER TABLE `candidate_profiles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `cv_files` ADD FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`);

ALTER TABLE `applications` ADD FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`);

ALTER TABLE `applications` ADD FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`);

ALTER TABLE `applications` ADD FOREIGN KEY (`cv_id`) REFERENCES `cv_files` (`id`);

ALTER TABLE `interviews` ADD FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`);

ALTER TABLE `interviews` ADD FOREIGN KEY (`interviewer_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_skills` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_skills` ADD FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);

ALTER TABLE `saved_jobs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `saved_jobs` ADD FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`);

ALTER TABLE `user_follows` ADD FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_follows` ADD FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`);

ALTER TABLE `company_follows` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `company_follows` ADD FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);