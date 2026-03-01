// Room management utilities for frontend

// Generate random room code
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Validate room code format
export const validateRoomCode = (code) => {
  return /^[A-Z0-9]{6}$/.test(code);
};

// Create participant data object
export const createParticipantData = (user, role = 'participant') => {
  // Always generate a unique session ID to prevent collisions
  const uniqueId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${role}`;
  
  return {
    id: uniqueId,
    name: user.name || 'Anonymous User',
    email: user.email || '',
    role: role, // 'host' or 'participant'
    originalUserId: user.id, // Keep original user ID for reference
    score: 0,
    answers: [],
    joinedAt: new Date().toISOString()
  };
};

// Create room data object
export const createRoomData = (host, options = {}) => {
  return {
    id: generateRoomCode(),
    host: host,
    title: options.title || 'Live Quiz',
    hostId: host.id,
    participants: [host],
    status: 'waiting',
    settings: {
      maxCapacity: options.maxCapacity || 50,
      allowLateJoin: options.allowLateJoin !== false,
      quizDuration: options.quizDuration || 30,
      showResults: options.showResults !== false,
      ...options.settings
    },
    createdAt: new Date().toISOString()
  };
};

// Format participant count with capacity
export const formatParticipantCount = (current, max) => {
  return `${current}/${max}`;
};

// Add participant to room
export const addParticipant = (participants, newParticipant) => {
  // Check if participant already exists
  const exists = participants.find(p => p.id === newParticipant.id);
  if (exists) {
    return participants;
  }
  
  return [...participants, newParticipant];
};

// Remove participant from room
export const removeParticipant = (participants, participantId) => {
  return participants.filter(p => p.id !== participantId);
};

// Get host from participants
export const getHost = (participants) => {
  return participants.find(p => p.role === 'host');
};

// Check if room is at capacity
export const isRoomFull = (participants, maxCapacity) => {
  return participants.length >= maxCapacity;
};

// Get room status
export const getRoomStatus = (room) => {
  if (!room) return 'unknown';
  
  if (room.status === 'active') {
    return 'active';
  } else if (room.status === 'completed') {
    return 'completed';
  } else {
    return 'waiting';
  }
};

// Calculate participant score
export const calculateScore = (answers, questions) => {
  let score = 0;
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.answer) {
      score++;
    }
  });
  return score;
};

// Format room duration
export const formatDuration = (startTime, endTime = null) => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const duration = Math.floor((end - start) / 1000); // seconds
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Default room settings
export const DEFAULT_ROOM_SETTINGS = {
  maxCapacity: 50,
  allowLateJoin: true,
  quizDuration: 30, // minutes
  showResults: true
};

// Export all functions as default object
const RoomManager = {
  generateRoomCode,
  validateRoomCode,
  createParticipantData,
  createRoomData,
  formatParticipantCount,
  addParticipant,
  removeParticipant,
  getHost,
  isRoomFull,
  getRoomStatus,
  calculateScore,
  formatDuration,
  DEFAULT_ROOM_SETTINGS
};

export default RoomManager;
