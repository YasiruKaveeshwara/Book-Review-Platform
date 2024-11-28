const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// Add a new book
router.post("/add", async (req, res) => {
  try {
    const { title, author, isbn, description, rating, coverImage } = req.body;
    
    // Validate data
    if (!title || !author || !isbn || !description || !rating || !coverImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      description,
      rating,
      coverImage,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: "Error saving book: " + err.message });
  }
});

// View all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books: " + err.message });
  }
});

// View one book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book: " + err.message });
  }
});

module.exports = router;
