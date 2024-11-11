import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./css/login.css";
import Login from "./routes/Login";
import UserForm from "./routes/UserForm";
import RecoverPass from "./routes/RecoverPass";
import DashBoard from "./routes/DashBoard";
import Labs from "./routes/Labs";
import EditLab from "./routes/EditLab";
import LabForm from "./routes/LabForm"

function App() {
  // Autenticação para ver o DashBoard
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("jwt") !== null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/DashBoard" /> : <Login />} />
        <Route path="/Login" element={isAuthenticated ? <Navigate to="/DashBoard" /> : <Login />} />
        <Route path="/UserForm" element={<UserForm />} />
        <Route path="/RecoverPass" element={<RecoverPass />} />
        <Route path="/DashBoard" element={isAuthenticated ? <DashBoard /> : <Navigate to="/Login" />} />
        <Route path="/Labs" element={<Labs />} />
        <Route path="/edit-lab/:id" element={<EditLab />} />
        <Route path="/LabForm" element={<LabForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;
