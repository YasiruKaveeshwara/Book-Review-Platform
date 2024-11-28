# Book Management App

This is a Book Review web application that allows users to add, view books and write reviews on books . The app is built using React for the frontend and Node.js with Express for the backend. The frontend supports adding book details, including title, author, ISBN, description, rating, and a cover image. The backend is responsible for handling API requests and saving data to a MongoDB database.

## Features

- **Add a Book:** Users can add books to the system, including details like title, author, ISBN, description, rating, and cover image.
- **View Books:** View a list of books with their details.
- **Add Review:** users can add reviews on books
- **Edit Review:** Allows for editing reviews.
- **Delete Review:** Delete reviews from the system.
- **Filter Review:** Filter options for reviews.

## Tech Stack

- **Frontend:**
  - React
  - tailwind css (as main styles)
  - Sweet Alerts (for user friendly alerts)
  - Material UI (for UI components)
  - Axios (for API calls)
- **Backend:**

  - Node.js
  - Express
  - MongoDB (using Mongoose for ORM)
  - JWT (for authentication)

- **Cloud Storage for Images:**
  - Cloudinary & Amazon (as cloud storage for images)

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://https://github.com/YasiruKaveeshwara/Book-Review-Platform.git
   cd Book-Review-Platform
   ```

2. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the backend folder with the following environment variables:

   ```bash
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   ```

   if you want connect with test data email me kaveeshwaray@gmail.com for .env file

5. Start the backend server:
   ```bash
   npm run dev
   ```
   This will start the backend server on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend server:

   ```bash
   npm start
   ```

   This will start the frontend server on `http://localhost:3000`.

### Database Setup

Make sure you have a MongoDB database set up, either locally or using a service like MongoDB Atlas. You need to provide your database URI in the `.env` file for the backend.
