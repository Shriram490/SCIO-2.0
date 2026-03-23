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

    <div className="flex flex-col h-full bg-white border border-slate-200 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Room_Chat</h3>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Room_Code: {roomCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live_Link</span>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
            <div className="w-12 h-12 border-2 border-slate-200 flex items-center justify-center mb-4">
               <span className="text-xl font-black italic">!</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">No_Activity_Detected</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.userId === currentUser.id ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  {message.userName}
                </span>
                <span className="text-[8px] font-mono text-slate-300">
                  [{formatTime(message.timestamp)}]
                </span>
              </div>
              <div className={`px-4 py-2 border ${
                message.userId === currentUser.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-900 border-slate-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]'
              }`}>
                <p className="text-[11px] font-bold tracking-tight leading-relaxed">{message.message}</p>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
             <div className="flex gap-1">
               <div className="w-1 h-1 bg-indigo-400 animate-bounce" />
               <div className="w-1 h-1 bg-indigo-400 animate-bounce delay-100" />
               <div className="w-1 h-1 bg-indigo-400 animate-bounce delay-200" />
             </div>
             <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">
               {typingUsers.map(u => u.userName).join(', ')} is typing_
             </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="TYPE_MESSAGE..."
            maxLength={500}
            className="flex-1 bg-white border border-slate-200 px-4 py-3 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_1px_rgba(79,70,229,0.1)] transition-all placeholder:text-slate-300"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-slate-900 text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-50 transition-all hover:shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
          >
            Send_
          </button>
        </form>
        <div className="flex justify-between items-center mt-2 px-1">
           <p className="text-[8px] font-mono text-slate-400 opacity-60 uppercase">System_Chat_Link: Active</p>
           <p className="text-[8px] font-mono text-slate-400 opacity-60">
             {newMessage.length}/500
           </p>
        </div>
      </div>


    </div>

  );

};

export default RoomChat;