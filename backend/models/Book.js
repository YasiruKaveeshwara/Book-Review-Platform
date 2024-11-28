const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
  },
  coverImage: {
    type: String,
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]  // Reference to the Review model
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
