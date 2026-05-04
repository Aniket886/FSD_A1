# Library Book Management API

A RESTful backend API for managing library books, authors, and categories. The project is built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**, with automated tests, Docker support, GitHub Actions CI/CD, Postman documentation, and Artillery load testing.

## Overview

This API helps a library manage its book catalogue through structured CRUD endpoints. Books are connected to author and category records, support ISBN-based search, and include pagination for efficient listing.

### Key Features

- Book registration, listing, search, update, and delete
- Author and category management
- Mongoose relationships with populated book responses
- ISBN normalization and duplicate ISBN protection
- Pagination, filtering, and text search support
- API key protection for write operations
- Centralized validation and error handling
- Jest + Supertest integration tests
- Docker-ready deployment
- GitHub Actions workflow for linting, tests, Docker build, and Render deployment
- Artillery load testing configuration

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Testing | Jest, Supertest, mongodb-memory-server |
| Security | Helmet, CORS, rate limiting, API key middleware |
| DevOps | Docker, GitHub Actions, Render |
| Load Testing | Artillery |
| API Client | Postman |

## Project Structure

```text
library-book-management-api/
|-- .github/workflows/ci-cd.yml
|-- artillery/books-load-test.yml
|-- postman/Library_Book_Management_API.postman_collection.json
|-- src/
|   |-- app.js
|   |-- server.js
|   |-- config/db.js
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   `-- routes/
|-- tests/books.test.js
|-- Dockerfile
|-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- MongoDB Atlas connection string or local MongoDB instance
- npm

### Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env`:

```env
PORT=5000
MONGODB_URI=<your-mongodb-uri>
API_KEY=change-this-secret-for-write-requests
CORS_ORIGIN=*
```

### Run Locally

```bash
npm run dev
```

The API starts on:

```text
http://localhost:5000
```

Health check:

```http
GET /health
```

## API Endpoints

### Health

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Check API status | No |

### Authors

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/authors/register` | Create an author | Yes |
| GET | `/api/authors` | List authors | No |

### Categories

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/categories/register` | Create a category | Yes |
| GET | `/api/categories` | List categories | No |

### Books

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/books/register` | Register a book | Yes |
| GET | `/api/books` | List books with pagination | No |
| GET | `/api/books?isbn=9780132350884` | Search books by ISBN | No |
| GET | `/api/books/:id` | Get one book | No |
| PUT | `/api/books/:id` | Update a book | Yes |
| DELETE | `/api/books/:id` | Delete a book | Yes |

Write requests require this header:

```http
x-api-key: change-this-secret-for-write-requests
```

## Example Request

```http
POST /api/books/register
Content-Type: application/json
x-api-key: change-this-secret-for-write-requests
```

```json
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

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start the development server with Nodemon |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:ci` | Run tests with coverage |
| `npm run loadtest` | Run Artillery load test |

## Testing

Run the automated test suite:

```bash
npm test
```

The tests use `mongodb-memory-server`, so a separate test database is not required.

## Docker

Build the image:

```bash
docker build -t library-book-management-api .
```

Run the container:

```bash
docker run -p 5000:5000 --env-file .env library-book-management-api
```

## Load Testing

Set the deployed API URL and run Artillery:

```bash
API_BASE_URL=https://your-render-service.onrender.com npm run loadtest
```

Generate an HTML report:

```bash
npx artillery report artillery/books-load-report.json --output artillery/books-load-report.html
```

## Postman Collection

Import the collection from:

```text
postman/Library_Book_Management_API.postman_collection.json
```

Recommended collection variables:

| Variable | Value |
| --- | --- |
| `baseUrl` | `http://localhost:5000` or your Render URL |
| `apiKey` | Same value as `API_KEY` |

## Deployment

The repository includes a GitHub Actions workflow at:

```text
.github/workflows/ci-cd.yml
```

The workflow is designed to:

1. Install dependencies
2. Run lint checks
3. Run Jest tests with coverage
4. Build a Docker image
5. Push the image to GitHub Container Registry
6. Trigger Render deployment using `RENDER_DEPLOY_HOOK_URL`

Required Render environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
API_KEY=<secure-api-key>
CORS_ORIGIN=*
```

Required GitHub secret:

```text
RENDER_DEPLOY_HOOK_URL
```

## Repository

GitHub:

```text
https://github.com/Aniket886/FSD_A1
```

## License

This project is licensed under the MIT License.
