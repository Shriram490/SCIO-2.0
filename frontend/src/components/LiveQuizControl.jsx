import React, { useState, useEffect } from 'react';

const LiveQuizControl = () => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock data for demonstration
  const mockQuizzes = [
    {
      id: 1,
      title: 'Mathematics Basics Quiz',
      subject: 'Mathematics',
      totalQuestions: 10,
      difficulty: 'Medium',
      status: 'ready'
    },
    {
      id: 2,
      title: 'Science Fundamentals',
      subject: 'Science',
      totalQuestions: 8,
      difficulty: 'Easy',
      status: 'completed'
    }
  ];

  const mockStudents = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'online',
      joinedAt: '10:30 AM',
      currentScore: 85,
      answersSubmitted: 5,
      totalTime: '12:45'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'answering',
      joinedAt: '10:31 AM',
      currentScore: 92,
      answersSubmitted: 7,
      totalTime: '14:20'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'offline',
      joinedAt: '10:28 AM',
      currentScore: 78,
      answersSubmitted: 3,
      totalTime: '08:15'
    }
  ];

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && isQuizActive) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isQuizActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setIsQuizActive(true);
    setTimeRemaining(quiz.totalQuestions * 60); // 1 minute per question
    setCurrentQuestion(1);
    setShowResults(false);
  };

  const pauseQuiz = () => {
    setIsQuizActive(false);
  };

  const resumeQuiz = () => {
    setIsQuizActive(true);
  };

  const endQuiz = () => {
    setIsQuizActive(false);
    setShowResults(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < activeQuiz.totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'answering': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Quiz Control</h1>
        <p className="text-gray-600 mt-2">Monitor and control active quiz sessions in real-time</p>
      </div>

      {!activeQuiz ? (
        /* Quiz Selection Screen */
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Quiz to Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockQuizzes.map(quiz => (
              <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.subject} • {quiz.difficulty}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quiz.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quiz.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{quiz.totalQuestions} questions</span>
                  <button
                    onClick={() => startQuiz(quiz)}
                    disabled={quiz.status !== 'ready'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      quiz.status === 'ready'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Quiz Control Screen */
        <div className="space-y-6">
          {/* Quiz Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{activeQuiz.title}</h2>
                <p className="text-gray-600">{activeQuiz.subject} • {activeQuiz.difficulty}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeRemaining)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Question</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentQuestion}/{activeQuiz.totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-3 mt-6">
              {!isQuizActive ? (
                <button
                  onClick={resumeQuiz}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resume Quiz
                </button>
              ) : (
                <button
                  onClick={pauseQuiz}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Pause Quiz
                </button>
              )}
              
              <button
                onClick={nextQuestion}
                disabled={currentQuestion >= activeQuiz.totalQuestions}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Question
              </button>
              
              <button
                onClick={previousQuestion}
                disabled={currentQuestion <= 1}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Question
              </button>
              
              <button
                onClick={endQuiz}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                End Quiz
              </button>
            </div>
          </div>

          {/* Students Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Students */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Active Students ({students.filter(s => s.status !== 'offline').length})
              </h3>
              <div className="space-y-3">
                {students.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        student.status === 'online' ? 'bg-green-500' :
                        student.status === 'answering' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-600">Joined {student.joinedAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Score: {student.currentScore}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Participants</span>
                  <span className="font-semibold text-gray-900">{students.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">Currently Online</span>
                  <span className="font-semibold text-green-700">
                    {students.filter(s => s.status !== 'offline').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Answering Now</span>
                  <span className="font-semibold text-blue-700">
                    {students.filter(s => s.status === 'answering').length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-semibold text-yellow-700">
                    {Math.round(students.reduce((acc, s) => acc + s.currentScore, 0) / students.length)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Avg. Time per Question</span>
                  <span className="font-semibold text-purple-700">
                    {Math.round(students.reduce((acc, s) => {
                      const [mins, secs] = s.totalTime.split(':').map(Number);
                      return acc + (mins * 60 + secs);
                    }, 0) / students.length / 5)}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-sm text-gray-700">Send Notification</span>
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">Extend Time</span>
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm text-gray-700">Show Results</span>
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-6 h-6 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                </svg>
                <span className="text-sm text-gray-700">Share Screen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveQuizControl;
