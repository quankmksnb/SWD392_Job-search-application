-- 1️⃣ Roles
INSERT INTO roles (id, name, created_at) VALUES
(1, 'admin', CURRENT_TIMESTAMP),
(2, 'recruiter', CURRENT_TIMESTAMP),
(3, 'candidate', CURRENT_TIMESTAMP);

-- 2️⃣ Users
INSERT INTO users (id, email, password_hash, first_name, last_name, role_id, status, created_at) VALUES
(1, 'admin@example.com', 'hash123', 'Admin', 'User', 1, 'active', CURRENT_TIMESTAMP),
(2, 'recruiter@fpt.com', 'hash456', 'Lan', 'Nguyen', 2, 'active', CURRENT_TIMESTAMP),
(3, 'candidate1@gmail.com', 'hash789', 'Huy', 'Tran', 3, 'active', CURRENT_TIMESTAMP),
(4, 'candidate2@gmail.com', 'hash888', 'Hoa', 'Pham', 3, 'active', CURRENT_TIMESTAMP);

-- 3️⃣ Companies
INSERT INTO companies (id, name, logo_url, description, website, created_at) VALUES
(1, 'FPT Software', 'logo_fpt.png', 'Leading software company in Vietnam', 'https://fptsoftware.com', CURRENT_TIMESTAMP),
(2, 'VNG Corporation', 'logo_vng.png', 'Technology and game development company', 'https://vng.com.vn', CURRENT_TIMESTAMP);

-- 4️⃣ Company Recruiters
INSERT INTO company_recruiters (id, company_id, recruiter_id, created_at) VALUES
(1, 1, 2, CURRENT_TIMESTAMP);

-- 5️⃣ Categories
INSERT INTO categories (id, name, slug, created_at) VALUES
(1, 'Software Engineering', 'software-engineering', CURRENT_TIMESTAMP),
(2, 'Design', 'design', CURRENT_TIMESTAMP);

-- 6️⃣ Job Postings
-- 6️⃣ Job Postings (đã thêm required_skills)
INSERT INTO job_postings (
  id, company_id, category_id, title, description, requirements, salary_min, salary_max, 
  location, job_type, experience_level, number_of_positions, status, deadline, required_skills, created_at
) VALUES
(1, 1, 1, 'Java Backend Developer', 
 'Develop and maintain backend services', 
 'Experience with Java, Spring Boot, and SQL', 
 1000, 2000, 'Hanoi', 'full-time', 'mid', 2, 'published', '2025-12-31', 
 'Java, Spring Boot, SQL', CURRENT_TIMESTAMP),

(2, 2, 2, 'UI/UX Designer', 
 'Design user interfaces for mobile apps', 
 'Experience with Figma and Adobe XD', 
 800, 1500, 'HCMC', 'full-time', 'entry', 1, 'published', '2025-12-31', 
 'Figma, Adobe XD, UI Design', CURRENT_TIMESTAMP);


-- 7️⃣ Candidate Profiles
INSERT INTO candidate_profiles (id, user_id, headline, summary, total_experience, profile_visibility, is_open_to_work, created_at) VALUES
(1, 3, 'Backend Developer', '3 years of experience in Java & Spring Boot', 3, 'public', true, CURRENT_TIMESTAMP),
(2, 4, 'UI Designer', 'Creative designer passionate about mobile apps', 1, 'public', true, CURRENT_TIMESTAMP);

-- 8️⃣ CV Files
INSERT INTO cv_files (id, candidate_id, file_url, approval_status, created_at) VALUES
(1, 1, 'cv_huy.pdf', 'approved', CURRENT_TIMESTAMP),
(2, 2, 'cv_hoa.pdf', 'pending', CURRENT_TIMESTAMP);

-- 9️⃣ Applications
INSERT INTO applications (id, candidate_id, job_posting_id, cv_id, cover_letter, status, applied_at) VALUES
(1, 1, 1, 1, 'I am excited to apply for this Java Developer role.', 'submitted', CURRENT_TIMESTAMP),
(2, 2, 2, 2, 'Looking forward to joining your design team.', 'submitted', CURRENT_TIMESTAMP);

-- 🔟 Interviews
INSERT INTO interviews (id, application_id, interviewer_id, scheduled_date, interview_type, status, feedback, rating, created_at) VALUES
(1, 1, 2, '2025-11-01 10:00:00', 'video', 'scheduled', NULL, NULL, CURRENT_TIMESTAMP);

-- 1️⃣1️⃣ Skills
INSERT INTO skills (id, name, created_at) VALUES
(1, 'Java', CURRENT_TIMESTAMP),
(2, 'Spring Boot', CURRENT_TIMESTAMP),
(3, 'Figma', CURRENT_TIMESTAMP),
(4, 'UI Design', CURRENT_TIMESTAMP);

-- 1️⃣2️⃣ User Skills
INSERT INTO user_skills (user_id, skill_id, proficiency_level) VALUES
(3, 1, 'advanced'),
(3, 2, 'intermediate'),
(4, 3, 'intermediate'),
(4, 4, 'advanced');

-- 1️⃣3️⃣ Saved Jobs
INSERT INTO saved_jobs (user_id, job_posting_id, saved_at) VALUES
(3, 2, CURRENT_TIMESTAMP);

-- 1️⃣4️⃣ Follows
INSERT INTO user_follows (follower_id, followed_id, created_at) VALUES
(3, 2, CURRENT_TIMESTAMP);

INSERT INTO company_follows (user_id, company_id, created_at) VALUES
(3, 1, CURRENT_TIMESTAMP);

-- 1️⃣5️⃣ Notifications
INSERT INTO notifications (id, user_id, type, message, is_read, created_at) VALUES
(1, 3, 'application_update', 'Your application has been received!', false, CURRENT_TIMESTAMP);

-- 1️⃣6️⃣ Messages
INSERT INTO messages (id, sender_id, recipient_id, body, is_read, created_at) VALUES
(1, 2, 3, 'Hi Huy, we would like to schedule an interview.', false, CURRENT_TIMESTAMP);
