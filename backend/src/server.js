const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const aiQuiz = require("../routes/aiQuiz");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("SCIO Backend Server is running 🚀");
});

// AI Quiz route
app.use("/api", aiQuiz);

// Store active rooms
const activeRooms = new Map();

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
      participants: room.participants.filter(p => p.id !== socket.id)
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
      participantId: socket.id
    });

    socket.emit("room-left", { success: true });
    console.log(`User left room ${roomCode}`);
  });

  // Start quiz
  socket.on("start-quiz", ({ roomCode, quizData }) => {
    console.log(`Starting quiz in room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    // Check if user is host
    const host = room.participants.find(p => p.role === 'host');
    if (!host || host.id !== socket.id) {
      socket.emit("room-error", { message: "Only host can start the quiz" });
      return;
    }

    // Update room status
    const updatedRoom = {
      ...room,
      status: 'active',
      quiz: quizData,
      startedAt: new Date().toISOString()
    };
    
    activeRooms.set(roomCode, updatedRoom);

    // Notify all participants
    io.to(roomCode).emit("quiz-started", {
      roomCode,
      quiz: quizData
    });

    console.log(`Quiz started in room ${roomCode}`);
  });

  // Submit answer
  socket.on("submit-answer", ({ roomCode, answerData }) => {
    console.log(`Answer submitted in room: ${roomCode}`);
    
    const room = activeRooms.get(roomCode);
    if (!room) return;

    // Find participant
    const participant = room.participants.find(p => p.id === answerData.participantId);
    if (!participant) return;

    // Update participant's answers
    participant.answers.push({
      questionId: answerData.questionId,
      answer: answerData.answer,
      timeTaken: answerData.timeTaken,
      submittedAt: new Date().toISOString()
    });

    // Calculate if answer is correct
    const question = room.quiz?.questions?.find(q => q.id === answerData.questionId);
    const isCorrect = question && question.correctAnswer === answerData.answer;

    if (isCorrect) {
      participant.score = (participant.score || 0) + 1;
    }

    // Update room
    activeRooms.set(roomCode, room);

    // Send confirmation to participant
    socket.emit("answer-submitted", {
      roomCode,
      participantId: answerData.participantId,
      correct: isCorrect
    });

    console.log(`Answer submitted by ${answerData.participantId}: ${isCorrect ? 'Correct' : 'Wrong'}`);
  });

  // Send chat message
  socket.on("send-message", ({ roomCode, messageData }) => {
    console.log(`Chat message in room ${roomCode}:`, messageData);
    
    const room = activeRooms.get(roomCode);
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    // Verify user is in room
    const participant = room.participants.find(p => p.id === messageData.userId);
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

    const participant = room.participants.find(p => p.id === socket.id);
    if (!participant) return;

    // Notify other participants that someone is typing
    socket.to(roomCode).emit("user-typing", {
      roomCode,
      userId: socket.id,
      userName: participant.name
    });
  });

  socket.on("typing-stop", ({ roomCode }) => {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    // Notify other participants that typing stopped
    socket.to(roomCode).emit("user-stop-typing", {
      roomCode,
      userId: socket.id
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and remove user from all rooms
    for (const [roomCode, room] of activeRooms.entries()) {
      const participantIndex = room.participants.findIndex(p => p.id === socket.id);
      if (participantIndex !== -1) {
        const updatedRoom = {
          ...room,
          participants: room.participants.filter(p => p.id !== socket.id)
        };
        
        if (updatedRoom.participants.length === 0) {
          activeRooms.delete(roomCode);
        } else {
          activeRooms.set(roomCode, updatedRoom);
        }

        // Notify remaining participants
        io.to(roomCode).emit("participant-left", {
          roomCode,
          participantId: socket.id
        });
        
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 SCIO Backend Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});