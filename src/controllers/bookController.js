const Book = require('../models/Book');
const Author = require('../models/Author');
const Category = require('../models/Category');

const normalizeIsbn = (isbn) => String(isbn || '').replace(/[-\s]/g, '').toUpperCase();

const validateRelations = async (authorId, categoryId) => {
  const [author, category] = await Promise.all([
    authorId ? Author.findById(authorId) : null,
    categoryId ? Category.findById(categoryId) : null
  ]);

  if (authorId && !author) {
    const error = new Error('Author not found');
    error.statusCode = 404;
    throw error;
  }

  if (categoryId && !category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }
};

const createBook = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      isbn: normalizeIsbn(req.body.isbn),
      author: req.body.authorId || req.body.author,
      category: req.body.categoryId || req.body.category,
      publishedYear: req.body.publishedYear,
      copiesAvailable: req.body.copiesAvailable,
      description: req.body.description
    };

    await validateRelations(payload.author, payload.category);

    const book = await Book.create(payload);
    const populatedBook = await Book.findById(book._id)
      .populate('author', 'name biography')
      .populate('category', 'name description');

    return res.status(201).json({ success: true, data: populatedBook });
  } catch (error) {
    return next(error);
  }
};

const listBooks = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.isbn) {
      filter.isbn = normalizeIsbn(req.query.isbn);
    }

    if (req.query.q) {
      filter.$text = { $search: req.query.q };
    }

    if (req.query.author) {
      filter.author = req.query.author;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [items, total] = await Promise.all([
      Book.find(filter)
        .populate('author', 'name biography')
        .populate('category', 'name description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: items
    });
  } catch (error) {
    return next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'name biography')
      .populate('category', 'name description');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (payload.isbn) {
      payload.isbn = normalizeIsbn(payload.isbn);
    }

    if (payload.authorId) {
      payload.author = payload.authorId;
      delete payload.authorId;
    }

    if (payload.categoryId) {
      payload.category = payload.categoryId;
      delete payload.categoryId;
    }

    if (payload.author || payload.category) {
      await validateRelations(payload.author, payload.category);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    })
      .populate('author', 'name biography')
      .populate('category', 'name description');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBook,
  listBooks,
  getBookById,
  updateBook,
  deleteBook,
  normalizeIsbn
};
