const express = require("express");
const Review = require("../models/Review");
const Book = require("../models/Book");
const router = express.Router();

// Get all reviews for all books
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("book", "title author"); // Populating book info
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all reviews for a specific book (book-wise)
router.get("/book/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate("book", "title author");
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one review by review ID
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("book", "title author");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a review
router.put("/:id", async (req, res) => {
  try {
    const { reviewText, rating } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update review fields
    review.reviewText = reviewText || review.reviewText;
    review.rating = rating || review.rating;

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
