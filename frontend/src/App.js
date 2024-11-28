import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddBook from './pages/addBook';
import ViewBooks from './pages/viewBooks';
import BookDetails from './pages/bookDetails.jsx';
import Register from './pages/register';
import Login from './pages/login';
import Header from './components/header.jsx';
import ProtectedRoute from './components/protectedRoute.js'; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected Routes */}
        <Route path='/addBook' element={<ProtectedRoute element={<AddBook />} />} />
        <Route path='/' element={<ProtectedRoute element={<ViewBooks />} />} />
        <Route path='/book/:id' element={<ProtectedRoute element={<BookDetails />} />} />
      </Routes>
    </Router>
  );
}

export default App;
