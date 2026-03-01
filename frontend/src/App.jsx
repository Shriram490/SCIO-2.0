import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AISection from './components/AISection';
import Teachers from './components/Teachers';
import Students from './components/Students';
import Footer from './components/Footer';
import Login from './components/Login';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import EnhancedDashboard from './components/EnhancedDashboard';
import CreateAIQuiz from './components/CreateAIQuiz';
import socket from './socket';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  // Global socket connection management
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <Features />
              <AISection />
              <Teachers />
              <Students />
              <Footer />
            </>
          } />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <EnhancedDashboard />
            </ProtectedRoute>
          } />
          
          {/* AI Quiz Creation Route */}
          <Route path="/create-quiz" element={
            <ProtectedRoute>
              <CreateAIQuiz />
            </ProtectedRoute>
          } />
          
          {/* Legacy dashboard route for compatibility */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <EnhancedDashboard />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
