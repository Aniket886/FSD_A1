<div align="center">

# 📚 Library Book Management API

**A production-ready RESTful backend for managing library books, authors, and categories.**

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/Aniket886/FSD_A1/actions)

[Overview](#-overview) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Deployment](#-deployment)

</div>

---

## 🔍 Overview

This API provides a library with a structured system to register books, link each book to an author and category, search by ISBN, update availability, and remove records — all through clean REST endpoints consumable by any frontend, mobile app, or Postman client.

Built as **Full Stack Development Assignment I** using **Node.js + Express + MongoDB + Mongoose**, with automated tests, Docker support, GitHub Actions CI/CD, and Artillery load testing.

---

## ✨ Features

- **Book CRUD** — register, list, search by ISBN, update, and delete books
- **Author & Category Management** — create and list authors and categories
- **Mongoose Relationships** — populated responses with author and category details
- **ISBN Normalization** — strips hyphens/spaces, enforces uniqueness
- **Pagination & Filtering** — page, limit, ISBN, and text search query params
- **API Key Protection** — all write routes require `x-api-key` header
- **Validation & Error Handling** — schema validation, ObjectId checks, duplicate detection
- **Security Middleware** — Helmet, CORS, express-rate-limit
- **Integration Tests** — Jest + Supertest with in-memory MongoDB
- **Docker Ready** — containerized for consistent deployments
- **CI/CD Pipeline** — lint → test → Docker build → push → Render deploy
- **Load Testing** — Artillery configuration for 100 concurrent virtual users

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Testing | Jest · Supertest · mongodb-memory-server |
| Security | Helmet · CORS · express-rate-limit |
| DevOps | Docker · GitHub Actions · Render |
| Load Testing | Artillery |
| API Client | Postman |

---

## 📁 Project Structure

```
library-book-management-api/
├── .github/
│   └── workflows/ci-cd.yml
├── artillery/
│   └── books-load-test.yml
├── postman/
│   └── Library_Book_Management_API.postman_collection.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── tests/
│   └── books.test.js
├── Dockerfile
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas URI or local MongoDB instance
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Aniket886/FSD_A1.git
cd FSD_A1

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

Update `.env`:

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
API_KEY=change-this-secret-for-write-requests
CORS_ORIGIN=*
```

### Start the Server

```bash
npm run dev
```

API is available at `http://localhost:5000`

```bash
# Verify it's running
curl http://localhost:5000/health
```

---

## 📡 API Reference

### Health

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/health` | — |

### Authors

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/authors/register` | Create an author | `x-api-key` |
| `GET` | `/api/authors` | List all authors | — |

### Categories

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/categories/register` | Create a category | `x-api-key` |
| `GET` | `/api/categories` | List all categories | — |

### Books

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/books/register` | Register a new book | `x-api-key` |
| `GET` | `/api/books` | List books with pagination | — |
| `GET` | `/api/books?isbn=9780132350884` | Search books by ISBN | — |
| `GET` | `/api/books/:id` | Get one book by ID | — |
| `PUT` | `/api/books/:id` | Update a book | `x-api-key` |
| `DELETE` | `/api/books/:id` | Delete a book | `x-api-key` |

> Write routes require: `x-api-key: <your-api-key>`

### Example Request

```http
POST /api/books/register
Content-Type: application/json
x-api-key: change-this-secret-for-write-requests

{
  "title": "Clean Code",
  "isbn": "9780132350884",
  "authorId": "AUTHOR_OBJECT_ID",
  "categoryId": "CATEGORY_OBJECT_ID",
  "publishedYear": 2008,
  "copiesAvailable": 7,
  "description": "A handbook of agile software craftsmanship."
}
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:ci
```

Tests use `mongodb-memory-server` — no separate test database required.

---

## 🐳 Docker

```bash
# Build image
docker build -t library-book-management-api .

# Run container
docker run -p 5000:5000 --env-file .env library-book-management-api
```

---

## 📊 Load Testing

```bash
# Run Artillery against deployed URL
API_BASE_URL=https://your-render-service.onrender.com npm run loadtest

# Generate HTML report
npx artillery report artillery/books-load-report.json --output artillery/books-load-report.html
```

Configured to ramp up to **100 concurrent virtual users** against `/health`, `/api/books`, and ISBN search endpoints.

---

## 🔁 CI/CD Pipeline

GitHub Actions workflow at `.github/workflows/ci-cd.yml`:

```
Push to main
  │
  ├─ Install dependencies
  ├─ Run ESLint
  ├─ Run Jest tests (with coverage)
  ├─ Build Docker image
  ├─ Push to GitHub Container Registry
  └─ Trigger Render deployment
```

**Required GitHub secret:**

```
RENDER_DEPLOY_HOOK_URL
```

---

## ☁️ Deployment

### Render

1. Push this repository to GitHub
2. Create a MongoDB Atlas cluster and copy the connection string
3. Create a **Render Web Service** linked to this repo
4. Add environment variables on Render:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | MongoDB Atlas URI |
   | `API_KEY` | A secure secret key |
   | `CORS_ORIGIN` | `*` |

5. Copy the **Deploy Hook URL** from Render service settings
6. Add it as `RENDER_DEPLOY_HOOK_URL` in your GitHub repo secrets
7. Push to `main` — the pipeline handles the rest

---

## 📬 Postman Collection

Import from:

```
postman/Library_Book_Management_API.postman_collection.json
```

| Variable | Value |
|---|---|
| `baseUrl` | `http://localhost:5000` or your Render URL |
| `apiKey` | Value of `API_KEY` in `.env` |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with Nodemon |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest test suite |
| `npm run test:ci` | Run tests with coverage |
| `npm run loadtest` | Run Artillery load test |

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for **Full Stack Development — Assignment I**

[⬆ Back to top](#-library-book-management-api)

</div>
