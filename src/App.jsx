import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./css/login.css";

import Login from "./routes/Login";
import VerticalMenu from "./components/Menu";
import UserForm from "./routes/UserForm";

function App() {
  return (
    <>
      <Router>
        
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/UserForm" element={<UserForm />} />
        </Routes>

      </Router>
      
    </>
  );
}

export default App;
