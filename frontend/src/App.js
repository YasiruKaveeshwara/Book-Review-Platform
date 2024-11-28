import React from "react";
import { BrowserRouter as Router, Route, Switch, Routes } from "react-router-dom";
import AddBook from "./pages/AddBook";
import ViewBooks from "./pages/ViewBooks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/addBook' element={<AddBook />} />
        <Route path='/' element={<ViewBooks />} />
      </Routes>
    </Router>
  );
}

export default App;
