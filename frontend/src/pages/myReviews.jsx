import React, { useState, useEffect } from "react";
import { Typography, Rating, Collapse, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrbitProgress from "react-loading-indicators";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Swal from "sweetalert2";

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    bookName: "",
    rating: "",
    date: "",
  });

  const filteredReviews = reviews.filter((review) => {
    if (filter.bookName && !review.book.title.toLowerCase().includes(filter.bookName.toLowerCase())) {
      return false;
    }

    if (filter.rating && review.rating !== Number(filter.rating)) {
      return false;
    }

    if (filter.date && new Date(review.date).toLocaleDateString() !== new Date(filter.date).toLocaleDateString()) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const userName = localStorage.getItem("userName");
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/user/${userName}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Unexpected data format:", data);
          Swal.fire({
            icon: "error",
            title: "Error fetching reviews",
            text: "An error occurred while fetching reviews. Please try again later.",
          });

          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        Swal.fire({
          icon: "error",
          title: "Error fetching reviews",
          text: "An error occurred while fetching reviews. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [navigate]);

  const handleToggleExpand = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  const handleDeleteReview = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            Swal.fire("Error!", "An error occurred while deleting the review.", "error");
            throw new Error("Failed to delete review");
          }
          const data = await response.json();
          console.log("Review deleted:", data);
          setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Your review has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (err) {
          console.error("Error deleting review:", err);
          Swal.fire("Error!", "An error occurred while deleting the review.", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <OrbitProgress variant='dotted' color='#FFA500' size='medium' className='flex-col' />
      </div>
    );
  }

  return (
    <div className='p-6 max-w-[1200px] mx-auto'>
      <div className='flex'>
        <p className='items-center mx-auto mt-16 mb-6 text-4xl font-semibold text-orangeYellow'>My Reviews</p>
      </div>
      <div className='flex mx-auto space-x-6 max-w-[800px] mb-4'>
        <TextField
          label='Filter by Book Name'
          name='bookName'
          value={filter.bookName}
          onChange={handleFilterChange}
          fullWidth
          margin='normal'
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

        <TextField
          label='Filter by Date'
          name='date'
          type='date'
          value={filter.date}
          onChange={handleFilterChange}
          fullWidth
          margin='normal'
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
          InputLabelProps={{
            shrink: true,
          }}
        />
        <div className='flex my-auto'>
          <Rating
            name='rating'
            value={filter.rating}
            onChange={(event, newValue) => {
              setFilter((prevFilter) => ({
                ...prevFilter,
                rating: newValue,
              }));
            }}
            sx={{
              color: "#FFA500",
            }}
          />
          <p className='mx-4'>({filter.rating})</p>
        </div>
        <button
          onClick={() => setFilter({ bookName: "", rating: "", date: "" })}
          className='px-2 py-2 my-auto text-white bg-orange-500 rounded hover:bg-orange-600 w-[500px]'>
          Clear Filters
        </button>
      </div>
      {reviews.length === 0 ? (
        <Typography variant='h6'>No reviews found</Typography>
      ) : (
        filteredReviews.map((review) => (
          <div
            key={review._id}
            className='mb-6 transition-all border rounded-lg shadow-lg max-w-[800px] mx-auto shadow-orange hover:shadow-orangeYellow hover:shadow-md'
            title='Click to expand'>
            <div className='flex p-4' onMouseEnter={() => handleToggleExpand(review._id)}>
              <img alt={review.book.title} src={review.book.coverImage} className='h-24 border rounded max-w-[100px] border-orangeYellow shadow-md' />
              <div className='mt-2 ml-10 w-[500px]'>
                <Typography variant='h5'>{review.book.title}</Typography>
                <div className='flex'>
                  <Typography className='pt-4' variant='subtitle1'>
                    {review.book.author}
                  </Typography>
                  <Rating
                    className='pt-4 ml-20'
                    value={review.rating}
                    readOnly
                    sx={{
                      color: "#ffff25",
                    }}
                  />
                  <div className='pt-4 my-auto ml-4'>({review.rating})</div>
                </div>
              </div>
              <div className='flex my-auto '>
                <EditIcon className='my-auto text-orangeYellow' onClick={() => navigate(`/updateReview/${review._id}`)} titleAccess='Edit Review' />
                <DeleteForeverIcon className='my-auto ml-6 text-red-500' onClick={() => handleDeleteReview(review._id)} titleAccess='Delete Review' />
              </div>
            </div>

            <Collapse in={expandedReviewId === review._id} timeout='auto' unmountOnExit>
              <div className='mx-8 mb-4 '>
                <Typography variant='body1'>{review.reviewText}</Typography>
              </div>
            </Collapse>
          </div>
        ))
      )}
    </div>
  );
}

export default MyReviews;
