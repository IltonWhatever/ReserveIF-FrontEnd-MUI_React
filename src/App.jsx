import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./css/login.css";

import Login from "./routes/Login";
import UserForm from "./routes/UserForm";
import RecoverPass from "./routes/RecoverPass";
import DashBoard from "./routes/DashBoard";

function App() {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
      </head>
      <Router>
        
        <Routes>
          <Route path="/" element={<DashBoard/>}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/UserForm" element={<UserForm />} />
          <Route path="/RecoverPass" element={<RecoverPass/>}/>
          <Route path="/DashBoard" element={<DashBoard/>}/>
        </Routes>

      </Router>
      
    </>
  );
}

export default App;
