# Database Schema Documentation

## Table of Contents

1. [Enums](#enums)
2. [Users & Authentication](#users--authentication)
3. [Health & Medical](#health--medical)
4. [Doctors & Specialties](#doctors--specialties)
5. [Appointments](#appointments)
6. [Medical Records & Prescriptions](#medical-records--prescriptions)
7. [Medications & Reminders](#medications--reminders)
8. [Chat & Messaging](#chat--messaging)

---

## Enums

### `user_role`

Định nghĩa vai trò của người dùng trong hệ thống

- **PATIENT**: Bệnh nhân
- **DOCTOR**: Bác sĩ
- **ADMIN**: Quản trị viên

### `user_status`

Trạng thái tài khoản người dùng

- **ACTIVE**: Đang hoạt động
- **INACTIVE**: Tạm ngưng
- **BANNED**: Bị cấm

### `gender`

Giới tính

- **MALE**: Nam
- **FEMALE**: Nữ
- **OTHER**: Khác

### `appointment_status`

Trạng thái của lịch hẹn

- **PENDING**: Chờ xác nhận
- **CONFIRMED**: Đã xác nhận
- **CANCELLED**: Đã hủy
- **COMPLETED**: Đã hoàn thành
- **NO_SHOW**: Không đến (bệnh nhân không xuất hiện)

### `appointment_type`

Loại hình lịch hẹn

- **ONLINE**: Khám trực tuyến (video call, chat)
- **OFFLINE**: Khám trực tiếp tại phòng khám

### `sender_type`

Loại người gửi tin nhắn

- **USER**: Bệnh nhân
- **DOCTOR**: Bác sĩ
- **AI**: Chatbot AI

---

## Users & Authentication

### Model `users`

Bảng lưu thông tin tài khoản người dùng (bệnh nhân, bác sĩ, admin)

| Trường       | Kiểu             | Mô tả                                           |
| ------------ | ---------------- | ----------------------------------------------- |
| `id`         | Int (PK)         | ID người dùng, tự động tăng                     |
| `full_name`  | String?          | Họ và tên đầy đủ (tối đa 255 ký tự)             |
| `email`      | String? (Unique) | Email đăng nhập, duy nhất trong hệ thống        |
| `phone`      | String? (Unique) | Số điện thoại, duy nhất (tối đa 20 ký tự)       |
| `password`   | String?          | Mật khẩu đã mã hóa (hash)                       |
| `role`       | user_role        | Vai trò: PATIENT/DOCTOR/ADMIN, mặc định PATIENT |
| `status`     | user_status      | Trạng thái tài khoản, mặc định ACTIVE           |
| `avatar_url` | String?          | URL ảnh đại diện (tối đa 500 ký tự)             |
| `created_at` | DateTime         | Thời gian tạo tài khoản                         |
| `updated_at` | DateTime         | Thời gian cập nhật lần cuối                     |
| `deleted_at` | DateTime?        | Thời gian xóa (soft delete) - null nếu chưa xóa |

**Relations:**

- `health_profile`: Thông tin sức khỏe (1-1 với health_profiles)
- `doctor`: Thông tin bác sĩ (1-1 với doctors nếu role = DOCTOR)
- `appointments_as_patient`: Danh sách lịch hẹn của bệnh nhân
- `medication_reminders`: Danh sách nhắc nhở uống thuốc
- `chat_sessions_as_patient`: Danh sách phiên chat

**Indexes:**

- email, phone, role, status (để tìm kiếm nhanh)

---

## Health & Medical

### Model `health_profiles`

Hồ sơ sức khỏe chi tiết của bệnh nhân

| Trường            | Kiểu           | Mô tả                               |
| ----------------- | -------------- | ----------------------------------- |
| `user_id`         | Int (PK, FK)   | ID người dùng, khóa ngoại đến users |
| `date_of_birth`   | DateTime?      | Ngày sinh                           |
| `gender`          | gender?        | Giới tính: MALE/FEMALE/OTHER        |
| `blood_type`      | String?        | Nhóm máu (VD: A+, O-, AB+...)       |
| `height_cm`       | Float?         | Chiều cao (cm)                      |
| `weight_kg`       | Float?         | Cân nặng (kg)                       |
| `allergies`       | String? (Text) | Danh sách dị ứng (có thể dài)       |
| `medical_history` | String? (Text) | Tiền sử bệnh án (có thể rất dài)    |
| `created_at`      | DateTime       | Thời gian tạo hồ sơ                 |
| `updated_at`      | DateTime       | Thời gian cập nhật                  |

**Relations:**

- `user`: Liên kết với users (1-1), tự động xóa khi user bị xóa

---

## Doctors & Specialties

### Model `specialties`

Danh mục chuyên khoa y tế

| Trường       | Kiểu            | Mô tả                                                   |
| ------------ | --------------- | ------------------------------------------------------- |
| `id`         | Int (PK)        | ID chuyên khoa                                          |
| `name`       | String (Unique) | Tên chuyên khoa (VD: Nội khoa, Ngoại khoa, Tim mạch...) |
| `icon_url`   | String?         | URL icon đại diện cho chuyên khoa                       |
| `created_at` | DateTime        | Thời gian tạo                                           |
| `updated_at` | DateTime        | Thời gian cập nhật                                      |

**Relations:**

- `doctors`: Danh sách bác sĩ thuộc chuyên khoa này

**Indexes:**

- name (tìm kiếm theo tên)

### Model `doctors`

Thông tin chi tiết về bác sĩ (bổ sung cho users có role=DOCTOR)

| Trường             | Kiểu           | Mô tả                                                  |
| ------------------ | -------------- | ------------------------------------------------------ |
| `user_id`          | Int (PK, FK)   | ID người dùng, khóa ngoại đến users                    |
| `specialty_id`     | Int? (FK)      | ID chuyên khoa (tham chiếu specialties)                |
| `hospital_name`    | String?        | Tên bệnh viện/phòng khám đang làm việc                 |
| `experience_years` | Int?           | Số năm kinh nghiệm                                     |
| `fee_per_slot`     | Decimal(10,2)  | Phí khám 1 lần (VD: 200000.00 VND)                     |
| `is_verified`      | Boolean        | Đã xác minh chứng chỉ hành nghề chưa? (mặc định false) |
| `is_active`        | Boolean        | Đang nhận bệnh không? (mặc định true)                  |
| `bio`              | String? (Text) | Tiểu sử, giới thiệu bản thân                           |
| `created_at`       | DateTime       | Thời gian tạo                                          |
| `updated_at`       | DateTime       | Thời gian cập nhật                                     |

**Relations:**

- `user`: Liên kết với users (1-1)
- `specialty`: Chuyên khoa của bác sĩ
- `appointments`: Danh sách lịch hẹn với bác sĩ
- `medical_records`: Danh sách hồ sơ bệnh án đã tạo
- `chat_sessions`: Danh sách phiên chat với bệnh nhân

**Indexes:**

- specialty_id, is_verified, is_active (để lọc bác sĩ)

---

## Appointments

### Model `appointments`

Lịch hẹn khám bệnh

| Trường       | Kiểu               | Mô tả                                                     |
| ------------ | ------------------ | --------------------------------------------------------- |
| `id`         | Int (PK)           | ID lịch hẹn                                               |
| `patient_id` | Int (FK)           | ID bệnh nhân (tham chiếu users)                           |
| `doctor_id`  | Int (FK)           | ID bác sĩ (tham chiếu doctors.user_id)                    |
| `start_time` | DateTime           | Thời gian bắt đầu                                         |
| `end_time`   | DateTime           | Thời gian kết thúc                                        |
| `type`       | appointment_type   | Loại: ONLINE/OFFLINE                                      |
| `status`     | appointment_status | Trạng thái: PENDING/CONFIRMED/CANCELLED/COMPLETED/NO_SHOW |
| `reason`     | String? (Text)     | Lý do khám (triệu chứng, vấn đề sức khỏe)                 |
| `notes`      | String? (Text)     | Ghi chú thêm                                              |
| `timezone`   | String?            | Múi giờ (mặc định "Asia/Ho_Chi_Minh")                     |
| `created_at` | DateTime           | Thời gian đặt lịch                                        |
| `updated_at` | DateTime           | Thời gian cập nhật                                        |
| `deleted_at` | DateTime?          | Thời gian xóa (soft delete)                               |

**Relations:**

- `patient`: Bệnh nhân đặt lịch (users)
- `doctor`: Bác sĩ được đặt lịch (doctors)
- `medical_record`: Hồ sơ bệnh án sau khi khám (1-1)

**Indexes:**

- patient_id, doctor_id, start_time, status, type, created_at

**Use Cases:**

- Đặt lịch khám
- Xem lịch sử khám bệnh
- Quản lý lịch làm việc của bác sĩ
- Thống kê số lượng bệnh nhân

---

## Medical Records & Prescriptions

### Model `medical_records`

Hồ sơ bệnh án sau mỗi lần khám

| Trường           | Kiểu             | Mô tả                                   |
| ---------------- | ---------------- | --------------------------------------- |
| `id`             | Int (PK)         | ID hồ sơ bệnh án                        |
| `appointment_id` | Int (FK, Unique) | ID lịch hẹn (1 lịch hẹn chỉ có 1 hồ sơ) |
| `doctor_id`      | Int (FK)         | ID bác sĩ tạo hồ sơ                     |
| `diagnosis`      | String? (Text)   | Chẩn đoán bệnh                          |
| `treatment_plan` | String? (Text)   | Kế hoạch điều trị                       |
| `notes`          | String? (Text)   | Ghi chú thêm của bác sĩ                 |
| `created_at`     | DateTime         | Thời gian tạo                           |
| `updated_at`     | DateTime         | Thời gian cập nhật                      |

**Relations:**

- `appointment`: Lịch hẹn tương ứng
- `doctor`: Bác sĩ tạo hồ sơ
- `prescription_items`: Danh sách thuốc được kê đơn

**Indexes:**

- doctor_id, created_at

### Model `medicines`

Danh mục thuốc trong hệ thống

| Trường         | Kiểu           | Mô tả                                        |
| -------------- | -------------- | -------------------------------------------- |
| `id`           | Int (PK)       | ID thuốc                                     |
| `name`         | String         | Tên thuốc (hoạt chất)                        |
| `brand`        | String?        | Tên thương hiệu                              |
| `category`     | String?        | Phân loại (kháng sinh, giảm đau, vitamin...) |
| `unit`         | String?        | Đơn vị (viên, ống, chai...)                  |
| `dosage_info`  | String? (Text) | Thông tin liều lượng                         |
| `side_effects` | String? (Text) | Tác dụng phụ                                 |
| `is_active`    | Boolean        | Còn sử dụng không? (mặc định true)           |
| `created_at`   | DateTime       | Thời gian tạo                                |
| `updated_at`   | DateTime       | Thời gian cập nhật                           |

**Relations:**

- `prescription_items`: Các đơn thuốc có thuốc này
- `medication_reminders`: Các nhắc nhở uống thuốc này

**Indexes:**

- name, category, is_active

### Model `prescription_items`

Chi tiết từng thuốc trong đơn thuốc

| Trường               | Kiểu           | Mô tả                                                           |
| -------------------- | -------------- | --------------------------------------------------------------- |
| `id`                 | Int (PK)       | ID mục đơn thuốc                                                |
| `medical_record_id`  | Int (FK)       | ID hồ sơ bệnh án                                                |
| `medicine_id`        | Int (FK)       | ID thuốc                                                        |
| `dosage_instruction` | String? (Text) | Hướng dẫn uống thuốc (VD: "Uống 2 viên/lần, ngày 3 lần sau ăn") |
| `quantity`           | Int            | Số lượng thuốc kê đơn                                           |
| `duration_days`      | Int            | Số ngày uống thuốc                                              |
| `created_at`         | DateTime       | Thời gian tạo                                                   |
| `updated_at`         | DateTime       | Thời gian cập nhật                                              |

**Relations:**

- `medical_record`: Hồ sơ bệnh án chứa đơn thuốc này
- `medicine`: Thông tin chi tiết về thuốc

**Indexes:**

- medical_record_id, medicine_id

---

## Medications & Reminders

### Model `medication_reminders`

Nhắc nhở uống thuốc cho bệnh nhân

| Trường              | Kiểu           | Mô tả                                     |
| ------------------- | -------------- | ----------------------------------------- |
| `id`                | Int (PK)       | ID nhắc nhở                               |
| `user_id`           | Int (FK)       | ID bệnh nhân                              |
| `medicine_id`       | Int (FK)       | ID thuốc cần uống                         |
| `time_reminder`     | DateTime       | Thời gian nhắc nhở                        |
| `frequency_per_day` | Int            | Số lần uống mỗi ngày (VD: 3 = ngày 3 lần) |
| `start_date`        | DateTime       | Ngày bắt đầu uống thuốc                   |
| `end_date`          | DateTime       | Ngày kết thúc uống thuốc                  |
| `is_active`         | Boolean        | Còn hiệu lực không? (mặc định true)       |
| `notes`             | String? (Text) | Ghi chú thêm                              |
| `created_at`        | DateTime       | Thời gian tạo                             |
| `updated_at`        | DateTime       | Thời gian cập nhật                        |

**Relations:**

- `user`: Bệnh nhân cần nhắc nhở
- `medicine`: Thuốc cần uống

**Indexes:**

- user_id, medicine_id, time_reminder, is_active

**Use Cases:**

- Gửi notification nhắc bệnh nhân uống thuốc
- Theo dõi lịch sử tuân thủ điều trị
- Quản lý lịch uống thuốc dài hạn

---

## Chat & Messaging

### Model `chat_sessions`

Phiên chat giữa bệnh nhân và bác sĩ/AI

| Trường       | Kiểu      | Mô tả                                           |
| ------------ | --------- | ----------------------------------------------- |
| `id`         | Int (PK)  | ID phiên chat                                   |
| `patient_id` | Int (FK)  | ID bệnh nhân                                    |
| `doctor_id`  | Int? (FK) | ID bác sĩ (null nếu chat với AI)                |
| `is_ai_chat` | Boolean   | Chat với AI không? (mặc định false)             |
| `title`      | String?   | Tiêu đề phiên chat (VD: "Tư vấn đau đầu")       |
| `is_active`  | Boolean   | Phiên chat còn hoạt động không? (mặc định true) |
| `created_at` | DateTime  | Thời gian bắt đầu chat                          |
| `updated_at` | DateTime  | Thời gian cập nhật (tin nhắn mới nhất)          |
| `deleted_at` | DateTime? | Thời gian xóa (soft delete)                     |

**Relations:**

- `patient`: Bệnh nhân tham gia chat
- `doctor`: Bác sĩ tham gia chat (nếu có)
- `messages`: Danh sách tin nhắn trong phiên

**Indexes:**

- patient_id, doctor_id, is_ai_chat, created_at

**Use Cases:**

- Chat trực tiếp với bác sĩ
- Tư vấn sức khỏe qua AI chatbot
- Hỏi đáp trước/sau khám bệnh

### Model `messages`

Tin nhắn trong phiên chat

| Trường        | Kiểu           | Mô tả                           |
| ------------- | -------------- | ------------------------------- |
| `id`          | Int (PK)       | ID tin nhắn                     |
| `session_id`  | Int (FK)       | ID phiên chat                   |
| `sender_type` | sender_type    | Loại người gửi: USER/DOCTOR/AI  |
| `sender_id`   | Int?           | ID người gửi (null nếu AI)      |
| `content`     | String? (Text) | Nội dung tin nhắn văn bản       |
| `file_url`    | String?        | URL file đính kèm (ảnh, PDF...) |
| `is_read`     | Boolean        | Đã đọc chưa? (mặc định false)   |
| `created_at`  | DateTime       | Thời gian gửi                   |
| `updated_at`  | DateTime       | Thời gian cập nhật (edit)       |
| `deleted_at`  | DateTime?      | Thời gian xóa (soft delete)     |

**Relations:**

- `session`: Phiên chat chứa tin nhắn này

**Indexes:**

- session_id, sender_id, created_at, is_read

**Use Cases:**

- Hiển thị lịch sử chat
- Đánh dấu tin nhắn đã đọc
- Gửi file đính kèm

---

## Security & Best Practices

### Soft Delete

Các bảng có `deleted_at`:

- `users`: Giữ lại dữ liệu người dùng
- `appointments`: Lưu lịch sử đặt lịch
- `chat_sessions`: Lưu lịch sử chat
- `messages`: Khôi phục tin nhắn nếu cần

### Password Storage

- Trường `password` phải được **hash** bằng bcrypt/argon2
- Không bao giờ lưu plain text password

### Indexes Strategy

- **Foreign Keys**: Luôn có index để JOIN nhanh
- **Filtering Fields**: status, is_active, role...
- **Sorting Fields**: created_at, start_time...
- **Search Fields**: name, email, phone...

### Data Validation

Nên validate ở application layer:

- Email format
- Phone format (VN: 10-11 số)
- Date ranges (end_time > start_time)
- Positive numbers (weight, height, fee...)

---

## Common Queries Examples

```sql
-- Tìm bác sĩ tim mạch đang hoạt động
SELECT u.*, d.* FROM users u
JOIN doctors d ON u.id = d.user_id
JOIN specialties s ON d.specialty_id = s.id
WHERE s.name = 'Tim mạch' AND d.is_active = true;

-- Lịch hẹn hôm nay của bệnh nhân
SELECT * FROM appointments
WHERE patient_id = ?
AND DATE(start_time) = CURDATE()
AND status != 'CANCELLED';

-- Đơn thuốc gần nhất của bệnh nhân
SELECT mr.*, pr.* FROM medical_records mr
JOIN appointments a ON mr.appointment_id = a.id
JOIN prescription_items pr ON mr.id = pr.medical_record_id
WHERE a.patient_id = ?
ORDER BY mr.created_at DESC LIMIT 1;
```

---

**Tài liệu này được tạo tự động từ Prisma Schema. Cập nhật: December 2025**
