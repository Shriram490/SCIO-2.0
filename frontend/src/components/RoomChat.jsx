import React, { useState, useEffect, useRef } from 'react';
import socketService from '../utils/socket';

const RoomChat = ({ roomCode, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    // Request chat history when component mounts
    socketService.emit('get-chat-history', { roomCode });

    // Listen for new messages
    socketService.onNewMessage((data) => {
      if (data.roomCode === roomCode) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    // Listen for chat history
    socketService.onChatHistory((data) => {
      if (data.roomCode === roomCode) {
        setMessages(data.messages);
      }
    });

    // Listen for typing indicators
    socketService.onUserTyping((data) => {
      if (data.roomCode === roomCode && data.userId !== currentUser.id) {
        setTypingUsers(prev => {
          const exists = prev.find(u => u.userId === data.userId);
          if (!exists) {
            return [...prev, { userId: data.userId, userName: data.userName }];
          }
          return prev;
        });
      }
    });

    socketService.onUserStopTyping((data) => {
      if (data.roomCode === roomCode) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    });

    return () => {
      socketService.off('new-message');
      socketService.off('chat-history');
      socketService.off('user-typing');
      socketService.off('user-stop-typing');
    };
  }, [roomCode, currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageData = {
      userId: currentUser.id,
      message: newMessage.trim()
    };

    socketService.sendMessage(roomCode, messageData);
    setNewMessage('');
    setIsTyping(false);
    
    // Stop typing indicator
    socketService.emit('typing-stop', { roomCode });
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socketService.emit('typing-start', { roomCode });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.emit('typing-stop', { roomCode });
    }, 1000);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get user initials
  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Room Chat</h3>
        <p className="text-sm text-gray-600">Room Code: {roomCode}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${
                message.userId === currentUser.id ? 'order-2' : 'order-1'
              }`}>
                <div className={`flex items-end space-x-2 ${
                  message.userId === currentUser.id ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.userRole === 'host' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    <span className="text-xs font-semibold">
                      {getUserInitials(message.userName)}
                    </span>
                  </div>
                  <div>
                    <div className={`px-3 py-2 rounded-lg ${
                      message.userId === currentUser.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <div className={`flex items-center space-x-1 mt-1 ${
                      message.userId === currentUser.id ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-gray-500">{message.userName}</span>
                      {message.userRole === 'host' && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-1 rounded">👑</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">
                  {typingUsers.length === 1 
                    ? `${typingUsers[0].userName} is typing...`
                    : `${typingUsers.map(u => u.userName).join(', ')} are typing...`
                  }
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500">
          {newMessage.length}/500 characters
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
