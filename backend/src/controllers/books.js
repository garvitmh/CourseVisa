const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Private (Admin)
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
