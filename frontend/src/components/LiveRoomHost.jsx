import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import RoomManager from '../utils/roomManager';

const LiveRoomHost = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomSettings, setRoomSettings] = useState({
    roomName: '',
    quizTitle: '',
    allowLateJoin: true,
    showResults: true,
    shuffleQuestions: true
  });

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  // Handle room creation
  const handleCreateRoom = (e) => {
    e.preventDefault(); // IMPORTANT: Prevent page refresh
    setLoading(true);
    setError('');

    const user = getCurrentUser();
    if (!user) {
      setError('You must be logged in to create a room');
      setLoading(false);
      return;
    }

    if (!roomSettings.roomName.trim()) {
      setError('Room name is required');
      setLoading(false);
      return;
    }

    // Create host participant data
    const hostData = RoomManager.createParticipantData(user, 'host');
    
    // Create room data
    const roomData = RoomManager.createRoomData(hostData, {
      title: roomSettings.quizTitle || 'Live Quiz',
      hostId: user.id
    });

    // Update room settings
    roomData.settings = { ...roomData.settings, ...roomSettings };
    roomData.name = roomSettings.roomName;

    // Send room creation request
    socket.emit('create-room', roomData);
  };

  // Listen for room creation response
  useEffect(() => {
    socket.on('room-created', (data) => {
      setLoading(false);
      if (data.success) {
        setRoom(data.room);
        setError('');
      } else {
        setError(data.message || 'Failed to create room');
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
      socket.off('room-created');
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
      navigate('/dashboard');
    }
  };

  // Handle starting quiz
  const handleStartQuiz = () => {
    if (room) {
      const quizData = {
        title: roomSettings.quizTitle || 'Live Quiz',
        questions: [], // Add your questions here
        duration: 30 // minutes
      };
      socket.emit('start-quiz', { roomCode: room.id, quizData });
    }
  };

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Host a Live Room</h1>
          
          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={roomSettings.roomName}
                onChange={(e) => setRoomSettings({...roomSettings, roomName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={roomSettings.quizTitle}
                onChange={(e) => setRoomSettings({...roomSettings, quizTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quiz title"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roomSettings.allowLateJoin}
                  onChange={(e) => setRoomSettings({...roomSettings, allowLateJoin: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Allow participants to join after quiz starts</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roomSettings.showResults}
                  onChange={(e) => setRoomSettings({...roomSettings, showResults: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show results to participants</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={roomSettings.shuffleQuestions}
                  onChange={(e) => setRoomSettings({...roomSettings, shuffleQuestions: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Shuffle questions for each participant</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Room...' : 'Create Room'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-gray-600">Room Code: <span className="font-mono font-bold">{room.id}</span></p>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Leave Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Host Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{room.host.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{room.host.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium capitalize">{room.host.role}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Room Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{room.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">
                    {RoomManager.formatParticipantCount(room.participants.length, room.settings.maxCapacity)}
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

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Share Room Code</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={room.id}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(room.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                Share this code with participants to join your room
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Participants ({room.participants.length})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {room.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{participant.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      participant.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {participant.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {room.participants.length > 0 && (
              <button
                onClick={handleStartQuiz}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRoomHost;
