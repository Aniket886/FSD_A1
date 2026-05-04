# Team 1: Library Book Management API

## Submission Details

- **Course:** Full Stack Development with Integrated Lab
- **Assignment:** Assignment I
- **Team:** Team 1
- **Problem Statement:** Library Book Management API using Express + MongoDB
- **Git Repository:** `<paste GitHub repository URL>`
- **Render URL:** `<paste Render service URL>`
- **Postman Collection:** `postman/Library_Book_Management_API.postman_collection.json`
- **Load Test Script:** `artillery/books-load-test.yml`

---

## Introduction

This assignment develops a backend REST API for managing library books. The system uses **Node.js**, **Express.js**, **MongoDB**, and **Mongoose** to implement book CRUD operations, author/category relationships, ISBN search, validation, error handling, automated testing, Docker deployment, and CI/CD through GitHub Actions. The assignment demonstrates the full stack backend lifecycle: route design, database modelling, server-side validation, API testing, containerization, deployment, and load testing.

A library needs a structured system to register books, connect each book with an author and category, search books by ISBN, update book availability, and remove old or incorrect records. This API provides those operations through REST endpoints that can be consumed by a frontend, mobile application, or Postman client.

---

## Problem Statement

Develop a **Library Book Management API** using **Express + MongoDB**. Create book CRUD endpoints under `/api/books`, including:

- `POST /api/books/register` to register a new book
- `GET /api/books` to list books with pagination and ISBN search
- `GET /api/books/:id` to retrieve one book
- `PUT /api/books/:id` to update book data
- `DELETE /api/books/:id` to delete a book

Additional requirements:

- Use author and category relations.
- Add ISBN search functionality.
- Deploy the API on Render.
- Use GitHub Actions CI/CD with linting, Jest tests, Docker build, and Render deploy on `main` push.
- Conduct Artillery load testing with 100 concurrent virtual users.
- Submit Git repository, Render URL, and Postman collection with at least 5 working requests.

---

## Relevance

The project is relevant because most real-world applications require backend APIs connected to databases. A library system is a practical example of a CRUD-based application with relationships between collections. The project applies important full stack concepts such as REST API design, MongoDB schema modelling, database indexing, validation, CI/CD, and cloud deployment.

---

## Objective

The objectives of the project are:

1. To design and develop REST APIs for book management.
2. To create MongoDB models for Books, Authors, and Categories.
3. To implement author/category relations using Mongoose references and population.
4. To implement ISBN-based search and paginated book listing.
5. To add validation, error handling, API key protection for write routes, rate limiting, and security headers.
6. To test the API using Jest and Supertest.
7. To containerize the project using Docker.
8. To automate linting, testing, Docker image publishing, and Render deployment using GitHub Actions.
9. To test performance using Artillery with 100 virtual users.
10. To document the API using Postman and this report.

---

## Methodology / Approach

The system was developed using the following procedure:

1. **Requirement Analysis:** Identify CRUD endpoints, database relations, ISBN search, testing, deployment, and load testing requirements.
2. **Database Design:** Create three MongoDB collections: `authors`, `categories`, and `books`. Books store references to author and category documents.
3. **API Design:** Follow REST conventions for routes, HTTP methods, request bodies, and response status codes.
4. **Implementation:** Build Express routes, controllers, Mongoose models, middleware, and error handling.
5. **Validation and Security:** Validate ISBN, ObjectId values, required fields, duplicate ISBN, and API key authentication for write requests.
6. **Testing:** Write Jest + Supertest tests using an in-memory MongoDB database.
7. **Containerization:** Create a Dockerfile to run the API in a production container.
8. **CI/CD:** Configure GitHub Actions to run linting and tests before building and pushing Docker image, then trigger Render deployment.
9. **Load Testing:** Use Artillery to simulate 100 concurrent virtual users against health, list, and ISBN search endpoints.
10. **Documentation:** Prepare README, API endpoint table, Postman collection, deployment steps, and results section.

---

## Main Content

### 1. Technology Stack

| Layer | Technology Used | Purpose |
|---|---|---|
| Runtime | Node.js | Executes JavaScript backend |
| Backend Framework | Express.js | Defines API routes and middleware |
| Database | MongoDB Atlas / MongoDB | Stores book, author, and category documents |
| ODM | Mongoose | Defines schemas, relations, validation, and indexes |
| Testing | Jest + Supertest | Unit and integration API testing |
| Load Testing | Artillery | Performance testing with concurrent virtual users |
| Containerization | Docker | Packages app for production deployment |
| CI/CD | GitHub Actions | Automates lint, test, Docker build, deploy |
| Deployment | Render | Hosts live API service |
| API Client | Postman | Manual testing and submission collection |

### 2. System Architecture

```text
Client / Postman / Frontend
        |
        v
Express.js API Server
        |
        v
Routes -> Middleware -> Controllers
        |
        v
Mongoose Models
        |
        v
MongoDB Atlas Database
```

The client sends HTTP requests to Express routes. Middleware checks JSON input, API key, rate limits, and ObjectId validity. Controllers apply business logic and call Mongoose models. MongoDB stores the data permanently.

### 3. Database Schema Design

#### Author Collection

| Field | Type | Constraint |
|---|---|---|
| name | String | Required, unique |
| biography | String | Optional |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

#### Category Collection

| Field | Type | Constraint |
|---|---|---|
| name | String | Required, unique |
| description | String | Optional |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

#### Book Collection

| Field | Type | Constraint |
|---|---|---|
| title | String | Required |
| isbn | String | Required, unique, indexed |
| author | ObjectId | Required, references Author |
| category | ObjectId | Required, references Category |
| publishedYear | Number | Optional, cannot be future year |
| copiesAvailable | Number | Required, minimum 0 |
| description | String | Optional |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### 4. API Endpoint Design

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/health` | Check API health | No |
| POST | `/api/authors/register` | Create author | Yes |
| GET | `/api/authors` | List authors | No |
| POST | `/api/categories/register` | Create category | Yes |
| GET | `/api/categories` | List categories | No |
| POST | `/api/books/register` | Register book | Yes |
| GET | `/api/books?page=1&limit=10` | List books with pagination | No |
| GET | `/api/books?isbn=9780132350884` | Search by ISBN | No |
| GET | `/api/books/:id` | Get one book | No |
| PUT | `/api/books/:id` | Update book | Yes |
| DELETE | `/api/books/:id` | Delete book | Yes |

### 5. Sample Request and Response

#### Register Book Request

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

#### Successful Response

```json
{
  "success": true,
  "data": {
    "_id": "BOOK_OBJECT_ID",
    "title": "Clean Code",
    "isbn": "9780132350884",
    "author": {
      "_id": "AUTHOR_OBJECT_ID",
      "name": "Robert C. Martin"
    },
    "category": {
      "_id": "CATEGORY_OBJECT_ID",
      "name": "Software Engineering"
    },
    "publishedYear": 2008,
    "copiesAvailable": 7
  }
}
```

### 6. Folder Structure

```text
library-book-management-api/
├── .github/workflows/ci-cd.yml
├── artillery/books-load-test.yml
├── postman/Library_Book_Management_API.postman_collection.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── tests/books.test.js
├── Dockerfile
├── package.json
└── README.md
```

---

## Explanation / Discussion

### Book CRUD Logic

The CRUD logic is implemented in the `bookController.js` file. Before creating or updating a book, the system checks whether the author and category IDs exist. The ISBN is normalized by removing hyphens and spaces. The book listing endpoint supports pagination and optional filters such as ISBN, author, category, and text search.

### Relationship Handling

Books store the `author` and `category` fields as MongoDB ObjectIds. When books are retrieved, Mongoose `populate()` replaces those ObjectIds with selected author and category details. This makes API responses more useful because the user sees book information together with author and category data.

### ISBN Search

ISBN search is implemented through the query string:

```http
GET /api/books?isbn=9780132350884
```

The controller normalizes the ISBN input and searches the indexed `isbn` field. A unique index prevents duplicate books with the same ISBN.

### Security and Validation

Security and validation measures include:

- `helmet()` for secure HTTP headers.
- `cors()` to control cross-origin access.
- `express-rate-limit` to reduce abuse.
- `x-api-key` protection for POST, PUT, and DELETE routes.
- Mongoose schema validation for required fields, ISBN format, and numeric ranges.
- ObjectId validation for route parameters.
- Centralized error handling for duplicate ISBN, invalid IDs, and validation failures.

### CI/CD Pipeline

The GitHub Actions workflow performs:

1. Checkout source code.
2. Install Node dependencies.
3. Run ESLint.
4. Run Jest tests with coverage.
5. Build Docker image after tests pass.
6. Push Docker image to GitHub Container Registry.
7. Trigger Render deployment using `RENDER_DEPLOY_HOOK_URL` secret.

---

## Formulas and Equations

### 1. Pagination Formula

```text
skip = (page - 1) × limit
```

Example:

```text
page = 2, limit = 10
skip = (2 - 1) × 10 = 10
```

This means page 2 starts after skipping the first 10 records.

### 2. Total Pages Formula

```text
totalPages = ceil(totalBooks / limit)
```

Example:

```text
totalBooks = 45, limit = 10
totalPages = ceil(45 / 10) = 5
```

### 3. Error Rate Formula for Load Testing

```text
errorRate = failedRequests / totalRequests × 100
```

### 4. Average Response Time Formula

```text
averageResponseTime = sum of all response times / number of requests
```

---

## Code

Important code files are included in this repository. Key snippets are shown below.

### Book Model

```js
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, uppercase: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    publishedYear: Number,
    copiesAvailable: { type: Number, required: true, min: 0, default: 1 }
  },
  { timestamps: true }
);

bookSchema.index({ isbn: 1 }, { unique: true });
bookSchema.index({ title: 'text', isbn: 'text' });
```

### Book Routes

```js
router.post('/register', requireApiKey, createBook);
router.get('/', listBooks);
router.get('/:id', validateObjectId('id'), getBookById);
router.put('/:id', requireApiKey, validateObjectId('id'), updateBook);
router.delete('/:id', requireApiKey, validateObjectId('id'), deleteBook);
```

### Paginated ISBN Search Logic

```js
const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
const skip = (page - 1) * limit;

const filter = {};
if (req.query.isbn) {
  filter.isbn = normalizeIsbn(req.query.isbn);
}

const books = await Book.find(filter)
  .populate('author', 'name biography')
  .populate('category', 'name description')
  .skip(skip)
  .limit(limit);
```

---

## Results / Findings

### Test Condition 1: Register a Valid Book

| Input | Expected Output | Result |
|---|---|---|
| Valid title, ISBN, authorId, categoryId, copiesAvailable | HTTP 201, book created with populated author/category | Passed |

### Test Condition 2: Duplicate ISBN

| Input | Expected Output | Result |
|---|---|---|
| Register another book with existing ISBN | HTTP 409 conflict | Passed |

### Test Condition 3: Paginated ISBN Search

| Input | Expected Output | Result |
|---|---|---|
| `/api/books?page=1&limit=10&isbn=9780132350884` | HTTP 200, returns matching book list | Passed |

### Test Condition 4: Update Book Copies

| Input | Expected Output | Result |
|---|---|---|
| `PUT /api/books/:id` with `copiesAvailable: 9` | HTTP 200, updated copies count | Passed |

### Test Condition 5: Delete Book

| Input | Expected Output | Result |
|---|---|---|
| `DELETE /api/books/:id` | HTTP 200, deletion message | Passed |

### Jest Test Command

```bash
npm test
```

Expected output:

```text
PASS tests/books.test.js
Library Book Management API
  ✓ blocks write requests without API key
  ✓ creates author and category relations
  ✓ registers a book and populates author/category data
  ✓ rejects duplicate ISBN values
  ✓ lists books with pagination and ISBN search
  ✓ updates and deletes a book
```

### Artillery Load Test Command

```bash
API_BASE_URL=https://your-render-service.onrender.com npm run loadtest
npx artillery report artillery/books-load-report.json --output artillery/books-load-report.html
```

The load test is configured to ramp up to 100 virtual users and sustain 100 virtual users while testing `/health`, `/api/books`, and ISBN search endpoints.

---

## Discussion / Analysis

During implementation, the main challenges were designing relationships and preventing duplicate ISBN records. Author and category references were implemented using Mongoose ObjectId references. The duplicate ISBN issue was solved by adding a unique index on the `isbn` field and centralized duplicate-key error handling.

Pagination improves efficiency because the server does not return all books at once. The `limit` value is capped at 50 to prevent very large responses. ISBN search is efficient because the ISBN field is indexed. API key protection secures write operations, while GET endpoints remain publicly accessible for normal library search use cases.

The CI/CD pipeline improves software quality because code is linted and tested before deployment. Docker deployment makes the API portable and consistent between local and production environments. Artillery load testing checks whether the deployed API can handle concurrent requests.

---

## Local Setup and Execution

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Update `.env`:

```env
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
API_KEY=change-this-secret-for-write-requests
CORS_ORIGIN=*
```

### 3. Start API

```bash
npm run dev
```

### 4. Run Tests

```bash
npm test
```

### 5. Run Lint

```bash
npm run lint
```

### 6. Build Docker Image

```bash
docker build -t library-book-management-api .
docker run -p 5000:5000 --env-file .env library-book-management-api
```

---

## Render Deployment Steps

1. Push this project to GitHub.
2. Create MongoDB Atlas database and copy the connection string.
3. Create a Render Web Service using either GitHub repository deployment or existing Docker image deployment.
4. Add environment variables on Render:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=<MongoDB Atlas URI>`
   - `API_KEY=<secure key>`
   - `CORS_ORIGIN=*`
5. Copy the Render Deploy Hook URL from Render service settings.
6. Add GitHub repository secret:
   - `RENDER_DEPLOY_HOOK_URL=<Render deploy hook>`
7. Push to the `main` branch.
8. Verify that GitHub Actions passes linting and tests, builds Docker image, and triggers Render deployment.

---

## Postman Collection

Import this file in Postman:

```text
postman/Library_Book_Management_API.postman_collection.json
```

Set collection variables:

| Variable | Value |
|---|---|
| `baseUrl` | `http://localhost:5000` or Render URL |
| `apiKey` | Value of `API_KEY` from `.env` or Render |

The collection includes working requests for health check, author creation, category creation, book registration, paginated ISBN search, update, and delete.

---

## Conclusion

The Library Book Management API successfully implements the required CRUD endpoints using Express and MongoDB. It supports author and category relationships, ISBN search, pagination, validation, API security, automated tests, Docker containerization, GitHub Actions CI/CD, Render deployment configuration, and Artillery load testing. The objective of developing a scalable and deployable backend API for library book management was achieved.

---

## References

1. Express.js Routing Documentation: https://expressjs.com/en/guide/routing.html
2. Mongoose Populate Documentation: https://mongoosejs.com/docs/populate.html
3. Mongoose Schema and Index Documentation: https://mongoosejs.com/docs/guide.html
4. MongoDB Unique Index Documentation: https://www.mongodb.com/docs/v6.3/core/index-unique/
5. Jest Getting Started Documentation: https://jestjs.io/docs/getting-started
6. Render Deploy Hooks Documentation: https://render.com/docs/deploy-hooks
7. Docker GitHub Actions Documentation: https://docs.docker.com/build/ci/github-actions/
8. Artillery Core Concepts Documentation: https://www.artillery.io/docs/get-started/core-concepts
