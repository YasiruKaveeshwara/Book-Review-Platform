import React, { useState } from "react";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";

function AddBook() {
  const [showCoverImage, setShowCoverImage] = useState(false);
  const [coverImage, setCoverImage] = useState("");

  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    rating: 0.1,
    coverImage: "",
    reviews: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookDetails({ ...bookDetails, [name]: value });

    if (name === "coverImage") {
      const img = new Image();
      img.onload = () => {
        setCoverImage(value);
        setShowCoverImage(true);
      };
      img.onerror = () => {
          Swal.fire({
            icon: "error",
            title: "Invalid Image URL",
            text: "The provided cover image URL is not valid. Please enter a valid URL.",
          });
          setCoverImage("");
          setShowCoverImage(false);
      };
      img.src = value;
      setCoverImage(value);
      setShowCoverImage(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(bookDetails);

    if (!bookDetails.title || !bookDetails.author || !bookDetails.isbn || !bookDetails.description || !bookDetails.coverImage) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        Swal.fire({
          icon: "error",
          title: "Error adding book",
          text: errorData.message || "An error occurred while adding the book.",
        });
        throw new Error("Failed to add book");
      }

      Swal.fire({
        icon: "success",
        title: "Book added successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      setBookDetails({
        title: "",
        author: "",
        isbn: "",
        description: "",
        rating: 0.1,
        coverImage: "",
        reviews: [],
      });
      setCoverImage("");
      setShowCoverImage(false);
    } catch (error) {
      console.error("Error adding book:", error);
      Swal.fire({
        icon: "error",
        title: "Error adding book",
        text: "An error occurred while adding the book. Please try again later.",
      });
    }
  };

  return (
    <div className='flex items-center justify-center my-20  max-w-[1200px] mx-auto px-20'>
      <div className='px-20 '>
        <h2 className='mb-6 text-4xl font-bold text-center text-orange-500'>Add a New Book</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='flex'>
            {showCoverImage && coverImage && (
              <div className='container rounded-md border flex border-orangeYellow h-[275px] w-[300px] mr-20 p-2'>
                <img alt='Book cover' src={coverImage} />
              </div>
            )}

            <div className='w-full space-y-4'>
              <TextField
                label='Cover Image URL'
                name='coverImage'
                value={bookDetails.coverImage}
                onChange={handleChange}
                fullWidth
                variant='outlined'
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
                label='Title'
                name='title'
                value={bookDetails.title}
                onChange={handleChange}
                fullWidth
                variant='outlined'
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
                label='Author'
                name='author'
                value={bookDetails.author}
                onChange={handleChange}
                fullWidth
                variant='outlined'
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
                label='ISBN'
                name='isbn'
                value={bookDetails.isbn}
                onChange={handleChange}
                fullWidth
                variant='outlined'
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
          </div>

          <div>
            <TextField
              label='Description'
              name='description'
              value={bookDetails.description}
              onChange={handleChange}
              fullWidth
              variant='outlined'
              multiline
              rows={4}
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

          <div className='flex items-center mx-auto '>
            <button className='flex m-auto p-2 px-4 text-[white] rounded-md bg-orangeYellow font-semibold hover:shadow-lg ' type='submit'>
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;
