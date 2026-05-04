const Category = require('../models/Category');

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    return next(error);
  }
};

const listCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createCategory, listCategories };
