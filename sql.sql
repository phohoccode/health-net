CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `full_name` varchar(255),
  `email` varchar(255) UNIQUE,
  `phone` varchar(255) UNIQUE,
  `password_hash` varchar(255),
  `role` varchar(255),
  `status` varchar(255),
  `avatar_url` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `health_profiles` (
  `user_id` integer PRIMARY KEY,
  `date_of_birth` date,
  `gender` varchar(255),
  `blood_type` varchar(255),
  `height_cm` float,
  `weight_kg` float,
  `allergies` text,
  `medical_history` text
);

CREATE TABLE `specialties` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `icon_url` varchar(255)
);

CREATE TABLE `doctors` (
  `user_id` integer PRIMARY KEY,
  `specialty_id` integer,
  `hospital_name` varchar(255),
  `experience_years` integer,
  `fee_per_slot` decimal,
  `is_verified` boolean,
  `is_active` boolean,
  `bio` text
);

CREATE TABLE `appointments` (
  `id` integer PRIMARY KEY,
  `patient_id` integer,
  `doctor_id` integer,
  `start_time` datetime,
  `end_time` datetime,
  `type` varchar(255),
  `status` varchar(255),
  `reason` text,
  `created_at` timestamp
);

CREATE TABLE `medical_records` (
  `id` integer PRIMARY KEY,
  `appointment_id` integer,
  `doctor_id` integer,
  `diagnosis` text,
  `treatment_plan` text,
  `created_at` timestamp
);

CREATE TABLE `medicines` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `brand` varchar(255),
  `category` varchar(255),
  `unit` varchar(255),
  `dosage_info` text,
  `side_effects` text
);

CREATE TABLE `prescription_items` (
  `id` integer PRIMARY KEY,
  `medical_record_id` integer,
  `medicine_id` integer,
  `dosage_instruction` varchar(255),
  `quantity` integer,
  `duration_days` integer
);

CREATE TABLE `medication_reminders` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `medicine_id` integer,
  `time_reminder` time,
  `frequency_per_day` integer,
  `start_date` date,
  `end_date` date,
  `is_active` boolean
);

CREATE TABLE `chat_sessions` (
  `id` integer PRIMARY KEY,
  `patient_id` integer,
  `doctor_id` integer,
  `is_ai_chat` boolean,
  `created_at` timestamp
);

CREATE TABLE `messages` (
  `id` integer PRIMARY KEY,
  `session_id` integer,
  `sender_type` varchar(255),
  `sender_id` integer,
  `content` text,
  `file_url` varchar(255),
  `created_at` timestamp
);

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `health_profiles` (`user_id`);

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `doctors` (`user_id`);

ALTER TABLE `doctors` ADD FOREIGN KEY (`specialty_id`) REFERENCES `specialties` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`user_id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`id`) REFERENCES `medical_records` (`appointment_id`);

ALTER TABLE `medical_records` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`user_id`);

ALTER TABLE `prescription_items` ADD FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records` (`id`);

ALTER TABLE `prescription_items` ADD FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`);

ALTER TABLE `medication_reminders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `medication_reminders` ADD FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`);

ALTER TABLE `chat_sessions` ADD FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`);

ALTER TABLE `chat_sessions` ADD FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`user_id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`);
