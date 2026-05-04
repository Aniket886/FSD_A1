const router = require('express').Router();
const {
  createBook,
  listBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const requireApiKey = require('../middleware/requireApiKey');
const validateObjectId = require('../middleware/validateObjectId');

router.post('/register', requireApiKey, createBook);
router.get('/', listBooks);
router.get('/:id', validateObjectId('id'), getBookById);
router.put('/:id', requireApiKey, validateObjectId('id'), updateBook);
router.delete('/:id', requireApiKey, validateObjectId('id'), deleteBook);

module.exports = router;
