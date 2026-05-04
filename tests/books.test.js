process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test-key';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const Author = require('../src/models/Author');
const Category = require('../src/models/Category');
const Book = require('../src/models/Book');

let mongoServer;
let authorId;
let categoryId;
let bookId;

const apiKeyHeader = { 'x-api-key': 'test-key' };

describe('Library Book Management API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDB(mongoServer.getUri());
    await Promise.all([Author.init(), Category.init(), Book.init()]);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
    await mongoServer.stop();
  });

  test('blocks write requests without API key', async () => {
    const res = await request(app)
      .post('/api/authors/register')
      .send({ name: 'Unauthorized Author' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('creates author and category relations', async () => {
    const authorRes = await request(app)
      .post('/api/authors/register')
      .set(apiKeyHeader)
      .send({ name: 'Robert C. Martin', biography: 'Software engineering author.' });

    expect(authorRes.statusCode).toBe(201);
    expect(authorRes.body.data.name).toBe('Robert C. Martin');
    authorId = authorRes.body.data._id;

    const categoryRes = await request(app)
      .post('/api/categories/register')
      .set(apiKeyHeader)
      .send({ name: 'Software Engineering', description: 'Books about software design.' });

    expect(categoryRes.statusCode).toBe(201);
    expect(categoryRes.body.data.name).toBe('Software Engineering');
    categoryId = categoryRes.body.data._id;
  });

  test('registers a book and populates author/category data', async () => {
    const res = await request(app)
      .post('/api/books/register')
      .set(apiKeyHeader)
      .send({
        title: 'Clean Code',
        isbn: '9780132350884',
        authorId,
        categoryId,
        publishedYear: 2008,
        copiesAvailable: 7,
        description: 'A handbook of agile software craftsmanship.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe('Clean Code');
    expect(res.body.data.author.name).toBe('Robert C. Martin');
    expect(res.body.data.category.name).toBe('Software Engineering');
    bookId = res.body.data._id;
  });

  test('rejects duplicate ISBN values', async () => {
    const res = await request(app)
      .post('/api/books/register')
      .set(apiKeyHeader)
      .send({
        title: 'Duplicate Clean Code',
        isbn: '9780132350884',
        authorId,
        categoryId,
        publishedYear: 2008,
        copiesAvailable: 1
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/isbn/i);
  });

  test('lists books with pagination and ISBN search', async () => {
    const res = await request(app).get('/api/books?page=1&limit=10&isbn=9780132350884');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(10);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].isbn).toBe('9780132350884');
  });

  test('updates and deletes a book', async () => {
    const updateRes = await request(app)
      .put(`/api/books/${bookId}`)
      .set(apiKeyHeader)
      .send({ copiesAvailable: 9 });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.copiesAvailable).toBe(9);

    const deleteRes = await request(app)
      .delete(`/api/books/${bookId}`)
      .set(apiKeyHeader);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Book deleted successfully');

    const getRes = await request(app).get(`/api/books/${bookId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
