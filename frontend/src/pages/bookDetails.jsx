import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Rating, TextField, Alert, Divider } from "@mui/material";
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); // Initialize reviews as an empty array
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState("Anonymous");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch the book details and reviews from the backend using the book ID
    const fetchBookDetails = async () => {
      try {
        const bookResponse = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!bookResponse.ok) {
          throw new Error("Failed to fetch book details.");
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        const reviewResponse = await fetch(`http://localhost:5000/api/reviews/book/${id}`);
        const reviewData = await reviewResponse.json();
        // Ensure reviewData is an array before setting it
        if (Array.isArray(reviewData)) {
          setReviews(reviewData);
        } else {
          setReviews([]); // Set empty array if data isn't in the expected format
        }
      } catch (err) {
        setError(err.message); // Show error if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    // Submit review to backend
    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: id,
          userName: userName, // Replace with current user
          reviewText: review,
          rating: rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review.");
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setSuccess("Review submitted successfully!");
      setReview("");
      setUserName("Anonymous");
      setRating(0);
    } catch (err) {
      setError(err.message); // Handle submission error
    }
  };

  if (loading) {
    return (
      <Box className='flex items-center justify-center h-screen'>
        <Typography variant='h5'>Loading book details...</Typography>
      </Box>
    );
  }

  return (
    <div className=' max-w-[1200px] mx-auto mt-6'>
      {error && <Alert severity='error'>{error}</Alert>}

      <Typography variant='h3' className='text-center '>
        Book Details
      </Typography>

      <div className='flex mx-20 mt-10'>
        <img src={book.coverImage} alt={book.title} className='border rounded-lg max-h-80 border-orangeYellow' />
        <div className='flex-col ml-10'>
          <h2 className='mt-2 text-4xl font-semibold'>{book.title}</h2>
          <h4 className='mt-4 text-2xl'>by {book.author}</h4>
          <h4 className='mt-4 text-lg'>ISBN : {book.isbn}</h4>

          <h4 className='flex mt-4 text-lg'>
            <Rating value={book.rating} readOnly precision={0.1} />
            <h1 className='ml-4 mt-[-1px]'>{book.rating.toFixed(1)}</h1> {/* Rating value in 1 decimal */}
          </h4>

          <h4 className='mt-4'>{book.description}</h4>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />
      {success && <Alert severity='success'>{success}</Alert>}
      <div component='form ' className='mx-20 ' onSubmit={handleReviewSubmit}>
        <h1 className='my-6 text-2xl '>Leave a Review</h1>
        <TextField label='Your Name' className='flex-col w-[300px] ' value={userName} onChange={(e) => setUserName(e.target.value)} />
        <br />
        <TextField
          label='Your Review'
          className='flex-col mt-10 w-[800px]'
          multiline
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className='mt-4'>
          <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        </div>
        <button className='p-2 mt-2 text-[white] rounded-md bg-orangeYellow font-semibold' type='submit' onClick={handleReviewSubmit}>
          Submit Review
        </button>
      </div>
      <Divider sx={{ my: 2 }} />
      <h1 className='mx-20 mt-10 text-2xl'>Reviews</h1>

      {reviews.length === 0 ? (
        <Typography variant='body1'>No reviews yet for this book.</Typography>
      ) : (
        reviews.map((review) => (
          <Card className='mx-20' key={review._id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant='body2'>
                <strong>{review.userName}</strong>
              </Typography>
              <Rating value={review.rating} readOnly />
              <Typography variant='body2'>{review.reviewText}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default BookDetails;
