import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Correct hook for navigation
import { Rating, Alert, Box, TextField, Button } from "@mui/material"; // Material UI components

function AddBook() {
  const navigate = useNavigate(); // Correct hook to navigate
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    rating: 0, // Default rating set to 0
    coverImage: "",
  });
  const [alert, setAlert] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    setBookDetails({ ...bookDetails, [e.target.name]: e.target.value });
  };

  // Handle rating changes (5-star scale)
  const handleRatingChange = (event, newValue) => {
    setBookDetails({ ...bookDetails, rating: newValue });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!bookDetails.title || !bookDetails.author || !bookDetails.isbn || !bookDetails.description || bookDetails.rating === 0 || !bookDetails.coverImage) {
      setAlert({ message: "All fields are required!", severity: "error" });
      return;
    }

    try {
      // Make an API call to save the book
      const response = await fetch("http://localhost:5000/api/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const data = await response.json();
      console.log("Book added successfully:", data);
      setAlert({ message: "Book added successfully:", severity: "success" });

    } catch (error) {
      setAlert({ message: error.message, severity: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">Add a New Book</h2>

        {/* Display Alert if there is an error */}
        {alert && (
          <Alert
            severity={alert.severity}
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <TextField
              label="Title"
              name="title"
              value={bookDetails.title}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
          </div>

          <div>
            <TextField
              label="Author"
              name="author"
              value={bookDetails.author}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
          </div>

          <div>
            <TextField
              label="ISBN"
              name="isbn"
              value={bookDetails.isbn}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
          </div>

          <div>
            <TextField
              label="Description"
              name="description"
              value={bookDetails.description}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              multiline
              rows={4}
            />
          </div>

          {/* Material UI Rating component for selecting the rating */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl text-orange-500 mb-2">Rating</h3>
            <Rating
              name="rating"
              value={bookDetails.rating}
              onChange={handleRatingChange}
              size="large"
            />
          </div>

          <div>
            <TextField
              label="Cover Image URL"
              name="coverImage"
              value={bookDetails.coverImage}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="warning"
            fullWidth
            size="large"
          >
            Add Book
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
