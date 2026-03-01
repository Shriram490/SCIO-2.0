// Room management utilities
export class RoomManager {
  // Generate random room code
  static generateRoomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Validate room code format
  static validateRoomCode(code) {
    const regex = /^[A-Z0-9]{6}$/;
    return regex.test(code);
  }

  // Check if room is at capacity
  static isRoomAtCapacity(participants, maxCapacity = 50) {
    return participants.length >= maxCapacity;
  }

  // Format participant count
  static formatParticipantCount(current, max = 50) {
    return `${current}/${max}`;
  }

  // Get room status based on participants
  static getRoomStatus(participants, maxCapacity = 50) {
    const count = participants.length;
    if (count === 0) return 'empty';
    if (count < maxCapacity * 0.5) return 'available';
    if (count < maxCapacity * 0.8) return 'filling';
    if (count < maxCapacity) return 'almost-full';
    return 'full';
  }

  // Get status color
  static getStatusColor(status) {
    switch (status) {
      case 'empty': return 'text-gray-500';
      case 'available': return 'text-green-600';
      case 'filling': return 'text-yellow-600';
      case 'almost-full': return 'text-orange-600';
      case 'full': return 'text-red-600';
      default: return 'text-gray-500';
    }
  }

  // Calculate room capacity percentage
  static getCapacityPercentage(participants, maxCapacity = 50) {
    return Math.round((participants.length / maxCapacity) * 100);
  }

  // Sort participants by join time
  static sortParticipantsByJoinTime(participants) {
    return participants.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
  }

  // Get host participant
  static getHost(participants) {
    return participants.find(p => p.role === 'host');
  }

  // Check if user is host
  static isHost(userId, participants) {
    const host = this.getHost(participants);
    return host && host.id === userId;
  }

  // Remove participant from room
  static removeParticipant(participants, participantId) {
    return participants.filter(p => p.id !== participantId);
  }

  // Add participant to room
  static addParticipant(participants, newParticipant) {
    // Check if already exists
    if (participants.find(p => p.id === newParticipant.id)) {
      return participants;
    }
    return [...participants, newParticipant];
  }

  // Create room data structure
  static createRoomData(hostData, quizData = null) {
    return {
      id: this.generateRoomCode(),
      host: hostData,
      participants: [hostData],
      quiz: quizData,
      status: 'waiting', // waiting, active, completed
      settings: {
        maxCapacity: 50,
        allowLateJoin: true,
        showResults: true,
        shuffleQuestions: true
      },
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null
    };
  }

  // Create participant data structure
  static createParticipantData(userData, role = 'participant') {
    return {
      id: userData.id || Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: role,
      joinedAt: new Date().toISOString(),
      status: 'online', // online, away, disconnected
      score: 0,
      answers: [],
      currentQuestion: null,
      completedAt: null
    };
  }

  // Validate room before joining
  static validateRoomForJoining(room, userData) {
    const errors = [];

    if (!room) {
      errors.push('Room not found');
      return errors;
    }

    if (room.status === 'completed') {
      errors.push('Room has been completed');
    }

    if (this.isRoomAtCapacity(room.participants, room.settings.maxCapacity)) {
      errors.push('Room is at maximum capacity');
    }

    if (room.participants.find(p => p.id === userData.id)) {
      errors.push('You are already in this room');
    }

    if (!room.settings.allowLateJoin && room.status === 'active') {
      errors.push('Late joining is not allowed for this room');
    }

    return errors;
  }

  // Calculate quiz statistics
  static calculateQuizStats(participants) {
    const completed = participants.filter(p => p.completedAt);
    const totalScore = completed.reduce((sum, p) => sum + (p.score || 0), 0);
    const avgScore = completed.length > 0 ? totalScore / completed.length : 0;

    return {
      totalParticipants: participants.length,
      completedParticipants: completed.length,
      completionRate: participants.length > 0 ? (completed.length / participants.length) * 100 : 0,
      averageScore: avgScore,
      topScore: completed.length > 0 ? Math.max(...completed.map(p => p.score || 0)) : 0
    };
  }
}

export default RoomManager;
