-- 1️⃣ Roles
INSERT INTO roles (name, created_at) VALUES
('admin', NOW()),
('recruiter', NOW()),
('candidate', NOW());

-- 2️⃣ Permissions
INSERT INTO permissions (name, module, created_at) VALUES
('manage_users', 'admin', NOW()),
('manage_jobs', 'recruiter', NOW()),
('apply_jobs', 'candidate', NOW()),
('schedule_interviews', 'recruiter', NOW());

-- 3️⃣ Role-Permissions mapping
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1),
(2, 2),
(2, 4),
(3, 3);

-- 4️⃣ Users
INSERT INTO users (email, password_hash, first_name, last_name, role_id, status, created_at) VALUES
('admin@example.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Admin', 'User', 1, 'active', NOW()),
('recruiter@fpt.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Lan', 'Nguyen', 2, 'active', NOW()),
('recruiter@vng.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Hung', 'Pham', 2, 'active', NOW()),
('candidate1@gmail.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Huy', 'Tran', 3, 'active', NOW()),
('candidate2@gmail.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Hoa', 'Pham', 3, 'active', NOW()),
('candidate3@gmail.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Khanh', 'Le', 3, 'active', NOW()),
('candidate4@gmail.com', '$2b$10$9Okz9yx8u8W9IVbUWTceTejERisork6lysOS46zPeoFXl3yH6oSaS', 'Tuan', 'Do', 3, 'active', NOW());

-- 5️⃣ Companies
INSERT INTO companies (name, logo_url, description, website, created_at) VALUES
('FPT Software', 'logo_fpt.png', 'Leading software company in Vietnam', 'https://fpt.com.vn', NOW()),
('VNG Corporation', 'logo_vng.png', 'Technology and gaming company', 'https://vng.com.vn', NOW());

-- 6️⃣ Company Recruiters
INSERT INTO company_recruiters (company_id, recruiter_id, created_at) VALUES
(1, 2, NOW()),
(2, 3, NOW());

-- 7️⃣ Categories
INSERT INTO categories (name, slug, created_at) VALUES
('Software Development', 'software-dev', NOW()),
('Marketing', 'marketing', NOW()),
('Data Science', 'data-science', NOW());

-- 8️⃣ Job Postings
INSERT INTO job_postings (company_id, category_id, title, description, requirements, salary_min, salary_max, location, job_type, experience_level, number_of_positions, status, deadline, required_skills, created_at)
VALUES
(1, 1, 'Java Backend Developer', 'Develop backend services using Java and Spring Boot.', '3+ years Java, REST API, MySQL', 1200, 2000, 'Hanoi', 'full-time', 'mid', 2, 'published', '2025-12-30', 'Java,Spring Boot,MySQL', NOW()),
(1, 1, 'Frontend Developer', 'ReactJS/NextJS developer for e-commerce platform.', '2+ years ReactJS, NextJS, Tailwind', 1000, 1800, 'HCMC', 'full-time', 'mid', 1, 'published', '2025-12-15', 'ReactJS,NextJS', NOW()),
(2, 3, 'Data Analyst', 'Work with big data systems and analytics dashboards.', 'SQL, PowerBI, Statistics', 900, 1500, 'HCMC', 'full-time', 'entry', 3, 'published', '2025-11-30', 'SQL,PowerBI', NOW());

-- 9️⃣ Candidate Profiles
INSERT INTO candidate_profiles (user_id, headline, summary, total_experience, profile_visibility, is_open_to_work, created_at)
VALUES
(4, 'Java Developer', 'Backend dev specialized in REST APIs', 3, 'public', TRUE, NOW()),
(5, 'Frontend Dev', 'ReactJS and UI enthusiast', 2, 'public', TRUE, NOW()),
(6, 'Data Analyst', 'Data visualization and dashboard creation', 1, 'public', TRUE, NOW()),
(7, 'Fullstack Intern', 'Learning NodeJS and React', 0, 'public', TRUE, NOW());

-- 🔟 CV Files
INSERT INTO cv_files (candidate_id, file_url, approval_status, created_at)
VALUES
(1, 'cv_huytran.pdf', 'approved', NOW()),
(2, 'cv_hoapham.pdf', 'approved', NOW()),
(3, 'cv_khanhle.pdf', 'pending', NOW()),
(4, 'cv_tuando.pdf', 'approved', NOW());

-- 11️⃣ Applications (✅ status theo ENUM mới)
INSERT INTO applications (candidate_id, job_posting_id, cv_id, cover_letter, status, applied_at)
VALUES
(1, 1, 1, 'Excited to join your Java team.', 'shortlisted', NOW()),
(2, 2, 2, 'Frontend developer passionate about UX.', 'reviewed', NOW()),
(3, 3, 3, 'Love working with data and insights.', 'submitted', NOW()),
(4, 1, 4, 'Looking for a backend internship.', 'reviewed', NOW()),
(1, 2, 1, 'Would like to switch to frontend.', 'submitted', NOW());

-- 12️⃣ Interviews (✅ status theo ENUM mới)
INSERT INTO interviews (application_id, interviewer_id, scheduled_date, interview_type, status, feedback, rating, created_at)
VALUES
(1, 2, '2025-11-10 10:00:00', 'in-person', 'completed', 'Good communication, solid technical base.', 8, NOW()),
(1, 2, '2025-11-12 14:00:00', 'video', 'scheduled', NULL, NULL, NOW()),
(2, 3, '2025-11-05 09:00:00', 'phone', 'completed', 'Strong frontend fundamentals.', 9, NOW()),
(3, 3, '2025-11-07 15:30:00', 'video', 'scheduled', NULL, NULL, NOW()),
(4, 2, '2025-11-08 10:00:00', 'in-person', 'completed', 'Good intern potential.', 7, NOW()),
(4, 2, '2025-11-09 14:30:00', 'video', 'cancelled', 'Rescheduled due to candidate request.', NULL, NOW()),
(5, 3, '2025-11-11 11:00:00', 'phone', 'scheduled', NULL, NULL, NOW());

-- 13️⃣ Skills
INSERT INTO skills (name, created_at) VALUES
('Java', NOW()),
('Spring Boot', NOW()),
('ReactJS', NOW()),
('NextJS', NOW()),
('SQL', NOW()),
('PowerBI', NOW()),
('NodeJS', NOW());

-- 14️⃣ User Skills
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(4, 1, 'advanced'),
(4, 2, 'intermediate'),
(5, 3, 'advanced'),
(5, 4, 'intermediate'),
(6, 5, 'advanced'),
(6, 6, 'beginner'),
(7, 7, 'beginner');

-- 15️⃣ Saved Jobs
INSERT INTO saved_jobs (user_id, job_posting_id, saved_at) VALUES
(4, 1, NOW()),
(5, 2, NOW()),
(6, 3, NOW());

-- 16️⃣ User Follows
INSERT INTO user_follows (follower_id, followed_id, created_at) VALUES
(4, 5, NOW()),
(5, 4, NOW()),
(6, 7, NOW());

-- 17️⃣ Company Follows
INSERT INTO company_follows (user_id, company_id, created_at) VALUES
(4, 1, NOW()),
(5, 2, NOW()),
(6, 1, NOW());

-- 18️⃣ Notifications
INSERT INTO notifications (user_id, type, message, is_read, created_at) VALUES
(4, 'interview', 'Your interview has been scheduled.', FALSE, NOW()),
(2, 'application', 'New application received.', TRUE, NOW()),
(3, 'interview', 'Interview completed for candidate Huy.', TRUE, NOW());

-- 19️⃣ Messages
INSERT INTO messages (sender_id, recipient_id, body, is_read, created_at) VALUES
(2, 4, 'Hello Huy, please confirm interview time.', FALSE, NOW()),
(4, 2, 'Confirmed for 10AM tomorrow.', TRUE, NOW()),
(3, 6, 'We received your application, Khanh.', FALSE, NOW());
