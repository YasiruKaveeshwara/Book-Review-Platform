import React from "react";
import { BrowserRouter as Router, Route, Switch, Routes } from "react-router-dom";
import AddBook from "./pages/AddBook";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/addBook' element={<AddBook />} />
      </Routes>
    </Router>
  );
}

export default App;
