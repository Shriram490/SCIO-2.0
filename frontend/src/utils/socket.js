import socket from '../socket';

// Socket.io configuration
const SOCKET_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_SOCKET_URL) || 'http://localhost:5000';

// Global connection tracking
let globalConnected = false;
let connectionLock = false; // Prevent multiple connection attempts

class SocketService {
  constructor() {
    this.socket = socket;
    this.connected = false;
    this.connectionAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize socket connection
  connect() {
    // Prevent multiple connection attempts
    if (connectionLock) {
      console.log('Connection locked, waiting for existing connection...');
      return this.socket;
    }

    // Use global socket if already connected
    if (globalConnected) {
      console.log('Using existing global socket connection');
      this.connected = globalConnected;
      return this.socket;
    }

    if (this.connectionAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return null;
    }

    // Set connection lock
    connectionLock = true;
    this.connectionAttempts++;
    console.log(`Connection attempt ${this.connectionAttempts}`);

    // Connect the global socket
    this.socket.connect();

    // Update global references
    globalConnected = false;

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.connected = true;
      globalConnected = true;
      this.connectionAttempts = 0; // Reset on successful connection
      connectionLock = false; // Release lock
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected because:', reason);
      this.connected = false;
      globalConnected = false;
      connectionLock = false; // Release lock on disconnect
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
      globalConnected = false;
      connectionLock = false; // Release lock on error
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
      // Clear global references
      globalConnected = false;
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if connected
  isConnected() {
    return this.connected;
  }

  // Room management methods
  createRoom(roomData) {
    if (this.socket) {
      this.socket.emit('create-room', roomData);
    }
  }

  joinRoom(roomCode, userData) {
    if (this.socket) {
      this.socket.emit('join-room', { roomCode, userData });
    }
  }

  leaveRoom(roomCode) {
    if (this.socket) {
      this.socket.emit('leave-room', { roomCode });
    }
  }

  // Quiz control methods
  startQuiz(roomCode, quizData) {
    if (this.socket) {
      this.socket.emit('start-quiz', { roomCode, quizData });
    }
  }

  submitAnswer(roomCode, answerData) {
    if (this.socket) {
      this.socket.emit('submit-answer', { roomCode, answerData });
    }
  }

  // Chat methods
  sendMessage(roomCode, messageData) {
    if (this.socket) {
      this.socket.emit('send-message', { roomCode, messageData });
    }
  }

  getChatHistory(roomCode) {
    if (this.socket) {
      this.socket.emit('get-chat-history', { roomCode });
    }
  }

  startTyping(roomCode) {
    if (this.socket) {
      this.socket.emit('typing-start', { roomCode });
    }
  }

  stopTyping(roomCode) {
    if (this.socket) {
      this.socket.emit('typing-stop', { roomCode });
    }
  }

  // Event listeners
  onRoomCreated(callback) {
    if (this.socket) {
      this.socket.on('room-created', callback);
    }
  }

  onRoomJoined(callback) {
    if (this.socket) {
      this.socket.on('room-joined', callback);
    }
  }

  onRoomLeft(callback) {
    if (this.socket) {
      this.socket.on('room-left', callback);
    }
  }

  onParticipantJoined(callback) {
    if (this.socket) {
      this.socket.on('participant-joined', callback);
    }
  }

  onParticipantLeft(callback) {
    if (this.socket) {
      this.socket.on('participant-left', callback);
    }
  }

  onQuizStarted(callback) {
    if (this.socket) {
      this.socket.on('quiz-started', callback);
    }
  }

  onAnswerSubmitted(callback) {
    if (this.socket) {
      this.socket.on('answer-submitted', callback);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onChatHistory(callback) {
    if (this.socket) {
      this.socket.on('chat-history', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onUserStopTyping(callback) {
    if (this.socket) {
      this.socket.on('user-stop-typing', callback);
    }
  }

  onRoomError(callback) {
    if (this.socket) {
      this.socket.on('room-error', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Generic emit method
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
