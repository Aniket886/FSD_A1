const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      minlength: [2, 'Author name must contain at least 2 characters'],
      maxlength: [80, 'Author name cannot exceed 80 characters']
    },
    biography: {
      type: String,
      trim: true,
      maxlength: [500, 'Biography cannot exceed 500 characters']
    }
  },
  { timestamps: true }
);

authorSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Author', authorSchema);
