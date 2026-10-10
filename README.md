# Task Management API

A RESTful API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL for managing tasks securely.

This project demonstrates backend development fundamentals, including user authentication, task ownership, input validation, database operations, pagination, filtering, and centralized error handling.

## Features

* User registration and login
* Password hashing
* JWT-based authentication
* Create, read, update, and delete tasks (CRUD)
* Task ownership and authorization
* Input validation using Zod
* Pagination and task filtering
* Search tasks by title or description
* Centralized error handling
* PostgreSQL database integration using Prisma

## Technology Stack

* **Runtime:** Node.js
* **Language:** TypeScript
* **Web framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (JWT)
* **Password hashing:** bcryptjs
* **API testing:** Bruno

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)
* npm (included with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/Felixo-dev/task-management-api.git
cd task-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add your database connection string and JWT secret:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/task_management"
JWT_SECRET="your_secure_secret"
```

Replace `USERNAME` and `PASSWORD` with your PostgreSQL credentials. Use a strong, private value for `JWT_SECRET`.

**Security:** Never commit your `.env` file or expose your database password or JWT secret publicly.

### 4. Run the API

```bash
npm run dev
```

The API will start using the development script configured in the project.

## API Endpoints

All task endpoints require a valid JWT access token, except registration and login.

### Authentication

| Method | Endpoint             | Description         | Access |
| ------ | -------------------- | ------------------- | ------ |
| POST   | `/api/auth/register` | Register a new user | Public |
| POST   | `/api/auth/login`    | Log in a user       | Public |

### Tasks

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/api/tasks`     | Create a task                      |
| GET    | `/api/tasks`     | Get the authenticated user's tasks |
| GET    | `/api/tasks/:id` | Get a task by ID                   |
| PATCH  | `/api/tasks/:id` | Update a task                      |
| DELETE | `/api/tasks/:id` | Delete a task                      |

### Authentication Header

For protected endpoints, include your JWT in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Task Listing Options

The task listing endpoint supports pagination, filtering, and search.

Examples:

```http
GET /api/tasks?page=1&limit=10
GET /api/tasks?completed=true
GET /api/tasks?search=meeting
```

* `page`: Page number; defaults to `1`.
* `limit`: Number of tasks per page; defaults to `10`, with a maximum of `100`.
* `completed`: Filter tasks by completion status (`true` or `false`).
* `search`: Search task titles and descriptions.

## Example Usage

### Create a Task

**Request**

```http
POST /api/tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body**

```json
{
  "title": "Learn TypeScript",
  "description": "Practise building backend APIs"
}
```

**Example Response**

```json
{
  "message": "Task created successfully",
  "task": {
    "id": 9,
    "title": "Learn TypeScript",
    "description": "Practise building backend APIs",
    "completed": false,
    "createdAt": "2026-10-10T21:12:35.982Z",
    "updatedAt": "2026-10-10T21:12:35.982Z",
    "userId": 6
  }
}
```
A valid JWT is required to create a task. Each task belongs to the authenticated user, and users cannot access or modify another user's tasks.

## Security and Validation

This API implements several security measures to protect user accounts and task data:

* **Password hashing:** User passwords are hashed using `bcryptjs` before being stored in the database.
* **JWT authentication:** Protected endpoints require a valid JSON Web Token.
* **Task ownership:** Users can only access, update, or delete tasks that belong to their accounts.
* **Input validation:** Zod validates task data and pagination parameters.
* **Pagination limits:** The maximum page size is restricted to 100 tasks.
* **Centralized error handling:** Errors are handled through a shared error-handling middleware.

