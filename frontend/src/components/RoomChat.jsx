import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';

const RoomChat = ({ roomCode, currentUser }) => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 🚫 Bad words filter
  const badWords = ["damn", "bastard"];

  const containsBadWords = (text) => {
    const lower = text.toLowerCase();
    return badWords.some(word => lower.includes(word));
  };

  // 🚫 Exam answer filter
  const isExamAnswer = (text) => {

    const lower = text.toLowerCase();

    const patterns = [
      /\boption\s*[abcd]\b/,
      /\banswer\s*(is|=)?\s*[abcd0-9]+\b/,
      /\bcorrect\s*answer\b/,
      /\bsolution\b/,
      /\bans\b/,
      /\b[a-d]\b/,
      /\b[1-4]\b/
    ];

    return patterns.some(pattern => pattern.test(lower));
  };

  // Initialize socket connection
  useEffect(() => {

    console.log('🔌 RoomChat - Socket connection check:', {
      socketExists: !!socket,
      socketConnected: socket?.connected,
      roomCode,
      currentUser: currentUser?.name
    });

    // Always set up listeners, even if not connected yet
    if (!socket) {
      console.log('❌ RoomChat - No socket instance');
      return;
    }

    // Connect if not connected
    if (!socket.connected) {
      console.log('❌ RoomChat - Socket not connected, attempting to connect...');
      socket.connect();
    }

    console.log('✅ RoomChat - Setting up listeners...');

    // Set up listeners regardless of connection state
    socket.emit('get-chat-history', { roomCode });

    socket.on('new-message', (data) => {
      if (data.roomCode === roomCode) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socket.on('chat-history', (data) => {
      if (data.roomCode === roomCode) {
        setMessages(data.messages);
      }
    });

    socket.on('user-typing', (data) => {

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

    socket.on('user-stop-typing', (data) => {

      if (data.roomCode === roomCode) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }

    });

    return () => {
      socket.off('new-message');
      socket.off('chat-history');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };

  }, [roomCode, currentUser]);

  // Retry connection if socket connects after initial setup
  useEffect(() => {
    if (socket && socket.connected && messages.length === 0) {
      console.log('🔄 RoomChat - Socket connected, retrying chat history...');
      socket.emit('get-chat-history', { roomCode });
    }
  }, [socket?.connected, roomCode]);

  // Auto scroll - DISABLED to prevent unwanted scrolling
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  // 🚀 Send message
  const handleSendMessage = (e) => {

    e.preventDefault();

    const messageText = newMessage.trim();

    if (!messageText) return;

    // 🚫 block answers
    if (isExamAnswer(messageText)) {
      alert("⚠️ Sharing answers in chat is not allowed.");
      return;
    }

    // 🚫 block bad words
    if (containsBadWords(messageText)) {
      alert("⚠️ Inappropriate language is not allowed.");
      return;
    }

    const messageData = {
      userId: currentUser.id,
      message: messageText
    };

    console.log('📤 RoomChat - Sending message:', {
      roomCode,
      messageData,
      socketConnected: socket.connected
    });

    socket.emit('send-message', { roomCode, messageData });

    setNewMessage('');
    setIsTyping(false);

    socket.emit('user-stop-typing', { roomCode });

  };

  // Typing indicator
  const handleInputChange = (e) => {

    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing-start', { roomCode });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {

      setIsTyping(false);
      socket.emit('user-stop-typing', { roomCode });

    }, 1000);

  };

  const formatTime = (timestamp) => {

    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

  };

  const getUserInitials = (name) => {

    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  };

  return (

    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Room Chat</h3>
        <p className="text-sm text-gray-600">Room Code: {roomCode}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 ? (

          <div className="text-center text-gray-500 py-8">
            No messages yet
          </div>

        ) : (

          messages.map((message) => (

            <div
              key={message.id}
              className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >

              <div className="max-w-xs lg:max-w-md">

                <div className="flex items-end space-x-2">

                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">

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

                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (

          <div className="text-sm text-gray-500">
            {typingUsers.map(u => u.userName).join(', ')} typing...
          </div>

        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">

        <form onSubmit={handleSendMessage} className="flex space-x-2">

          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            maxLength={500}
            className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>

        </form>

        <div className="text-xs text-gray-500 mt-1">
          {newMessage.length}/500 characters
        </div>

      </div>

    </div>

  );

};

export default RoomChat;