import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import OrbitProgress from "react-loading-indicators";
import Swal from "sweetalert2";

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Error fetching books",
            text: "An error occurred while fetching books. Please try again later.",
          });
          throw new Error("Failed to fetch books.");
        }

        const data = await response.json();

        setBooks(data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error fetching books",
          text: "An error occurred while fetching books. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <OrbitProgress variant='dotted' color='#FFA500' size='medium' className='flex-col' />
      </div>
    );
  }

  return (
    <div className='p-4 max-w-[1200px] mx-auto mt-12'>
      <h1 className='mx-auto mb-6 text-4xl font-semibold text-center text-orangeYellow'>All Books</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {books.map((book) => (
          <div
            key={book._id}
            className='transition duration-300 border rounded-t-lg shadow-lg border-orangeYellow hover:shadow-orangeYellow hover:shadow-md '>
            <Link to={`/book/${book._id}`} className='block no-underline'>
              <div className='relative '>
                <img src={book.coverImage} alt={book.title} className='object-cover w-full h-56 p-4 rounded-t-lg shadow-md' />
              </div>
              <div className='p-4'>
                <h3 className='text-xl font-semibold text-gray-800 truncate'>{book.title}</h3>
                <p className='text-sm text-gray-600'>{book.author}</p>
              </div>
              <div className='top-0 left-0 flex p-2 text-sm text-white bg-black bg-opacity-50 rounded-tr-lg'>
                <div className='flex mt-[2px] mx-2 '>({book.rating.toFixed(1)})</div>
                <Rating
                  sx={{
                    color: "#ffff25",
                  }}
                  value={book.rating}
                  precision={0.1}
                  readOnly
                  className='flex'
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewBooks;
