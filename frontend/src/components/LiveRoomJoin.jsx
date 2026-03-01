import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import RoomManager from '../utils/roomManager';

const LiveRoomJoin = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);
  const [joined, setJoined] = useState(false);

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // Handle joining room
  const handleJoinRoom = (e) => {
    e.preventDefault(); // IMPORTANT: Prevent page refresh
    setLoading(true);
    setError('');

    const user = getCurrentUser();
    if (!user) {
      setError('You must be logged in to join a room');
      setLoading(false);
      return;
    }

    if (!roomCode.trim()) {
      setError('Room code is required');
      setLoading(false);
      return;
    }

    if (!RoomManager.validateRoomCode(roomCode.toUpperCase())) {
      setError('Invalid room code format');
      setLoading(false);
      return;
    }

    // Create participant data with unique session ID
    const participantData = RoomManager.createParticipantData(user, 'participant');

    // Send join request
    socket.emit('join-room', { roomCode: roomCode.toUpperCase(), userData: participantData });
  };

  // Listen for room join response
  useEffect(() => {
    socket.on('room-joined', (data) => {
      setLoading(false);
      if (data.success) {
        setRoom(data.room);
        setJoined(true);
        setError('');
        sessionStorage.setItem('currentRoomCode', data.room.id);
      } else {
        setError(data.message || 'Failed to join room');
      }
    });

    socket.on('room-error', (data) => {
      setLoading(false);
      setError(data.message || 'An error occurred');
    });

    socket.on('participant-joined', (data) => {
      if (room && data.roomCode === room.id) {
        setRoom(prev => ({
          ...prev,
          participants: [...prev.participants, data.participant]
        }));
      }
    });

    socket.on('participant-left', (data) => {
      if (room && data.roomCode === room.id) {
        setRoom(prev => ({
          ...prev,
          participants: prev.participants.filter(p => p.id !== data.participantId)
        }));
      }
    });

    socket.on('quiz-started', (data) => {
      if (room && data.roomCode === room.id) {
        setRoom(prev => ({
          ...prev,
          status: 'active',
          quiz: data.quiz
        }));
        navigate(`/live-room/${room.id}`);
      }
    });

    // Cleanup
    return () => {
      socket.off('room-joined');
      socket.off('room-error');
      socket.off('participant-joined');
      socket.off('participant-left');
      socket.off('quiz-started');
    };
  }, [room, navigate]);

  // Handle leaving room
  const handleLeaveRoom = () => {
    if (room) {
      socket.emit('leave-room', { roomCode: room.id });
      setRoom(null);
      setJoined(false);
      sessionStorage.removeItem('currentRoomCode');
      navigate('/dashboard');
    }
  };

  // Get room status color
  const getRoomStatusColor = () => {
    if (!room) return 'text-gray-600';
    switch (room.status) {
      case 'waiting': return 'text-yellow-600';
      case 'active': return 'text-green-600';
      case 'completed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (!joined) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Join a Live Room</h1>
          
          <form onSubmit={handleJoinRoom} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-lg"
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'Join'}
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Enter the 6-digit room code provided by the host
              </p>
            </div>
          </form>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{room.name || 'Live Room'}</h1>
            <p className="text-gray-600">Room Code: <span className="font-mono font-bold">{room.id}</span></p>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Leave Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Your Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">Name:</span>
                  <span className="font-medium text-blue-900">{getCurrentUser()?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Email:</span>
                  <span className="font-medium text-blue-900">{getCurrentUser()?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Role:</span>
                  <span className="font-medium capitalize text-blue-900">{getCurrentUser()?.role || 'Participant'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Status:</span>
                  <span className="font-medium text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Room Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium capitalize ${getRoomStatusColor()}`}>
                    {room.status === 'waiting' ? 'Waiting for host to start' : room.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">
                    {RoomManager.formatParticipantCount(room.participants.length, room.settings.maxCapacity)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Host:</span>
                  <span className="font-medium">
                    {RoomManager.getHost(room.participants)?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(room.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Participants ({room.participants.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {room.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{participant.name}</span>
                    <span className="text-gray-500 capitalize">{participant.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRoomJoin;
