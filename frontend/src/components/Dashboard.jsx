import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Mock Sub-components for visual representation
const DashboardOverview = () => (
  <div className="space-y-12">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-slate-200 bg-white">
      {[
        { label: "Active_Sessions", value: "003", unit: "live" },
        { label: "Total_Users", value: "042", unit: "nodes" },
        { label: "System_Uptime", value: "99.8", unit: "%" },
        { label: "Data_Packets", value: "1.2M", unit: "trans" },
      ].map((stat, i) => (
        <div
          key={i}
          className="p-8 border-r last:border-r-0 border-slate-200 hover:bg-slate-50 transition-colors group"
        >
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-200 group-hover:bg-indigo-600 transition-colors" />
            {stat.label}
          </div>
          <div className="text-5xl font-light text-slate-900 tabular-nums tracking-tighter">
            {stat.value}
            <span className="text-indigo-600 text-xl font-bold ml-1">
              {stat.unit}
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Quick Actions */}
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          Session_Management
        </h3>
        <div className="grid gap-4">
          {[
            {
              label: "Create_New_Session",
              desc: "Initialize a new live assessment room",
              type: "create",
            },
            {
              label: "Join_Existing_Session",
              desc: "Connect to an active room using access code",
              type: "join",
            },
            {
              label: "View_Session_History",
              desc: "Access previous session data and analytics",
              type: "view",
            },
          ].map((action) => (
            <button
              key={action.label}
              className="w-full px-6 py-5 bg-white border border-slate-200 text-left hover:border-indigo-600 hover:bg-slate-50 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">
                    {action.label}
                  </h4>
                  <p className="text-xs text-slate-500 font-normal">
                    {action.desc}
                  </p>
                </div>
                <span className="text-indigo-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sm font-black">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          System_Monitor
        </h3>
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black tracking-[0.4em] text-indigo-400">
                CORE_TELEMETRY
              </p>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-1 bg-green-500 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                <span className="opacity-40 uppercase">Network_Status</span>
                <span className="text-green-400">OPTIMAL</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                <span className="opacity-40 uppercase">Response_Time</span>
                <span className="text-indigo-400">12ms</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                <span className="opacity-40 uppercase">Active_Connections</span>
                <span className="text-indigo-400">003</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="opacity-40 uppercase">Memory_Usage</span>
                <span className="text-indigo-400">42%</span>
              </div>
            </div>

            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full animate-pulse"
                style={{ width: "42%" }}
              />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-6xl font-black text-white/[0.03] italic">
            CORE
          </div>
        </div>
      </div>
    </div>
  </div>
);
const LiveRoomHost = () => (
  <div className="grid lg:grid-cols-12 gap-12">
    <div className="lg:col-span-7 space-y-8">
      <div className="bg-white border border-slate-200 p-8 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.1)]">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 italic">
          Initialize_New_Session
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="SESSION_NAME"
            className="w-full bg-slate-50 border border-slate-200 p-4 text-xs font-bold tracking-widest focus:outline-none focus:border-indigo-600 transition-all"
          />
          <button className="w-full py-4 bg-slate-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none">
            Deploy Host Protocol
          </button>
        </div>
      </div>
      <div className="border-l-2 border-slate-200 pl-8">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Active_Registry
        </h4>
        <p className="text-xs text-slate-500 italic">
          No active rooms detected in local cluster...
        </p>
      </div>
    </div>
    <div className="lg:col-span-5">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden h-full min-h-[300px]">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <p className="text-[10px] font-black tracking-[0.4em] text-indigo-400">
            HOST_TELEMETRY
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
              <span className="opacity-40 uppercase">Server_Load</span>
              <span className="text-indigo-400">0.02%</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono border-b border-white/10 pb-2">
              <span className="opacity-40 uppercase">Latency_Node</span>
              <span className="text-indigo-400">12ms</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 text-6xl font-black text-white/[0.03] italic">
          CORE
        </div>
      </div>
    </div>
  </div>
);

const LiveRoomJoin = () => (
  <div className="max-w-2xl mx-auto py-12">
    <div className="text-center mb-12">
      <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
        Uplink_Required
      </div>
      <h2 className="text-4xl font-bold tracking-tighter text-slate-900">
        Enter Access Code.
      </h2>
    </div>
    <div className="relative bg-white p-2 border border-slate-200 shadow-2xl rounded-sm group">
      <div className="flex gap-2">
        <input
          maxLength={6}
          type="text"
          placeholder="000-000"
          className="flex-1 bg-slate-50 border border-slate-100 p-6 text-2xl font-light text-center tracking-[0.5em] text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all tabular-nums"
        />
        <button className="px-10 bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">
          Join
        </button>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="h-screen bg-[#FAFAFB] flex items-center justify-center font-sans tracking-[0.3em] text-[10px] font-black text-slate-400 uppercase">
        Initialising_Neural_Link...
      </div>
    );

  return (
    <div className="h-screen w-full bg-[#FAFAFB] flex flex-col overflow-hidden font-sans text-slate-900 relative">
      {/* Structural Background Lines (Exact Hero Match) */}
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

      {/* High-Precision Header */}
      <header className="relative z-10 h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-sm italic">S</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-slate-900 uppercase italic">
              SCIO_
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["overview", "host", "join"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "host") {
                    navigate("/host-room");
                  } else if (item === "join") {
                    navigate("/join-room");
                  } else {
                    setActiveTab(item);
                  }
                }}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-1 border-b-2 h-20 flex items-center ${
                  activeTab === item
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {item === "overview"
                  ? "Dashboard"
                  : item === "host"
                    ? "Host_Session"
                    : "Join_Session"}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block border-r border-slate-200 pr-6">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Operator
            </p>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
              {user.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Command Viewport */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading (Matching Hero border-l and heading style) */}
          <section className="border-l-2 border-indigo-600/20 pl-8 py-2 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-2 py-1">
                Protocol: {activeTab.toUpperCase()}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[5.5rem] font-bold tracking-tighter text-slate-900 leading-[0.9] mb-6"
            >
              {activeTab === "overview"
                ? "System"
                : activeTab === "host"
                  ? "Create"
                  : "Initialize"}{" "}
              <br />
              <span className="text-indigo-600 italic">
                {activeTab === "overview"
                  ? "Overview."
                  : activeTab === "host"
                    ? "Deployment."
                    : "Connection."}
              </span>
            </motion.h1>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              {activeTab === "overview"
                ? "Monitor system performance, manage active sessions, and access real-time telemetry data."
                : activeTab === "host"
                  ? "Configure real-time neural clusters for immediate student assessment and surgical data feedback."
                  : "Synchronize with an existing node to begin the automated assessment lifecycle."}
            </p>
          </section>

          {/* Module Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative z-20"
            >
              {activeTab === "overview" ? <DashboardOverview /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Telemetry Strip */}
      <footer className="relative z-10 h-12 border-t border-slate-200 bg-white/50 backdrop-blur-sm px-8 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-none shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span>Node_Active</span>
          </div>
          <span className="opacity-30">|</span>
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">Secure_Uplink</span>
            <span className="tabular-nums">256_AES</span>
          </div>
        </div>
        <div className="hidden sm:block tabular-nums">
          SYSTEM_TIME: {new Date().toLocaleTimeString()}
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        .scan-line {
          position: absolute;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(79, 70, 229, 0.4),
            transparent
          );
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
