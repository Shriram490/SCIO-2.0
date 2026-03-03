import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import socket from "../socket";
import RoomManager from "../utils/roomManager";

const LiveRoomHost = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomSettings, setRoomSettings] = useState({
    roomName: "",
    quizTitle: "",
    allowLateJoin: true,
    showResults: true,
    shuffleQuestions: true,
  });

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [quizResults, setQuizResults] = useState([]);

  // Static quiz questions
  const quizQuestions = [
    {
      id: 1,
      section: "HTML",
      question: "What is the correct semantic tag for navigation links?",
      options: ["<div>", "<nav>", "<section>", "<aside>"],
      correct: 1,
    },
    {
      id: 2,
      section: "HTML",
      question: "Which attribute is used to open a link in a new tab?",
      options: [
        'href="_blank"',
        'target="_new"',
        'target="_blank"',
        'newtab="true"',
      ],
      correct: 2,
    },
    {
      id: 3,
      section: "CSS",
      question: "What does position: relative; do?",
      options: [
        "Removes element from document flow",
        "Positions element relative to its normal position",
        "Fixes element to screen",
        "Aligns element to parent center",
      ],
      correct: 1,
    },
    {
      id: 4,
      section: "CSS",
      question: "Which CSS property is used to make a website responsive?",
      options: ["float", "media queries", "z-index", "display: block"],
      correct: 1,
    },
    {
      id: 5,
      section: "CSS",
      question: "What will flex: 1; do inside a flex container?",
      options: [
        "Makes element invisible",
        "Takes equal available space",
        "Fixes width to 1px",
        "Moves element to top",
      ],
      correct: 1,
    },
    {
      id: 6,
      section: "JavaScript",
      question: "What is the output?\n\nconsole.log(typeof null);",
      options: ['"null"', '"object"', '"undefined"', '"string"'],
      correct: 1,
    },
    {
      id: 7,
      section: "JavaScript",
      question: "Which method converts JSON string to JavaScript object?",
      options: [
        "JSON.stringify()",
        "JSON.parse()",
        "JSON.convert()",
        "JSON.object()",
      ],
      correct: 1,
    },
    {
      id: 8,
      section: "JavaScript",
      question: "What is a Promise in JavaScript?",
      options: [
        "A loop",
        "A CSS feature",
        "An object representing async operation",
        "A database",
      ],
      correct: 2,
    },
    {
      id: 9,
      section: "Backend & Full Stack",
      question: 'Which status code means "Not Found"?',
      options: ["200", "201", "404", "500"],
      correct: 2,
    },
    {
      id: 10,
      section: "Backend & Full Stack",
      question: "In MongoDB, which method is used to find all documents?",
      options: ["findAll()", "get()", "find()", "select()"],
      correct: 2,
    },
  ];

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  // Connect socket when component mounts
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected in LiveRoomHost");
    }

    return () => {
      // Don't disconnect here as other components might need it
    };
  }, []);

  // Handle room creation
  const handleCreateRoom = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = getCurrentUser();
    if (!user) {
      setError("You must be logged in to create a room");
      setLoading(false);
      return;
    }

    if (!roomSettings.roomName.trim()) {
      setError("Room name is required");
      setLoading(false);
      return;
    }

    const hostData = RoomManager.createParticipantData(user, "host");
    const roomData = RoomManager.createRoomData(hostData, {
      title: roomSettings.quizTitle || "Live Quiz",
      hostId: user.id,
    });

    roomData.settings = { ...roomData.settings, ...roomSettings };
    roomData.name = roomSettings.roomName;

    socket.emit("create-room", roomData);
  };

  // Listen for room creation response
  useEffect(() => {
    socket.on("room-created", (data) => {
      setLoading(false);
      if (data.success) {
        setRoom(data.room);
        setError("");
      } else {
        setError(data.message || "Failed to create room");
      }
    });

    socket.on("room-error", (data) => {
      setLoading(false);
      setError(data.message || "An error occurred");
    });

    socket.on("participant-joined", (data) => {
      if (room && data.roomCode === room.id) {
        setRoom((prev) => ({
          ...prev,
          participants: [...prev.participants, data.participant],
        }));
      }
    });

    socket.on("participant-left", (data) => {
      if (room && data.roomCode === room.id) {
        setRoom((prev) => ({
          ...prev,
          participants: prev.participants.filter(
            (p) => p.id !== data.participantId,
          ),
        }));
      }
    });

    socket.on("quiz-started", (data) => {
      if (room && data.roomCode === room.id) {
        setRoom((prev) => ({
          ...prev,
          status: "active",
          quiz: data.quiz,
        }));
        // Remove navigation - host should stay on current page
      }
    });

    return () => {
      socket.off("room-created");
      socket.off("room-error");
      socket.off("participant-joined");
      socket.off("participant-left");
      socket.off("quiz-started");
    };
  }, [room, navigate]);

  const handleLeaveRoom = () => {
    if (room) {
      socket.emit("leave-room", { roomCode: room.id });
      setRoom(null);
      navigate("/dashboard");
    }
  };

  const handleStartQuiz = () => {
    if (room) {
      const quizData = {
        title: roomSettings.quizTitle || "Web Development Quiz 5",
        questions: quizQuestions,
        duration: 30,
        currentQuestionIndex: 0,
        timeRemaining: 30,
      };

      console.log("🚀 Starting quiz with data:", quizData);
      console.log("📡 Emitting start-quiz event to room:", room.id);

      setQuizActive(true);
      setCurrentQuestionIndex(0);
      setTimeRemaining(30);

      socket.emit("start-quiz", {
        roomCode: room.id,
        quizData,
        currentQuestion: quizQuestions[0],
        timeRemaining: 30,
      });

      console.log("✅ Quiz start event emitted");
    }
  };

  // Timer effect for quiz questions - Host controls timer locally
  useEffect(() => {
    if (!quizActive) return;

    if (timeRemaining <= 0) {
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Emit timer update to participants
        socket.emit("timer-update", {
          roomCode: room?.id,
          timeRemaining: newTime,
        });

        return newTime;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [quizActive, timeRemaining, room]);

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeRemaining(30);

      const nextQuestion = quizQuestions[nextIndex];
      socket.emit("next-question", {
        roomCode: room?.id,
        question: nextQuestion,
        questionIndex: nextIndex,
        timeRemaining: 30,
      });
    } else {
      // Quiz completed
      setQuizActive(false);
      socket.emit("quiz-completed", {
        roomCode: room?.id,
        results: quizResults,
      });
    }
  };

  // Listen for quiz-related events
  useEffect(() => {
    socket.on("answer-submitted", (data) => {
      if (room && data.roomCode === room.id) {
        // Track answers and check if all participants have answered
        setQuizResults((prev) => [...prev, data.answer]);

        // Check if all participants have answered current question
        const participantCount = room.participants.length;
        const answeredCount = quizResults.filter(
          (r) => r.questionIndex === currentQuestionIndex,
        ).length;

        if (answeredCount === participantCount - 1) {
          // -1 because host doesn't answer
          handleNextQuestion();
        }
      }
    });

    socket.on("next-question", (data) => {
      if (room && data.roomCode === room.id) {
        setCurrentQuestionIndex(data.questionIndex);
        setTimeRemaining(30); // Reset timer to 30 seconds for each question
      }
    });

    return () => {
      socket.off("answer-submitted");
      socket.off("next-question");
    };
  }, [room, currentQuestionIndex, quizResults]);

  if (!room) {
    return (
      <div className="h-screen w-full bg-[#FAFAFB] flex flex-col overflow-hidden font-sans text-slate-900 relative">
        {/* Structural Background Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] z-0">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Header */}
        <header className="relative z-10 h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="w-7 h-7 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-sm italic">S</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-slate-900 uppercase italic">
              SCIO_
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Heading */}
            <section className="border-l-2 border-indigo-600/20 pl-8 py-2 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-2 py-1">
                  Protocol: HOST_INIT
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-[5.5rem] font-bold tracking-tighter text-slate-900 leading-[0.9] mb-6"
              >
                Create <br />
                <span className="text-indigo-600 italic">Deployment.</span>
              </motion.h1>

              <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
                Initialize a new neural cluster session for real-time assessment
                and data synchronization.
              </p>
            </section>

            {/* Room Creation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                    Initialize_New_Session
                  </h3>

                  <form onSubmit={handleCreateRoom} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Session_Name
                      </label>
                      <input
                        type="text"
                        value={roomSettings.roomName}
                        onChange={(e) =>
                          setRoomSettings({
                            ...roomSettings,
                            roomName: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 p-4 text-xs font-bold tracking-widest focus:outline-none focus:border-indigo-600 transition-all"
                        placeholder="ENTER_SESSION_IDENTIFIER"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Assessment_Title
                      </label>
                      <input
                        type="text"
                        value={roomSettings.quizTitle}
                        onChange={(e) =>
                          setRoomSettings({
                            ...roomSettings,
                            quizTitle: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 p-4 text-xs font-bold tracking-widest focus:outline-none focus:border-indigo-600 transition-all"
                        placeholder="LIVE_ASSESSMENT_PROTOCOL"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roomSettings.allowLateJoin}
                          onChange={(e) =>
                            setRoomSettings({
                              ...roomSettings,
                              allowLateJoin: e.target.checked,
                            })
                          }
                          className="w-4 h-4 border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                          Allow_Late_Join
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roomSettings.showResults}
                          onChange={(e) =>
                            setRoomSettings({
                              ...roomSettings,
                              showResults: e.target.checked,
                            })
                          }
                          className="w-4 h-4 border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                          Display_Results
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roomSettings.shuffleQuestions}
                          onChange={(e) =>
                            setRoomSettings({
                              ...roomSettings,
                              shuffleQuestions: e.target.checked,
                            })
                          }
                          className="w-4 h-4 border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                          Randomize_Sequence
                        </span>
                      </label>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-[10px] font-black uppercase tracking-widest">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-slate-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none disabled:opacity-50"
                    >
                      {loading ? "DEPLOYING..." : "DEPLOY_HOST_PROTOCOL"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden h-full min-h-[400px]">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <p className="text-[10px] font-black tracking-[0.4em] text-indigo-400">
                      HOST_TELEMETRY
                    </p>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="opacity-40 uppercase">
                          System_Status
                        </span>
                        <span className="text-green-400">ONLINE</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="opacity-40 uppercase">
                          Network_Latency
                        </span>
                        <span className="text-indigo-400">12ms</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="opacity-40 uppercase">
                          Available_Nodes
                        </span>
                        <span className="text-indigo-400">∞</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-40 uppercase">
                          Security_Level
                        </span>
                        <span className="text-indigo-400">MAX</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full animate-pulse"
                          style={{ width: "85%" }}
                        />
                      </div>
                      <p className="text-[8px] font-mono text-indigo-400 text-center">
                        SYSTEM_READY
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-6xl font-black text-white/3 italic">
                    HOST
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#FAFAFB] flex flex-col overflow-hidden font-sans text-slate-900 relative">
      {/* Structural Background Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] z-0">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="w-7 h-7 bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-black text-sm italic">S</span>
          </div>
          <span className="text-lg font-bold tracking-tighter text-slate-900 uppercase italic">
            SCIO_
          </span>
        </div>
        <button
          onClick={handleLeaveRoom}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none"
        >
          Terminate Session
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <section className="border-l-2 border-indigo-600/20 pl-8 py-2 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-2 py-1">
                Protocol: HOST_ACTIVE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[5.5rem] font-bold tracking-tighter text-slate-900 leading-[0.9] mb-6"
            >
              Session <br />
              <span className="text-indigo-600 italic">Active.</span>
            </motion.h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              Neural cluster deployed. Room code:{" "}
              <span className="font-mono text-indigo-600">{room.id}</span>
            </p>
          </section>

          {/* Room Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-7 space-y-8">
              {/* Room Info */}
              <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                  Session_Data
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Session_Name
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {room.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Access_Code
                    </span>
                    <span className="text-sm font-mono font-bold text-indigo-600">
                      {room.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {room.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Participants
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {room.participants?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Code */}
              <div className="bg-indigo-50 border border-indigo-200 p-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4 italic">
                  Share_Access_Protocol
                </h3>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={room.id}
                    readOnly
                    className="flex-1 bg-white border border-indigo-200 p-4 text-sm font-mono font-bold text-center tracking-[0.2em]"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(room.id)}
                    className="px-6 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-indigo-700 mt-3 font-normal">
                  Distribute this access code to participants for session entry
                </p>
              </div>

              {/* Quiz Interface */}
              {quizActive && (
                <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                    Assessment_Protocol_Active
                  </h3>

                  {/* Timer */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Time_Remaining
                      </span>
                      <span
                        className={`text-2xl font-bold ${timeRemaining <= 10 ? "text-red-600" : "text-indigo-600"}`}
                      >
                        {timeRemaining}s
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          timeRemaining <= 10 ? "bg-red-600" : "bg-indigo-600"
                        }`}
                        style={{ width: `${(timeRemaining / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Question */}
                  {currentQuestionIndex < quizQuestions.length && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Question_{currentQuestionIndex + 1}_of_
                          {quizQuestions.length}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1">
                          {quizQuestions[currentQuestionIndex].section}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 leading-tight">
                        {quizQuestions[currentQuestionIndex].question}
                      </h4>

                      <div className="space-y-3">
                        {quizQuestions[currentQuestionIndex].options.map(
                          (option, index) => (
                            <div
                              key={index}
                              className={`p-3 border rounded-lg ${
                                index ===
                                quizQuestions[currentQuestionIndex].correct
                                  ? "bg-green-50 border-green-200"
                                  : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    index ===
                                    quizQuestions[currentQuestionIndex].correct
                                      ? "bg-green-600 text-white"
                                      : "bg-slate-300 text-slate-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-sm font-medium text-slate-900">
                                  {option}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Answer Tracking */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Responses_Received
                      </span>
                      <span className="text-sm font-bold text-indigo-600">
                        {
                          quizResults.filter(
                            (r) => r.questionIndex === currentQuestionIndex,
                          ).length
                        }{" "}
                        / {room.participants.length - 1}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-8">
              {/* Participants */}
              <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                  Connected_Nodes
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {room.participants?.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-black text-sm">
                            {participant.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {participant.name}
                          </p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {participant.role}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded ${
                          participant.status === "online"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {participant.status}
                      </span>
                    </div>
                  )) || (
                    <p className="text-sm text-slate-500 italic">
                      No participants connected
                    </p>
                  )}
                </div>
              </div>

              {/* Start Quiz */}
              {room.participants?.length > 0 && (
                <button
                  onClick={handleStartQuiz}
                  className="w-full py-4 bg-green-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-green-500 transition-all shadow-[4px_4px_0px_0px_rgba(34,197,94,0.3)] hover:shadow-none"
                >
                  Initialize_Assessment
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LiveRoomHost;
