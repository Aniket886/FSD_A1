const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      minlength: [2, 'Book title must contain at least 2 characters'],
      maxlength: [150, 'Book title cannot exceed 150 characters']
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      trim: true,
      uppercase: true,
      unique: true,
      match: [/^([0-9]{10}|[0-9]{13}|[0-9]{9}X)$/, 'ISBN must be a valid 10 or 13 character ISBN without hyphens']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author reference is required']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Published year is too old'],
      max: [new Date().getFullYear(), 'Published year cannot be in the future']
    },
    copiesAvailable: {
      type: Number,
      required: [true, 'Copies available is required'],
      min: [0, 'Copies available cannot be negative'],
      default: 1
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
  },
  { timestamps: true }
);

bookSchema.index({ isbn: 1 }, { unique: true });
bookSchema.index({ title: 'text', isbn: 'text' });
bookSchema.index({ author: 1, category: 1 });

module.exports = mongoose.model('Book', bookSchema);
