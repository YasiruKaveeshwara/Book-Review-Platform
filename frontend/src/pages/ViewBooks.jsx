import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Rating, Grid, Alert } from "@mui/material"; // Material UI components
import { Link } from "react-router-dom"; // For linking to individual book details

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch books data from backend
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box className='flex justify-center items-center h-screen'>
        <Typography variant='h5'>Loading books...</Typography>
      </Box>
    );
  }

  return (
    <Box className='p-4'>
      <Typography variant='h4' gutterBottom>
        All Books
      </Typography>

      {error && <Alert severity='error'>{error}</Alert>}

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card className='shadow-lg'>
              <CardContent>
                <Typography variant='h6' component='div'>
                  {book.title}
                </Typography>
                <Typography variant='body2' color='textSecondary' gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant='body2' color='textSecondary' paragraph>
                  {book.description ? book.description.slice(0, 100) : "No description available."}...
                </Typography>

                <Rating name='read-only' value={book.rating} readOnly />
                <Link to={`/book/${book._id}`}>
                  <Typography variant='body2' color='primary'>
                    View Details
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ViewBooks;
