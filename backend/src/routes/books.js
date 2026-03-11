const express = require('express');
const { getBooks, getBook, createBook } = require('../controllers/books');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getBooks)
  .post(protect, authorize('admin'), createBook);

router
  .route('/:id')
  .get(getBook);

module.exports = router;
