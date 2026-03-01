import { io } from 'socket.io-client';

// Socket.io configuration
const SOCKET_URL ='http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  // Initialize socket connection
  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: 5,
        autoconnect: false
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.connected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.connected = false;
      });
    }
    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
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
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
