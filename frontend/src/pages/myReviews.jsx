import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Rating, CardMedia, Box, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";

function MyReviews() {
  const [reviews, setReviews] = useState([]); // Ensure initial state is an array
  const [expandedReviewId, setExpandedReviewId] = useState(null); // To track which review is expanded
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // Redirect to login if user is not logged in
      return;
    }

    console.log("Auth Token:", token);
    console.log("Username:", localStorage.getItem("userName"));

    const fetchReviews = async () => {
      const userName = localStorage.getItem("userName"); // Get the logged-in userName from local storage
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/user/${userName}`);
        const data = await response.json();

        // Check if the data is an array
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Unexpected data format:", data);
          setReviews([]); // Set to empty array if the data isn't in expected format
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [navigate]);

  const handleToggleExpand = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id); // Toggle expand/collapse for the clicked review
  };

  return (
    <Box className='p-6'>
      <Typography variant='h4' gutterBottom>
        My Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography variant='h6'>No reviews found</Typography>
      ) : (
        reviews.map((review) => (
          <Card key={review._id} className='mb-6 transition-all shadow-lg hover:shadow-xl'>
            <div className='flex p-4' onClick={() => handleToggleExpand(review._id)}>
              <CardMedia
                component='img'
                alt={review.book.title}
                image={review.book.image || "default-image.jpg"} // Ensure there's an image or fallback to default
              />
              <CardContent>
                <Typography variant='h6'>{review.book.title}</Typography>
                <Typography variant='subtitle1'>{review.book.author}</Typography>
                <Rating value={review.rating} readOnly />
              </CardContent>
            </div>

            <Collapse in={expandedReviewId === review._id} timeout='auto' unmountOnExit>
              <CardContent>
                <Typography variant='body1'>{review.reviewText}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))
      )}
    </Box>
  );
}

export default MyReviews;
