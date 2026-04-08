# Quiz App (QuizSync / IZZY Quiz Lab)

A full-stack real-time quiz platform with:

- Next.js frontend for quiz creation and participation
- Express + TypeScript backend API
- Socket.IO for live quiz events
- PostgreSQL for persistent data
- Redis for cache/session support

## Monorepo Structure

- `frontend/` - Next.js app (App Router)
- `backend/` - Express API + Socket.IO server
- `docker-compose.yml` - Local multi-service development stack
- `.env` - Root environment variables used by backend container

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Socket.IO client

### Backend

- Express 5
- TypeScript
- TypeORM
- Socket.IO
- Zod
- PostgreSQL
- Redis (ioredis)

## Prerequisites

Install the following on your machine:

- Node.js 20+
- npm 10+
- Docker Desktop (optional, recommended for DB/Redis)

## Environment Variables

Create or update the root `.env` file with:

- `PORT` (default backend: `8000`)
- `NODE_ENV` (`development` | `production` | `test`)
- `DATABASE_HOST`
- `DATABASE_PORT` (default `5432`)
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `JWT_SECRET`

Example:

```env
PORT=8000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=quiz_db
JWT_SECRET=replace-with-a-strong-secret
```

## Run with Docker Compose

From project root:

```bash
docker compose up --build
```

This starts:

- Backend on `http://localhost:8000`
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

Notes:

- Backend container runs `npm run dev` with source mounted from `./backend`.
- Docker backend uses the root `.env` file (`env_file: .env`).

## Run Locally (Without Docker for App Processes)

### 1) Start infrastructure (Postgres + Redis)

Use Docker just for services:

```bash
docker compose up postgres redis
```

### 2) Start backend

```bash
cd backend
npm install
npm run dev
```

Backend URL: `http://localhost:8000`

### 3) Start frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

## Useful Scripts

### Backend (`backend/package.json`)

- `npm run dev` - Start API in watch mode with ts-node/nodemon
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled server from `build/app.js`

### Frontend (`frontend/package.json`)

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API and Realtime Overview

Backend mounts:

- `/api/auth`
- `/api/quizzes`
- `/api/quizzes/:quizId` (question routes)
- `/api/quizzes/:quizId/questions/:questionId` (option routes)
- `/api/sessions`
- `/api/submissions`
- `/api/users`

Socket.IO server is initialized in backend and handles live quiz/session events such as:

- joining session rooms
- participant updates
- question broadcasts
- answer result events

## Development Notes

- TypeORM currently uses `synchronize: true` in development datasource.
- Backend scheduler currently checks auto-activation tasks every minute.
- CORS allows frontend on localhost 3000 by default.

## Troubleshooting

### Backend cannot connect to database

- Verify `.env` values (`DATABASE_*`).
- Ensure PostgreSQL is running on configured host/port.
- If using Docker backend, prefer `DATABASE_HOST=postgres`.

### Frontend cannot reach backend

- Confirm backend is on port `8000`.
- Check frontend API base URL settings (if configured in frontend environment or API utility).

### Socket events not received

- Ensure client joins correct session room.
- Confirm backend Socket.IO server started with app startup logs.

## License

No explicit license file is currently included. Add a `LICENSE` file if this project is intended for public distribution.
