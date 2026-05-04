const Author = require('../models/Author');

const createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    return res.status(201).json({ success: true, data: author });
  } catch (error) {
    return next(error);
  }
};

const listAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    return res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createAuthor, listAuthors };
