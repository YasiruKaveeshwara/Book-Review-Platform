import React, { useState, useEffect } from "react";
import { Typography, Rating, TextField, Divider, Switch, FormControlLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import OrbitProgress from "react-loading-indicators";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Swal from "sweetalert2";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState("Anonymous");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const storedUserName = localStorage.getItem("userName");

  // Fetch the book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookResponse = await fetch(`http://localhost:5000/api/books/${id}`);
        if (!bookResponse.ok) {
          Swal.fire({
            icon: "error",
            title: "Error fetching book details",
            text: "An error occurred while fetching book details. Please try again later.",
          });

          throw new Error("Failed to fetch book details.");
        }
        const bookData = await bookResponse.json();
        setBook(bookData);

        const reviewResponse = await fetch(`http://localhost:5000/api/reviews/book/${id}`);
        const reviewData = await reviewResponse.json();
        if (Array.isArray(reviewData)) {
          setReviews(reviewData);
        } else {
          setReviews([]);
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error fetching book details",
          text: "An error occurred while fetching book details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();

    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [id, storedUserName]);

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => setShowAlert(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleToggleAnonymous = (event) => {
    if (event.target.checked) {
      Swal.fire({
        title: "Are you sure?",
        text: "If you publish this review as anonymous, you won't be able to update or delete it later.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FFA500",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, make it anonymous",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsAnonymous(true);
          setUserName("Anonymous");
        } else {
          setIsAnonymous(false);
        }
      });
    } else {
      setIsAnonymous(false);
      setUserName(storedUserName);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: id,
          userName: userName, 
          reviewText: review,
          rating: rating,
        }),
      });

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error submitting review",
          text: "An error occurred while submitting your review. Please try again later.",
        });

        throw new Error("Failed to submit review.");
      }

      Swal.fire({
        icon: "success",
        title: "Review submitted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setReview("");
      setUserName(storedUserName);
      setRating(0);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error submitting review",
        text: "An error occurred while submitting your review. Please try again later.",
      });
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
    <div className=' max-w-[1200px] mx-auto my-20 '>
      <h1 className='text-4xl font-bold text-center text-orangeYellow'>Book Details</h1>

      <div className='flex mx-20 mt-10'>
        <img src={book.coverImage} alt={book.title} className='border rounded-lg max-h-80 border-orangeYellow' />
        <div className='flex-col mt-[-15px] ml-10'>
          <h1 className='mt-2 text-3xl font-semibold'>{book.title}</h1>
          <h1 className='mt-4 text-xl'>by {book.author}</h1>
          <h1 className='mt-4 text-lg'>ISBN : {book.isbn}</h1>

          <h4 className='flex mt-4 text-lg'>
            <Rating
              value={book.rating}
              readOnly
              precision={0.1}
              sx={{
                color: "#ffff25",
              }}
            />
            <h1 className='ml-4 mt-[-1px]'>{book.rating.toFixed(1)}</h1>
          </h4>

          <h4 className='mt-4'>{book.description}</h4>
        </div>
      </div>

      <Divider sx={{ my: 2 }} />

      <div component='form ' className='mx-20 ' onSubmit={handleReviewSubmit}>
        <h1 className='my-6 text-2xl text-orangeYellow' onMouseEnter={handleToggleForm}>
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
              onChange={(e) => setUserName(e.target.value)}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#FFA500", 
                  },
                  "&:hover fieldset": {
                    borderColor: "#FFA500", 
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFA500", 
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
                  borderColor: "#FFA500",
                },
                "&:hover fieldset": {
                  borderColor: "#FFA500",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFA500",
                },
              },
            }}
          />

          <div className='mt-4'>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              sx={{
                color: "#ffff25",
              }}
            />
          </div>
          <button className='p-2 mt-2 text-[white] rounded-md bg-orangeYellow font-semibold' type='submit' onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>
      </div>
      <Divider sx={{ my: 2 }} />

      <h1 className='mx-20 mt-6 text-2xl text-orangeYellow'>Reviews</h1>
      {reviews.length === 0 ? (
        <div className='mt-4 mb-10 mx-52'>
          <Typography className='mx-auto' variant='body1'>
            No reviews yet for this book.
          </Typography>
        </div>
      ) : (
        reviews.map((review) => (
          <div className='mt-4 mx-20 border rounded-md max-w-[800px] p-4 shadow-lg border-orangeYellow ' key={review._id} sx={{ my: 2 }}>
            <div className='flex'>
              <h1 className='ml-2'>
                <strong>{review.userName}</strong>
              </h1>
              <Rating
                value={review.rating}
                readOnly
                className='ml-36'
                sx={{
                  color: "#ffff25",
                }}
              />
              <p className='ml-4'>({review.rating})</p>
            </div>
            <p className='mt-2 ml-2'>{review.reviewText}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookDetails;
