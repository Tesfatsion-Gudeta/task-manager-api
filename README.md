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
