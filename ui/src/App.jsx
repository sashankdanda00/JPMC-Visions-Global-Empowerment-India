import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from "./components/Login.jsx";
import StudentAnalysis from './components/StudentAnalysis.jsx';
import Admin from './components/Admin.jsx'; // Assuming you have an Admin component
import CEAdminDashboard from "./components/CEAdminDashboard.jsx";
import StudentForm from "./components/StudentForm.jsx";

import Donate from "./components/Donate.jsx"; // Placeholder for Donate page
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentAnalysis />} /> {/* <-- Add this line */}
        <Route path="/student/:id" element={<StudentAnalysis />} />
        <Route path="/dashboard" element={<Admin />} /> {/* Fallback route */}
        {/* <Route path="/ce-dashboard" element={<Admin />} /> CE Admin route */}
        <Route path="/ce-dashboard" element={<CEAdminDashboard />} />
        <Route path="/add-student" element={<StudentForm />} />
        <Route path='/donate' element ={<Donate />} />{/* Placeholder for Donate page */}

      </Routes>
    </Router>
  );
};

export default App;
