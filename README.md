# TaskFlow Todo List
Full-stack Todo app: React + TypeScript + Vite, Express.js, Prisma, PostgreSQL.

## Requirements
Node.js 20+, npm, PostgreSQL 14+.

## Backend
1. Create database: `CREATE DATABASE taskflow;`
2. `cd backend`
3. Copy `.env.example` to `.env` and set your PostgreSQL password in DATABASE_URL.
4. `npm install`
5. `npx prisma generate`
6. `npx prisma migrate dev --name init`
7. `npm run dev` (API: http://localhost:4000)

## Frontend
In another terminal: `cd frontend`, copy `.env.example` to `.env`, run `npm install`, `npm run dev`, then open http://localhost:5173.

## API
GET /api/todos, GET /api/todos/:id, POST /api/todos, PUT /api/todos/:id, PATCH /api/todos/:id/complete, DELETE /api/todos/:id.
Import `postman/TaskFlow.postman_collection.json` into Postman. Collection creates a todo and stores its ID for subsequent requests.

## GitHub submission
Create two Public repositories. Upload the contents of `frontend/` to `todo-list-frontend` and `backend/` to `todo-list-backend`. Never upload `.env` or `node_modules`.
