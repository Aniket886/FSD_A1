const router = require('express').Router();
const { createAuthor, listAuthors } = require('../controllers/authorController');
const requireApiKey = require('../middleware/requireApiKey');

router.get('/', listAuthors);
router.post('/register', requireApiKey, createAuthor);

module.exports = router;
