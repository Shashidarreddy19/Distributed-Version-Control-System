# CodeVault — Distributed Version Control System

A full-stack developer platform built around a custom Git-inspired version control system. CodeVault implements its own VCS architecture from scratch — staging, commits, push/pull via AWS S3, and revert — driven by a CLI and backed by a modern web application.

---

## Table of Contents

- [Overview](#overview)
- [The .nova Folder](#the-nova-folder)
- [CLI Commands](#cli-commands)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

CodeVault is two things in one:

**1. A custom Version Control System (CLI)**
A command-line tool that mirrors Git behaviour using a local `.nova` folder. Stage files, create commits (each stored as a UUID-named snapshot), push to AWS S3, pull from S3, and revert to any previous commit — all without Git.

**2. A Web Developer Platform (MERN)**
A full-stack web app where users sign up, create repositories, track issues, view contribution heatmaps, and manage their developer profile. Built on MongoDB, Express, React, and Node.js with real-time support via Socket.IO.

---

## The `.nova` Folder

When you run `nova init`, a `.nova` directory is created in your working directory — analogous to `.git`.

```
.nova/
├── commits/
│   └── <uuid>/
│       ├── <staged files>
│       └── commit.json       ← commit ID, message, timestamp
├── staging/
│   └── <files added via nova add>
└── config.json               ← S3 bucket name for push/pull
```

Each commit is a self-contained folder — a plain file snapshot. No delta compression, no binary pack files. Human-readable and inspectable at any time.

---

## CLI Commands

```bash
node index.js <command>
```

| Command | What it does |
|---|---|
| `node index.js start` | Start the Express + Socket.IO web server |
| `node index.js init` | Initialize a `.nova` repo in the current directory |
| `node index.js add <file>` | Stage a file into `.nova/staging/` |
| `node index.js commit "<message>"` | Create a commit snapshot under `.nova/commits/<uuid>/` |
| `node index.js push` | Upload all local commits to AWS S3 |
| `node index.js pull` | Download all commits from AWS S3 |
| `node index.js revert <commitID>` | Restore working directory to a specific commit |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web Framework | Express.js v5 |
| CLI | Yargs |
| Database | MongoDB via Mongoose |
| Auth | JWT + bcryptjs |
| Cloud Storage | AWS S3 (aws-sdk) |
| Real-time | Socket.IO |
| File System | fs-extra |
| ID Generation | uuid v4 |
| Frontend | React 19 + Vite |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Heatmap | @uiw/react-heat-map |

---

## Project Structure

```
Distributed-Version-Control-System/
│
├── backend/
│   ├── index.js                  ← CLI entry point + Express server
│   ├── .env.example              ← Environment variable template
│   ├── config/
│   │   └── aws-config.js         ← AWS S3 client (reads from .env)
│   ├── controllers/
│   │   ├── init.js               ← nova init
│   │   ├── add.js                ← nova add
│   │   ├── commit.js             ← nova commit
│   │   ├── push.js               ← nova push → S3
│   │   ├── pull.js               ← nova pull ← S3
│   │   ├── revert.js             ← nova revert
│   │   ├── userController.js     ← User CRUD + Auth
│   │   ├── repoController.js     ← Repository CRUD
│   │   └── issueController.js    ← Issue CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js     ← JWT verification
│   │   └── authorizeMiddleware.js← Owner/role guard
│   ├── models/
│   │   ├── userModel.js
│   │   ├── repoModel.js
│   │   └── issueModel.js
│   └── routes/
│       ├── main.router.js
│       ├── user.router.js
│       ├── repo.router.js
│       └── issue.router.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env.example              ← Frontend env template
    └── src/
        ├── main.jsx
        ├── authContext.jsx       ← Global auth state
        ├── Routes.jsx            ← Protected + public route guards
        ├── config/
        │   └── api.js            ← Centralized axios instance (reads VITE_API_URL)
        └── components/
            ├── Navbar.jsx
            ├── auth/             ← Login, Signup
            ├── dashboard/        ← Dashboard
            └── user/             ← Profile, HeatMap
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A MongoDB Atlas account (or local MongoDB)
- AWS account with an S3 bucket (for push/pull CLI feature)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
node index.js start
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL defaults to http://localhost:3000 — change for production
npm run dev
```

---

## Environment Variables

### `backend/.env`

Copy `backend/.env.example` and fill in your values:

```env
PORT=3000

# MongoDB — paste your Atlas connection string here
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT — use a long random secret (openssl rand -hex 32)
JWT_SECRET_KEY=your_jwt_secret_here

# CORS — your frontend origin
CORS_ORIGIN=http://localhost:5173

# AWS S3 — required for nova push / nova pull
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_REGION=ap-south-1
S3_BUCKET=your_bucket_name
```

### `frontend/.env`

```env
# Change to your deployed backend URL when deploying
VITE_API_URL=http://localhost:3000
```

> Never commit `.env` files. Both are listed in `.gitignore`.

---

Built with the MERN stack.
