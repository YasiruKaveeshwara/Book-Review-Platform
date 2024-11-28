const express = require("express");
const Review = require("../models/Review");
const Book = require("../models/Book");
const router = express.Router();

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

// Post a review for a specific book
router.post("/", async (req, res) => {
  const { bookId, userName, reviewText, rating } = req.body;

  // Validate input
  if (!bookId || !userName || !reviewText || rating == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const newReview = new Review({
      book: bookId,
      userName,
      reviewText,
      rating,
    });

    await newReview.save();

    const book = await Book.findById(bookId);
    const allReviews = await Review.find({ book: bookId });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    book.rating = averageRating;
    await book.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all reviews by a specific userName
router.get("/user/:userName", async (req, res) => {
  try {
    const reviews = await Review.find({ userName: req.params.userName }).populate("book", "title author coverImage").exec();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
