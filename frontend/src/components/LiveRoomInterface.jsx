import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketService from '../utils/socket';
import RoomManager from '../utils/roomManager';
import RoomChat from './RoomChat';

const LiveRoomInterface = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  const [activeQuiz, setActiveQuiz] = useState(null);


  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect();
    const user = getCurrentUser();
    
    if (!user) {
      setError('You must be logged in to join the room');
      setLoading(false);
      return;
    }

    // Wait for socket to connect
    const checkConnection = () => {
      if (socket.connected) {
        setSocketConnected(true);
        setLoading(false);
        
        // Check if we were previously in this room
        const previousRoomCode = sessionStorage.getItem('currentRoomCode');
        const wasInRoom = previousRoomCode === roomCode;

        // Add error handling
        const handleError = (error) => {
          console.error('Socket error:', error);
          setError(error.message || 'Connection error');
        };

        // Listen for quiz start
        socketService.onQuizStarted((data) => {
          if (data.roomCode === roomCode) {
            setActiveQuiz(data.quiz);
            setQuizStarted(true);
            setTimeRemaining(30); 
            setCurrentQuestion(0);
            setAnswerSubmitted(false);
            setSelectedAnswer(null);
            setUserScore(0);
          }
        });


        // Listen for timer updates from host
        socketService.on('timer-update', (data) => {
          if (data.roomCode === roomCode) {
            setTimeRemaining(data.timeRemaining);
          }
        });

        // Listen for next question from host
        socketService.on('next-question', (data) => {
          if (data.roomCode === roomCode) {
            setCurrentQuestion(data.questionIndex);
            setTimeRemaining(30); // Reset to 30 seconds for each question
            setAnswerSubmitted(false);
            setSelectedAnswer(null);
          }
        });

        // Listen for answer submission
        socketService.onAnswerSubmitted((data) => {
          if (data.roomCode === roomCode) {
            console.log('Answer submitted:', data);
          }
        });

        // Set initial room state
        setRoom({
          id: roomCode,
          name: 'Live Quiz Room',
          participants: wasInRoom ? [] : [
            RoomManager.createParticipantData(user, 'participant'),
            RoomManager.createParticipantData({ id: 'host', name: 'Quiz Host' }, 'host')
          ],
          status: 'active',
          settings: { maxCapacity: 50 }
        });
      } else {
        // Retry connection after delay
        setTimeout(checkConnection, 500);
      }
    };

    // Start connection check
    setTimeout(checkConnection, 1000);

    return () => {
      socketService.off('quiz-started');
      socketService.off('timer-update');
      socketService.off('next-question');
      socketService.off('answer-submitted');
      socketService.off('participant-joined');
      socketService.off('participant-left');
      socketService.off('room-error');
    };
  }, [roomCode]);

  // Timer effect - REMOVED - Participants should NOT control timer
  // useEffect(() => {
  //   if (timeRemaining > 0 && quizStarted && !answerSubmitted) {
  //     const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
  //     return () => clearTimeout(timer);
  //   } else if (timeRemaining === 0 && !answerSubmitted) {
  //     // Case 2: Time expired - auto-submit and move to next question
  //     handleSubmitAnswer();
  //   }
  // }, [timeRemaining, quizStarted, answerSubmitted]);

  // Handle answer submission - ONLY submit, NO auto-move
  const handleSubmitAnswer = () => {
    if (!activeQuiz) return;
    const question = activeQuiz.questions[currentQuestion];
    if (!question) return;

    const isCorrect = selectedAnswer === question.correct;

    
    // Submit answer to backend
    socketService.submitAnswer({
      roomCode,
      answerData: {
        questionId: question.id,
        answer: selectedAnswer,
        correct: isCorrect,
        timeTaken: 30 - timeRemaining // Always use 30 seconds as base
      }
    });

    setAnswerSubmitted(true);
    setUserScore(userScore + (isCorrect ? 1 : 0));

    // REMOVED: Auto-move logic - Participants should NOT control question progression
    // setTimeout(() => {
    //   moveToNextQuestion();
    // }, 1000);
  };

  // REMOVED: moveToNextQuestion - Participants should NOT control question progression
  // const moveToNextQuestion = () => {
  //   if (currentQuestion < mockQuiz.questions.length - 1) {
  //     setCurrentQuestion(currentQuestion + 1);
  //     setTimeRemaining(30); // Reset to 30 seconds for next question
  //     setAnswerSubmitted(false);
  //     setSelectedAnswer(null);
  //   } else {
  //     // Quiz completed
  //     setQuizCompleted(true);
  //     setQuizStarted(false);
  //   }
  // };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  // REMOVED: handleNextQuestion - Participants should NOT control question progression
  // const handleNextQuestion = () => {
  //   if (currentQuestion < mockQuiz.questions.length - 1) {
  //     setCurrentQuestion(currentQuestion + 1);
  //     setTimeRemaining(30);
  //     setAnswerSubmitted(false);
  //     setSelectedAnswer(null);
  //   } else {
  //     // Quiz completed
  //     setQuizCompleted(true);
  //   }
  // };

  // Handle leaving room
  const handleLeaveRoom = () => {
    socketService.leaveRoom(roomCode);
    sessionStorage.removeItem('currentRoomCode');
    navigate('/dashboard/live-control');
  };

  // Handle next question (for UI feedback only - actual control is by host)
  const handleNextQuestion = () => {
    // This is just for UI feedback - participants cannot actually control question flow
    // The host controls the actual question progression
    if (currentQuestion < activeQuiz.questions.length - 1) {
      // Just update UI state for better user experience
      // The actual question change will come from host via socket
      setAnswerSubmitted(false);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      setQuizStarted(false);
    }

  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current question data
  const currentQuestionData = activeQuiz?.questions[currentQuestion];


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Room</h2>
          <p className="text-gray-600">Establishing connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/live-control')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room?.name || 'Live Room'}</h1>
              <p className="text-gray-600">Room Code: <span className="font-mono font-bold">{roomCode}</span></p>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Leave Room
            </button>
          </div>

          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Waiting for Quiz to Start</h2>
            <p className="text-gray-600 mb-6">
              The host will start the quiz shortly. Get ready!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* User Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Your Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Name:</span>
                    <span className="font-medium text-blue-900">{getCurrentUser()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Email:</span>
                    <span className="font-medium text-blue-900">{getCurrentUser()?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Role:</span>
                    <span className="font-medium capitalize text-blue-900">{getCurrentUser()?.role || 'Participant'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Status:</span>
                    <span className="font-medium text-green-600">Connected</span>
                  </div>
                </div>
              </div>
              
              {room && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Room Info</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Participants: {room.participants.length}/{room.settings.maxCapacity}</p>
                    <p>Host: {RoomManager.getHost(room.participants)?.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600 mb-4">Great job! Here are your results:</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {userScore}/{activeQuiz?.questions.length}
            </div>
            <p className="text-gray-600">
              Score: {Math.round((userScore / (activeQuiz?.questions.length || 1)) * 100)}%
            </p>
          </div>


          <div className="space-y-3">
            <button
              onClick={handleLeaveRoom}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{activeQuiz?.title}</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {activeQuiz?.questions.length}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden">
              <div className="text-center">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={`text-2xl font-bold ${timeRemaining < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
              <div className="text-center">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeRemaining < 10 ? 'bg-red-600' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${(timeRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-gray-900">{userScore}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / (activeQuiz?.questions.length || 1)) * 100}%` }}
            />

          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Section */}
          <div className="lg:col-span-2">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestionData.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answerSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answerSubmitted
                        ? index === currentQuestionData.correct
                          ? 'border-green-500 bg-green-50'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-50'

                          : 'border-gray-200 bg-gray-50'
                        : selectedAnswer === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answerSubmitted
                            ? index === currentQuestionData.correct
                              ? 'border-green-500 bg-green-500'
                              : index === selectedAnswer

                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-300'
                            : selectedAnswer === index
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {answerSubmitted && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              {index === currentQuestionData.correct ? (
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              ) : index === selectedAnswer ? (

                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              ) : null}
                            </svg>
                          )}
                          {!answerSubmitted && selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                      {answerSubmitted && index === currentQuestionData.correct && (
                        <span className="text-green-600 font-medium">Correct!</span>
                      )}
                      {answerSubmitted && index === selectedAnswer && index !== currentQuestionData.correct && (

                        <span className="text-red-600 font-medium">Wrong!</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Leave Room
              </button>

              {!answerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentQuestion < (activeQuiz?.questions.length || 0) - 1 ? 'Next Question' : 'See Results'}

                </button>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="h-96 lg:h-full">
              <RoomChat roomCode={roomCode} currentUser={getCurrentUser()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRoomInterface;
