import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signin from "./components/Signin";
import Dashboard from "./components/Dashboard";
import LiveRoomHost from "./components/LiveRoomHost";
import LiveRoomJoin from "./components/LiveRoomJoin";
import EditProfile from "./components/EditProfile";
import socket from "./socket";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
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
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Features />
                <Footer />
              </>
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Room Routes */}
          <Route
            path="/host-room"
            element={
              <ProtectedRoute>
                <LiveRoomHost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/join-room"
            element={
              <ProtectedRoute>
                <LiveRoomJoin />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
