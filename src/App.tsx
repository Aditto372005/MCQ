import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exam from './pages/Exam';
import Results from './pages/Results';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { ExamProvider } from './context/ExamContext';

function App() {
  return (
    <ExamProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ExamProvider>
  );
}

export default App;