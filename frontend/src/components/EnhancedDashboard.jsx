import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import CreateAIQuiz from './CreateAIQuiz';
import LiveQuizControl from './LiveQuizControl';
import AnalyticsReports from './AnalyticsReports';
import LiveRoomHost from './LiveRoomHost';
import LiveRoomJoin from './LiveRoomJoin';
import LiveRoomInterface from './LiveRoomInterface';

const EnhancedDashboard = () => {
  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // Profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard Header with User Info */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor your quiz performance and student engagement</p>
            </div>
            
            {/* User Info - Moved from Sidebar */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <span className="text-lg font-semibold text-gray-900 ml-2">
                  {getCurrentUser()?.name || 'User'}
                </span>
              </div>
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getCurrentUser()?.name ? getCurrentUser().name.charAt(0).toUpperCase() : ''}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {getCurrentUser()?.name ? getCurrentUser().name.charAt(0).toUpperCase() : ''}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{getCurrentUser()?.name || 'User'}</p>
                          <p className="text-xs text-gray-600">{getCurrentUser()?.email || 'user@example.com'}</p>
                          <p className="text-xs text-gray-600 capitalize">{getCurrentUser()?.role || 'User'}</p>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Edit Profile</a>
                        <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Settings</a>
                        <hr className="my-2" />
                        <button 
                          onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                          }}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded text-left"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/create-quiz" element={<CreateAIQuiz />} />
              <Route path="/live-control" element={<LiveQuizControl />} />
              <Route path="/analytics" element={<AnalyticsReports />} />
              <Route path="/reports" element={<AnalyticsReports />} />
              <Route path="/host-room" element={<LiveRoomHost />} />
              <Route path="/join-room" element={<LiveRoomJoin />} />
              <Route path="/live-room/:roomCode" element={<LiveRoomInterface />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
