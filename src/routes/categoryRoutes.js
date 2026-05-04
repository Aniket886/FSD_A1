const router = require('express').Router();
const { createCategory, listCategories } = require('../controllers/categoryController');
const requireApiKey = require('../middleware/requireApiKey');

router.get('/', listCategories);
router.post('/register', requireApiKey, createCategory);

module.exports = router;
