# 🚀 Task Manager API

A robust, production-ready **Task Management API** built with **NestJS**, featuring **real-time collaboration**, **advanced caching**, and **enterprise-grade architecture**.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access & refresh tokens  
- Role-based access control (**Admin**, **User**)  
- Secure password hashing with **Argon2**  
- Automatic token refresh with HTTP-only cookies  
- Route protection with custom guards  

### 📊 Task & Project Management
- CRUD operations for projects and tasks  
- Task assignment and collaboration  
- Advanced filtering & search with pagination  
- Real-time progress tracking  
- File attachments support  

### ⚡ Performance & Scalability
- **Redis caching** for 10x faster responses  
- Smart cache invalidation for data consistency  
- Database connection pooling  
- Rate limiting to prevent abuse  
- Background job processing with **queues (Bull)**  

### 🛡️ Security & Reliability
- **Helmet.js** security headers  
- CORS protection with whitelisted origins  
- Input validation with `class-validator`  
- SQL injection prevention with **Prisma**  
- Comprehensive error handling  

---

## 📦 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | NestJS 10+ |
| **Language** | TypeScript |
| **Database** | MySQL + Prisma ORM |
| **Cache** | Redis (cache-manager) |
| **Auth** | JWT + Passport |
| **Validation** | class-validator & class-transformer |
| **Documentation** | Swagger / OpenAPI 3.0 |
| **Security** | Helmet, CORS, Rate Limiting |
| **Testing** | Jest (Unit & E2E) |

---

## 🚀 Quick Start

### 🧩 Prerequisites
- Node.js **v18+**  
- MySQL **v8.0+**  
- Redis **v6+** *(optional for local development)*

---

### ⚙️ Installation

```bash
git clone https://github.com/yourusername/task-manager-api.git
cd task-manager-api
npm install
```
### Environment Configuration
cp .env.example .env


### Edit .env with your configuration:
```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/taskmanager"

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# Application
PORT=3001
NODE_ENV=development

Database Setup
npx prisma generate
npx prisma migrate dev
npx prisma db seed # optional

Start the Application
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

- API available at: http://localhost:3001

- Swagger Docs: http://localhost:3001/api/docs

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and invalidate refresh token |

---

### 📁 Projects

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/projects` | Get user’s projects |
| POST | `/projects` | Create new project |
| GET | `/projects/:id` | Get project details |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

---

### ✅ Tasks

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/tasks` | Get user’s tasks |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get task details |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/toggle-complete` | Toggle completion |
| POST | `/tasks/:id/assign/:assigneeId` | Assign task |
| POST | `/tasks/:id/unassign` | Unassign task |

---

### 🛠️ Admin

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/tasks/admin/all` | View all tasks (Admin only) |


## 🗄️ Database Schema

### 🧑‍💼 Users

| Field | Type | Description |
|--------|------|-------------|
| id | Primary Key | Unique identifier |
| email | String | Unique email address |
| password | String | Hashed password |
| role | Enum | USER / ADMIN |
| hashedRt | String | Refresh token (hashed) |
| timestamps | Date | Created/Updated dates |

---

### 📁 Projects

| Field | Type | Description |
|--------|------|-------------|
| id | Primary Key | Unique identifier |
| name | String | Project name |
| ownerId | Foreign Key | References Users |
| timestamps | Date | Created/Updated dates |

---

### ✅ Tasks

| Field | Type | Description |
|--------|------|-------------|
| id | Primary Key | Unique identifier |
| title | String | Task title |
| description | String | Task details |
| completed | Boolean | Completion status |
| projectId | Foreign Key | References Projects |
| assigneeId | Foreign Key | References Users (nullable) |
| timestamps | Date | Created/Updated dates |

## 🛠 Configuration

| Variable | Description | Default |
|-----------|-------------|---------|
| DATABASE_URL | MySQL connection string | - |
| JWT_ACCESS_SECRET | JWT access token secret | - |
| JWT_REFRESH_SECRET | JWT refresh token secret | - |
| PORT | Application port | 3001 |
| NODE_ENV | Environment mode | development |

---

## 🧰 Security Features

- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- XSS Protection
- Clickjacking Prevention
- Input sanitization and validation



## 🤝 Contributing

1. **Fork** the repository  
2. **Create your feature branch**  
   ```bash
   git checkout -b feature/new-feature
   ```
2. **Commit your changes**
  ```bash
  git commit -m "Add new feature"
  ```
3. **Push to the branch**
 ```bash
 git push origin feature/new-feature
 ```
4. **Open a Pull Request**

## 📄 License

Licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NestJS** team for the excellent framework  
- **Prisma** for the modern ORM experience  
- **MySQL** for reliable data management  

⭐ **Star this repo if you found it helpful!**

---

## 🌱 Future Improvements

- Redis caching for performance optimization  
- Background job queueing (**BullMQ**)  
- File uploads & cloud storage integration  
- Email notifications for task updates  
