import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Rating, TextField, Alert, Divider, Switch, FormControlLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import OrbitProgress from "react-loading-indicators";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function BookDetails() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); // Initialize reviews as an empty array
  const [review, setReview] = useState("");
  const [userName, setuserName] = useState("Anonymous");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const storeduserName = localStorage.getItem("userName");

  // Fetch the book details
  useEffect(() => {
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
          setReviews([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();

    if (storeduserName) {
      setuserName(storeduserName);
    }
  }, [id, storeduserName]);

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => setShowAlert(false), 3000);
    }
    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [showAlert]);

  const handleToggleAnonymous = (event) => {
    setIsAnonymous(event.target.checked);
    if (event.target.checked) {
      setuserName("Anonymous");
      setShowWarning(true);
      setSuccess(false);
      setShowAlert(true);
    } else {
      setuserName(storeduserName);
      setShowWarning(false);
    }
  };

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
      setShowAlert(true);
      setSuccess("Review submitted successfully!");
      setReview("");
      setuserName(storeduserName);
      setRating(0);
    } catch (err) {
      setError(err.message); // Handle submission error
    }
  };

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <OrbitProgress variant='dotted' color='#FFA500' size='medium' className='flex-col' />
      </div>
    );
  }

  return (
    <div className=' max-w-[1200px] mx-auto mt-16'>
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
            <Rating
              value={book.rating}
              readOnly
              precision={0.1}
              sx={{
                color: "#ffff25",
              }}
            />
            <h1 className='ml-4 mt-[-1px]'>{book.rating.toFixed(1)}</h1> {/* Rating value in 1 decimal */}
          </h4>

          <h4 className='mt-4'>{book.description}</h4>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />
      {showAlert && success && (
        <Alert className='' severity='success'>
          {success}
        </Alert>
      )}
      {error && <Alert severity='error'>{error}</Alert>}
      {showAlert && showWarning && (
        <Alert severity='warning' className='mt-4'>
          You are submitting an anonymous review. You won't be able to delete or update it later.
        </Alert>
      )}
      <div component='form ' className='mx-20 ' onSubmit={handleReviewSubmit}>
        <h1 className='my-6 text-2xl' onClick={handleToggleForm}>
          Leave a Review <NavigateNextIcon className='ml-10 scale-150 text-orangeYellow' />
        </h1>
        <div
          className={`mt-4 pt-2 transition-all duration-500 ease-in-out ${
            isFormVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}>
          <div className='flex'>
            <TextField
              label='Your Name'
              className='flex w-[300px] border-orangeYellow'
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#FFA500", // Set the border color to orange
                  },
                  "&:hover fieldset": {
                    borderColor: "#FFA500", // Keep the same border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFA500", // Keep the same border color when focused
                  },
                },
              }}
            />

            <div className='ml-4 '>
              <FormControlLabel
                control={<Switch checked={isAnonymous} onChange={handleToggleAnonymous} name='anonymousSwitch' color='primary' />}
                label='Make this review anonymous'
              />
            </div>
          </div>

          <TextField
            label='Your Review'
            className='flex-col mt-10 w-[800px]'
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{
              marginTop: "10px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#FFA500", // Set the border color to orange
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500", // Keep the same border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500", // Keep the same border color when focused
                },
              },
            }}
          />

          <div className='mt-4'>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              sx={{
                color: "#ffff25", // Set the star color to yellow
              }}
            />
          </div>
          <button className='p-2 mt-2 text-[white] rounded-md bg-orangeYellow font-semibold' type='submit' onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>
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
