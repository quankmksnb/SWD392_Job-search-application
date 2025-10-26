CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `role_id` int,
  `status` varchar(255) DEFAULT 'active',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `password_resets` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `token` varchar(255) UNIQUE NOT NULL,
  `expires_at` timestamp NOT NULL
);

CREATE TABLE `roles` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `permissions` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `module` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `role_permissions` (
  `role_id` integer NOT NULL,
  `permission_id` integer NOT NULL
);

CREATE TABLE `categories` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `slug` varchar(255) UNIQUE,
  `created_at` timestamp
);

CREATE TABLE `companies` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `logo_url` varchar(255),
  `description` text,
  `website` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `company_recruiters` (
  `id` integer PRIMARY KEY,
  `company_id` integer NOT NULL,
  `recruiter_id` integer NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `job_postings` (
  `id` integer PRIMARY KEY,
  `company_id` integer NOT NULL,
  `category_id` integer NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `requirements` text,
  `salary_min` decimal,
  `salary_max` decimal,
  `location` varchar(255) NOT NULL,
  `job_type` varchar(255) COMMENT 'full-time, part-time, contract, internship',
  `experience_level` varchar(255) COMMENT 'entry, mid, senior',
  `number_of_positions` integer DEFAULT 1,
  `status` varchar(255) DEFAULT 'published',
  `deadline` date,
  `required_skills` text COMMENT 'Comma-separated list or JSON array of skill names',
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `candidate_profiles` (
  `id` integer PRIMARY KEY,
  `user_id` integer UNIQUE NOT NULL,
  `headline` varchar(255),
  `summary` text,
  `total_experience` integer,
  `profile_visibility` varchar(255) DEFAULT 'public',
  `is_open_to_work` boolean DEFAULT false,
  `created_at` timestamp
);

CREATE TABLE `cv_files` (
  `id` integer PRIMARY KEY,
  `candidate_id` integer NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `approval_status` varchar(255) DEFAULT 'pending',
  `created_at` timestamp
);

CREATE TABLE `applications` (
  `id` integer PRIMARY KEY,
  `candidate_id` integer NOT NULL,
  `job_posting_id` integer NOT NULL,
  `cv_id` integer,
  `cover_letter` text,
  `status` varchar(255) DEFAULT 'submitted' COMMENT 'submitted, reviewed, shortlisted, rejected, accepted, withdrawn',
  `applied_at` timestamp
);

CREATE TABLE `interviews` (
  `id` integer PRIMARY KEY,
  `application_id` integer NOT NULL,
  `interviewer_id` integer NOT NULL,
  `scheduled_date` timestamp NOT NULL,
  `interview_type` varchar(255) COMMENT 'phone, video, in-person',
  `status` varchar(255) DEFAULT 'scheduled',
  `feedback` text,
  `rating` integer,
  `created_at` timestamp
);

CREATE TABLE `skills` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) UNIQUE NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `user_skills` (
  `user_id` integer NOT NULL,
  `skill_id` integer NOT NULL,
  `proficiency_level` varchar(255) COMMENT 'beginner, intermediate, advanced'
);

CREATE TABLE `saved_jobs` (
  `user_id` integer NOT NULL,
  `job_posting_id` integer NOT NULL,
  `saved_at` timestamp
);

CREATE TABLE `user_follows` (
  `follower_id` integer NOT NULL,
  `followed_id` integer NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `company_follows` (
  `user_id` integer NOT NULL,
  `company_id` integer NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `notifications` (
  `id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `type` varchar(255),
  `message` text,
  `is_read` boolean DEFAULT false,
  `created_at` timestamp
);

CREATE TABLE `messages` (
  `id` integer PRIMARY KEY,
  `sender_id` integer NOT NULL,
  `recipient_id` integer NOT NULL,
  `body` text NOT NULL,
  `is_read` boolean DEFAULT false,
  `created_at` timestamp
);

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
