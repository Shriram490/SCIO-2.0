require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/database");
const appRoutes = require("./routes/appRoutes");


// Set default environment variables if not set
process.env.PORT = process.env.PORT || '5000';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scio';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:63740"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:63740"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.send("SCIO Backend Server is running 🚀");
});

// Centralized app routes
app.use("/api", appRoutes);


// Store active rooms
const activeRooms = new Map();

// Store quiz state for each room
const roomQuizStates = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create room
  socket.on("create-room", (roomData) => {
    console.log("Creating room:", roomData);
    
    // Check if room already exists
    if (activeRooms.has(roomData.id)) {
      socket.emit("room-error", { message: "Room already exists" });
      return;
    }

    // Add room to active rooms
    activeRooms.set(roomData.id, {
      ...roomData,
      participants: [roomData.host],
      createdAt: new Date().toISOString()
    });

    // Join host to room
    socket.join(roomData.id);
    
    // Store custom session ID in socket for host
    socket.sessionId = roomData.host.id;
    socket.role = roomData.host.role;
    
    // Send success response
    socket.emit("room-created", {
      success: true,
      room: activeRooms.get(roomData.id)
    });

    console.log(`Room ${roomData.id} created by ${roomData.host.name}`);
  });

  // Join room
  socket.on("join-room", ({ roomCode, userData }) => {
    console.log(`User ${userData.name} joining room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    // Check capacity
    if (room.participants.length >= room.settings.maxCapacity) {
      socket.emit("room-error", { message: "Room is at maximum capacity" });
      return;
    }

    // Check if user already in room (check by original user ID, not session ID)
    const existingParticipant = room.participants.find(p => 
      p.originalUserId === userData.originalUserId || p.id === userData.id
    );
    
    if (existingParticipant) {
      // Remove the old participant and add the new one (session refresh)
      const updatedParticipants = room.participants.filter(p => p.id !== existingParticipant.id);
      const updatedRoom = {
        ...room,
        participants: [...updatedParticipants, userData]
      };
      
      activeRooms.set(roomCode, updatedRoom);
      socket.join(roomCode);

      // Store custom session ID in socket
      socket.sessionId = userData.id;
      socket.role = userData.role;

      // Notify all participants about the update
      io.to(roomCode).emit("participant-updated", {
        roomCode,
        participant: userData,
        removedParticipant: existingParticipant
      });

      socket.emit("room-joined", { success: true, room: updatedRoom });
      return;
    }

    // Check if late joining is allowed
    if (room.status === 'active' && !room.settings.allowLateJoin) {
      socket.emit("room-error", { message: "Late joining is not allowed for this room" });
      return;
    }

    // Add participant to room
    const updatedRoom = {
      ...room,
      participants: [...room.participants, userData]
    };
    
    activeRooms.set(roomCode, updatedRoom);
    socket.join(roomCode);

    // Store custom session ID in socket
    socket.sessionId = userData.id;
    socket.role = userData.role;

    // Notify all participants in room
    io.to(roomCode).emit("participant-joined", {
      roomCode,
      participant: userData
    });

    // Send success response to joining user
    socket.emit("room-joined", {
      success: true,
      room: updatedRoom
    });

    console.log(`User ${userData.name} joined room ${roomCode}`);
  });

  // Leave room
  socket.on("leave-room", ({ roomCode }) => {
    console.log(`User leaving room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) return;

    // Remove participant from room
    const updatedRoom = {
      ...room,
      participants: room.participants.filter(p => p.id !== socket.sessionId)
    };
    
    if (updatedRoom.participants.length === 0) {
      // Delete room if empty
      activeRooms.delete(roomCode);
    } else {
      activeRooms.set(roomCode, updatedRoom);
    }

    socket.leave(roomCode);

    // Notify remaining participants
    io.to(roomCode).emit("participant-left", {
      roomCode,
      participantId: socket.sessionId
    });

    socket.emit("room-left", { success: true });
    console.log(`User left room ${roomCode}`);
  });

  // Start quiz
  socket.on("start-quiz", ({ roomCode, quizData, currentQuestion, timeRemaining }) => {
    console.log(`Starting quiz in room: ${roomCode}`);
    console.log("Quiz data received:", quizData);
    console.log("Current question:", currentQuestion);
    console.log("Time remaining:", timeRemaining);
    
    const room = activeRooms.get(roomCode);
    if (!room) {
      console.log("❌ Room not found:", roomCode);
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    console.log("✅ Room found:", room.id);
    console.log("👥 Room participants:", room.participants.map(p => ({ id: p.id, name: p.name, role: p.role })));
    
    // Debug: Check socket session ID vs room host ID
    console.log("🔍 Socket session ID:", socket.sessionId);
    console.log("🔍 Room host ID:", room.hostId);

    // Check if user is host using session ID, NOT socket.id
    const user = room.participants.find(p => p.id === socket.sessionId);
    if (!user || user.role !== 'host') {
      console.log("❌ Only host can start the quiz");
      console.log("❌ User found:", !!user);
      console.log("❌ User role:", user?.role);
      socket.emit("room-error", { message: "Only host can start the quiz" });
      return;
    }

    console.log("✅ Host verified:", user.name);

    // Initialize quiz state for this room
    const quizState = {
      currentQuestionIndex: 0,
      timeRemaining: timeRemaining || 30,
      answers: [],
      isActive: true,
      timerInterval: null
    };
    
    roomQuizStates.set(roomCode, quizState);

    // Update room status
    const updatedRoom = {
      ...room,
      status: 'active',
      quiz: quizData,
      startedAt: new Date().toISOString()
    };
    
    activeRooms.set(roomCode, updatedRoom);

    // Start timer for this room
    startQuizTimer(roomCode);

    // Notify all participants with current question
    console.log("📡 Broadcasting quiz-started event to room:", roomCode);
    console.log("👥 Socket rooms before emission:", io.sockets.adapter.rooms);
    console.log("👥 Room participants:", room.participants);
    
    const quizEventData = {
      roomCode,
      quiz: quizData,
      currentQuestion: currentQuestion || quizData.questions[0],
      questionIndex: 0,
      timeRemaining: timeRemaining || 30
    };

    // Broadcast to ALL participants in the room (not just host)
    io.to(roomCode).emit("quiz-started", quizEventData);
    
    console.log("📡 Quiz-started event emitted to room:", roomCode);
    console.log("📡 Event data:", quizEventData);
    
    // Verify emission
    setTimeout(() => {
      console.log("👥 Socket rooms after emission:", io.sockets.adapter.rooms);
    }, 100);

    console.log(`✅ Quiz started in room ${roomCode}`);
  });

  // Next question
  socket.on("next-question", ({ roomCode, question, questionIndex, timeRemaining }) => {
    console.log(`Next question in room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    // Check if user is host
    const host = room.participants.find(p => p.role === 'host');
    if (!host || host.id !== socket.sessionId) {
      socket.emit("room-error", { message: "Only host can move to next question" });
      return;
    }

    // Update quiz state
    const quizState = roomQuizStates.get(roomCode);
    if (quizState) {
      quizState.currentQuestionIndex = questionIndex;
      quizState.timeRemaining = timeRemaining || 30;
      quizState.answers = []; // Reset answers for new question
    }

    // Clear existing timer
    if (quizState && quizState.timerInterval) {
      clearInterval(quizState.timerInterval);
    }

    // Start new timer
    startQuizTimer(roomCode);

    // Notify all participants
    io.to(roomCode).emit("next-question", {
      roomCode,
      question,
      questionIndex,
      timeRemaining: timeRemaining || 30
    });

    console.log(`Next question sent to room ${roomCode}`);
  });

  // Submit answer
  socket.on("submit-answer", ({ roomCode, questionIndex, selectedAnswer, correctAnswer, userId, userName, timestamp }) => {
    console.log(`Answer submitted in room: ${roomCode} by ${userName}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) return;

    const quizState = roomQuizStates.get(roomCode);
    if (!quizState) return;

    // Check if already answered this question
    const existingAnswer = quizState.answers.find(a => a.userId === userId && a.questionIndex === questionIndex);
    if (existingAnswer) {
      console.log(`User ${userName} already answered question ${questionIndex}`);
      return;
    }

    // Add answer to quiz state
    const answerData = {
      userId,
      userName,
      questionIndex,
      selectedAnswer,
      correctAnswer,
      timestamp,
      isCorrect: selectedAnswer === correctAnswer
    };

    quizState.answers.push(answerData);

    // Notify all participants (especially the host) about answer submission
    io.to(roomCode).emit("answer-submitted", {
      roomCode,
      answer: answerData
    });


    // Check if all participants have answered (excluding host)
    const participantCount = room.participants.filter(p => p.role !== 'host').length;
    const answeredCount = quizState.answers.filter(a => a.questionIndex === questionIndex).length;

    console.log(`Answers for question ${questionIndex}: ${answeredCount}/${participantCount}`);

    // If all participants have answered, we could notify the host but we will not auto-advance
    if (answeredCount >= participantCount) {
      console.log(`All participants answered for question ${questionIndex}`);
    }

    console.log(`Answer submitted by ${userName}: ${answerData.isCorrect ? 'Correct' : 'Wrong'}`);
  });

  // Quiz completed
  socket.on("quiz-completed", ({ roomCode, results }) => {
    console.log(`Quiz completed in room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) return;

    // Check if user is host
    const host = room.participants.find(p => p.role === 'host');
    if (!host || host.id !== socket.sessionId) {
      socket.emit("room-error", { message: "Only host can complete the quiz" });
      return;
    }

    // Clear quiz state
    const quizState = roomQuizStates.get(roomCode);
    if (quizState && quizState.timerInterval) {
      clearInterval(quizState.timerInterval);
    }
    roomQuizStates.delete(roomCode);

    // Update room status
    const updatedRoom = {
      ...room,
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    
    activeRooms.set(roomCode, updatedRoom);

    // Notify all participants
    io.to(roomCode).emit("quiz-completed", {
      roomCode,
      results
    });

    console.log(`Quiz completed in room ${roomCode}`);
  });

  // Timer update
  socket.on("timer-update", ({ roomCode, timeRemaining }) => {
    const quizState = roomQuizStates.get(roomCode);
    if (quizState) {
      quizState.timeRemaining = timeRemaining;
    }

    // Broadcast to all participants
    io.to(roomCode).emit("timer-sync", {
      roomCode,
      timeRemaining
    });
  });

  // Helper function to start quiz timer
  function startQuizTimer(roomCode) {
    const quizState = roomQuizStates.get(roomCode);
    if (!quizState) return;

    // Clear any existing timer
    if (quizState.timerInterval) {
      clearInterval(quizState.timerInterval);
    }

    // Start new timer
    quizState.timerInterval = setInterval(() => {
      quizState.timeRemaining--;

      // Broadcast timer update to all participants
      io.to(roomCode).emit("timer-sync", {
        roomCode,
        timeRemaining: quizState.timeRemaining
      });

      // Check if time is up
      if (quizState.timeRemaining <= 0) {
        clearInterval(quizState.timerInterval);
        quizState.timerInterval = null;
        // Auto-move has been disabled to allow host control
      }
    }, 1000);
  }

  // Send chat message
  socket.on("send-message", ({ roomCode, messageData }) => {
    console.log(`Chat message in room ${roomCode}:`, messageData);
    
    const room = activeRooms.get(roomCode);
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    // Verify user is in room
    const participant = room.participants.find(p => p.id === socket.sessionId || p.originalUserId === messageData.userId);
    if (!participant) {
      socket.emit("room-error", { message: "You are not in this room" });
      return;
    }

    // Create message object
    const chatMessage = {
      id: Date.now().toString(),
      userId: messageData.userId,
      userName: participant.name,
      userRole: participant.role,
      message: messageData.message,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    // Add message to room history
    if (!room.messages) {
      room.messages = [];
    }
    room.messages.push(chatMessage);

    // Keep only last 100 messages to prevent memory issues
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }

    // Update room
    activeRooms.set(roomCode, room);

    // Broadcast message to all participants in room
    io.to(roomCode).emit("new-message", {
      roomCode,
      message: chatMessage
    });

    console.log(`Message sent by ${participant.name} in room ${roomCode}`);
  });

  // Get chat history
  socket.on("get-chat-history", ({ roomCode }) => {
    console.log(`Chat history requested for room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    // Send chat history to requesting user
    socket.emit("chat-history", {
      roomCode,
      messages: room.messages || []
    });
  });

  // Typing indicators
  socket.on("typing-start", ({ roomCode }) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    const participant = room.participants.find(p => p.id === socket.sessionId);
    if (!participant) return;

    // Notify other participants that someone is typing
    socket.to(roomCode).emit("user-typing", {
      roomCode,
      userId: socket.sessionId || socket.id,
      userName: participant.name
    });
  });

  socket.on("typing-stop", ({ roomCode }) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    // Notify other participants that typing stopped
    socket.to(roomCode).emit("user-stop-typing", {
      roomCode,
      userId: socket.sessionId || socket.id
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and remove user from all rooms
    for (const [roomCode, room] of activeRooms.entries()) {
      const participantIndex = room.participants.findIndex(p => p.id === socket.sessionId);
      if (participantIndex !== -1) {
        const updatedRoom = {
          ...room,
          participants: room.participants.filter(p => p.id !== socket.sessionId)
        };
        
        if (updatedRoom.participants.length === 0) {
          activeRooms.delete(roomCode);
        } else {
          activeRooms.set(roomCode, updatedRoom);
        }

        // Notify remaining participants
        io.to(roomCode).emit("participant-left", {
          roomCode,
          participantId: socket.sessionId
        });
        
        break;
      }
    }
  });
});

const PORT = 5000; // Force port 5000

server.listen(PORT, () => {
  console.log(`🚀 SCIO Backend Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});