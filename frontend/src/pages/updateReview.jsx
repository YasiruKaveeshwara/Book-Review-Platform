import React, { useState, useEffect } from "react";
import { TextField, Rating } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function UpdateReview() {
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();
  const { reviewId } = useParams();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`);
        const data = await response.json();

        if (data) {
          setReview(data.reviewText);
          setUserName(data.userName);
          setIsAnonymous(data.isAnonymous);
          setRating(data.rating);
        }
      } catch (err) {
        console.error("Error fetching review:", err);
        Swal.fire({
          icon: "error",
          title: "Error fetching review",
          text: "An error occurred while fetching the review. Please try again later.",
        });
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isAnonymous) {
        setUserName("Anonymous");
      }
      const updatedReview = {
        reviewText: review,
        userName: userName,
        rating: rating,
        isAnonymous: isAnonymous,
      };

      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReview),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Review updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/myReviews`);
      } else {
        console.error("Error updating review:", data);
        Swal.fire({
          icon: "error",
          title: "Error updating review",
          text: "An error occurred while updating the review. Please try again later.",
        });
      }
    } catch (err) {
      console.error("Error during submission:", err);
      Swal.fire({
        icon: "error",
        title: "Error updating review",
        text: "An error occurred while updating the review. Please try again later.",
      });
    }
  };

  return (
    <div className='mx-20'>
      <form onSubmit={handleReviewSubmit}>
        <h1 className='mt-20 text-2xl'>Update Your Review</h1>
        <div className='my-10 '>
          <TextField
            label='Your Name'
            className=' w-[300px] border-orangeYellow'
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
        </div>
        <div className='flex-col'>
          <TextField
            label='Your Review'
            className=' mt-10 w-[800px]'
            multiline
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
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
          <div className='my-4'>
            <Rating
              className=''
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              sx={{
                color: "#ffff25",
              }}
            />
          </div>

          <button className='p-2 mt-2 text-[white] rounded-md bg-orangeYellow font-semibold' type='submit'>
            Update Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateReview;
