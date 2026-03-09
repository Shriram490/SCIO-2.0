import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import socket from "../socket";
import RoomManager from "../utils/roomManager";
import RoomChat from "./RoomChat";

const LiveRoomJoin = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [room, setRoom] = useState(null);
  const [joined, setJoined] = useState(false);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  // Connect socket when component mounts
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected in LiveRoomJoin");
    }

    // Add catch-all listener to see all events
    socket.onAny((eventName, ...args) => {
      if (eventName.includes("quiz") || eventName.includes("timer")) {
        console.log(`🔔 Socket event received: ${eventName}`, args);
      }
    });

    return () => {
      // Don't disconnect here as other components might need it
    };
  }, []);

  // Handle joining room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = getCurrentUser();
    if (!user) {
      setError("You must be logged in to join a room");
      setLoading(false);
      return;
    }

    if (!roomCode.trim()) {
      setError("Room code is required");
      setLoading(false);
      return;
    }

    if (!RoomManager.validateRoomCode(roomCode.toUpperCase())) {
      setError("Invalid room code format");
      setLoading(false);
      return;
    }

    const participantData = RoomManager.createParticipantData(
      user,
      "participant",
    );
    socket.emit("join-room", {
      roomCode: roomCode.toUpperCase(),
      userData: participantData,
    });
  };

  // Listen for room join response and quiz events
  useEffect(() => {
    // Room join response
    socket.on("room-joined", (data) => {
      setLoading(false);
      if (data.success) {
        setRoom(data.room);
        setJoined(true);
        setError("");
        sessionStorage.setItem("currentRoomCode", data.room.id);
      } else {
        setError(data.message || "Failed to join room");
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

    // Quiz event listeners - ensure they're registered immediately
    console.log("🎯 Setting up quiz event listeners...");

    socket.on("quiz-started", (data) => {
      console.log("🎯 Quiz started event received in LiveRoomJoin:", data);
      console.log("📍 Current room state:", room);
      console.log(
        "🔍 Room ID check - current room:",
        room?.id,
        "event room:",
        data.roomCode,
      );
      console.log(
        "🔍 Room ID type check - current room type:",
        typeof room?.id,
        "event room type:",
        typeof data.roomCode,
      );
      console.log("🔍 Room ID equality:", room?.id === data.roomCode);
      console.log("🔍 Room ID strict equality:", room?.id === data.roomCode);

      if (room && data.roomCode === room.id) {
        console.log("✅ Setting quiz active for room:", room.id);
        console.log("📝 Current question data:", data.currentQuestion);
        console.log("📝 Question type:", typeof data.currentQuestion);
        console.log(
          "📝 Question keys:",
          Object.keys(data.currentQuestion || {}),
        );

        setQuizActive(true);
        setCurrentQuestion(data.currentQuestion);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        setForceUpdate((prev) => prev + 1); // Force re-render

        console.log(
          "🔄 Quiz state updated - quizActive:",
          true,
          "currentQuestion:",
          data.currentQuestion,
        );
      } else {
        console.log(
          "❌ Room mismatch - current room:",
          room?.id,
          "event room:",
          data.roomCode,
        );
        console.log("❌ Room exists check:", !!room);
        console.log("❌ Room ID match check:", room?.id === data.roomCode);
      }
    });

    socket.on("next-question", (data) => {
      console.log("🎯 Next question event received in LiveRoomJoin:", data);
      if (room && data.roomCode === room.id) {
        console.log("✅ Setting next question for room:", room.id);
        setCurrentQuestion(data.question);
        setCurrentQuestionIndex(data.questionIndex);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
      }
    });

    // Timer-sync listener removed - no timer functionality
    // Users can answer without any time constraints

    socket.on("quiz-completed", (data) => {
      console.log("🏁 Quiz completed event received:", data);
      if (room && data.roomCode === room.id) {
        setQuizActive(false);
        setCurrentQuestion(null);
        // Show results or completion message
      }
    });

    console.log("✅ Quiz event listeners registered");

    return () => {
      socket.off("room-joined");
      socket.off("room-error");
      socket.off("participant-joined");
      socket.off("participant-left");
      socket.off("quiz-started");
      socket.off("next-question");
      socket.off("quiz-completed");
    };
  }, [room, navigate]);

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (selectedAnswer !== null && !answerSubmitted && currentQuestion) {
      const answerData = {
        roomCode: room.id,
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correct,
        userId: getCurrentUser()?.id,
        userName: getCurrentUser()?.name,
        timestamp: new Date().toISOString(),
      };

      socket.emit("submit-answer", answerData);
      setAnswerSubmitted(true);
    }
  };

  // Timer effect removed - no timer at all
  // Users can answer questions without any time constraints

  // Local countdown timer removed - no timer functionality at all
  // Users have complete freedom to answer anytime

  const handleLeaveRoom = () => {
    if (room) {
      socket.emit("leave-room", { roomCode: room.id });
      setRoom(null);
      setJoined(false);
      sessionStorage.removeItem("currentRoomCode");
      navigate("/dashboard");
    }
  };

  const getRoomStatusColor = () => {
    if (!room) return "text-slate-600";
    switch (room.status) {
      case "waiting":
        return "text-yellow-600";
      case "active":
        return "text-green-600";
      case "completed":
        return "text-slate-600";
      default:
        return "text-slate-600";
    }
  };

  if (!joined) {
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
                  Protocol: JOIN_INIT
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-[5.5rem] font-bold tracking-tighter text-slate-900 leading-[0.9] mb-6"
              >
                Connect <br />
                <span className="text-indigo-600 italic">Uplink.</span>
              </motion.h1>

              <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
                Establish secure connection to active neural cluster using
                access protocol identifier.
              </p>
            </section>

            {/* Join Room Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                    Access_Protocol
                  </h3>

                  <form onSubmit={handleJoinRoom} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                        Room_Access_Code
                      </label>
                      <input
                        type="text"
                        value={roomCode}
                        onChange={(e) =>
                          setRoomCode(e.target.value.toUpperCase())
                        }
                        className="w-full bg-slate-50 border border-slate-200 p-4 text-xl font-mono font-bold text-center tracking-[0.3em] focus:outline-none focus:border-indigo-600 transition-all"
                        placeholder="XXXXXX"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-slate-500 mt-3 font-normal text-center">
                        Enter 6-digit access protocol identifier
                      </p>
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
                      {loading ? "CONNECTING..." : "ESTABLISH_UPLINK"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden h-full min-h-[400px]">
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <p className="text-[10px] font-black tracking-[0.4em] text-indigo-400">
                      UPLINK_TELEMETRY
                    </p>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="opacity-40 uppercase">
                          Connection_Status
                        </span>
                        <span className="text-yellow-400">STANDBY</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="opacity-40 uppercase">
                          Signal_Strength
                        </span>
                        <span className="text-indigo-400">87%</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="opacity-40 uppercase">Latency</span>
                        <span className="text-indigo-400">8ms</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="opacity-40 uppercase">Encryption</span>
                        <span className="text-indigo-400">AES-256</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full animate-pulse"
                          style={{ width: "87%" }}
                        />
                      </div>
                      <p className="text-[8px] font-mono text-indigo-400 text-center">
                        READY_FOR_CONNECTION
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-6xl font-black text-white/3 italic">
                    JOIN
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
          Disconnect Uplink
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
                Protocol: JOIN_ACTIVE
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[5.5rem] font-bold tracking-tighter text-slate-900 leading-[0.9] mb-6"
            >
              Uplink <br />
              <span className="text-indigo-600 italic">Connected.</span>
            </motion.h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              Neural cluster connection established. Room:{" "}
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
              <div className="grid sm:grid-cols-2 gap-8">
                {/* User Info */}
                <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                    Node_Identity
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Operator_Name
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {getCurrentUser()?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Access_Level
                      </span>
                      <span className="text-sm font-bold text-indigo-600">
                        {getCurrentUser()?.role || "PARTICIPANT"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Connection_Status
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        CONNECTED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Room Info */}
                <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                    Cluster_Data
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Session_Name
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {room.name || "LIVE_SESSION"}
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
                      <span
                        className={`text-sm font-bold ${getRoomStatusColor()}`}
                      >
                        {room.status === "waiting"
                          ? "AWAITING_HOST"
                          : room.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Host_Node
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {RoomManager.getHost(room.participants)?.name ||
                          "UNKNOWN"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Interface */}
              {quizActive && currentQuestion && (
                <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
                    Assessment_Protocol_Active
                  </h3>

                  {/* Current Question */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Question_{currentQuestionIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1">
                        {currentQuestion.section}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 leading-tight">
                      {currentQuestion.question}
                    </h4>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            !answerSubmitted && setSelectedAnswer(index)
                          }
                          disabled={answerSubmitted}
                          className={`w-full p-4 border rounded-lg text-left transition-all ${
                            selectedAnswer === index
                              ? "border-indigo-600 bg-indigo-50"
                              : answerSubmitted
                                ? "border-slate-200 bg-slate-50"
                                : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                          } ${answerSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                selectedAnswer === index
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-300 text-slate-600"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-sm font-medium text-slate-900">
                              {option}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Submit Button */}
                    {!answerSubmitted && (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className={`w-full py-3 font-bold text-sm uppercase tracking-widest transition-all ${
                          selectedAnswer !== null
                            ? "bg-indigo-600 text-white hover:bg-indigo-500"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Submit_Answer
                      </button>
                    )}

                    {answerSubmitted && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-bold text-green-800 text-center">
                          Answer Submitted
                        </p>
                      </div>
                    )}
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
                        {participant.status || "online"}
                      </span>
                    </div>
                  ))}
                  {(!room.participants || room.participants.length === 0) && (
                    <p className="text-sm text-slate-500 italic">
                      No participants connected
                    </p>
                  )}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="h-96">
                <RoomChat roomCode={room.id} currentUser={getCurrentUser()} />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LiveRoomJoin;
