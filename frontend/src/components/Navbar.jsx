import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isAuthPage = ["/login", "/signin", "/dashboard"].includes(
    location.pathname,
  );
  if (isAuthPage) return null;

  return (
    <div
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-6"}`}
    >
      <nav
        className={`
        mx-auto flex items-center justify-between px-8 transition-all duration-500 border
        ${
          scrolled
            ? "max-w-5xl h-14 bg-white/90 backdrop-blur-md border-slate-200 shadow-sm"
            : "max-w-7xl h-16 bg-transparent border-transparent"
        }
      `}
      >
        {/* LOGO: Sharp & Minimal */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-slate-900 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
            <span className="text-white font-black text-lg italic">S</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            SCIO<span className="text-indigo-600">_</span>
          </span>
        </Link>

        {/* DESKTOP NAV: Technical Grid Style */}
        <div className="hidden md:flex items-center border-l border-r border-slate-200 h-full">
          {["Dashboard", "Host Room", "Join Room"].map((item) => (
            <Link
              key={item}
              to={item.toLowerCase().replace(" ", "-")}
              className="px-6 h-full flex items-center text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all border-r last:border-r-0 border-slate-100"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* ACTIONS / PROFILE */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                    ID: {user.id || "NODE_01"}
                  </p>
                </div>
                <div className="w-9 h-9 border-2 border-slate-900 p-0.5 group-hover:border-indigo-600 transition-colors">
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </button>

              {/* PROFILE DROPDOWN: Industrial Bento Style */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] p-2 origin-top-right"
                  >
                    <div className="p-4 bg-slate-900 mb-2 overflow-hidden relative">
                      {/* Background Tech Label */}
                      <div className="absolute -right-2 -bottom-2 text-[40px] font-black text-white/5 pointer-events-none">
                        USER
                      </div>

                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">
                        Authenticated Session
                      </p>
                      <h3 className="font-bold text-white text-sm uppercase tracking-tight">
                        {user.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="border border-slate-100 p-3">
                        <p className="text-xs font-black text-slate-900 tabular-nums">
                          12
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Deployments
                        </p>
                      </div>
                      <div className="border border-slate-100 p-3">
                        <p className="text-xs font-black text-indigo-600 tabular-nums">
                          4.2ms
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Avg_Latency
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center py-3 text-slate-400 hover:text-white hover:bg-rose-600 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                    >
                      Terminate Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/login"
                className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 px-6"
              >
                Login
              </Link>
              <Link
                to="/signin"
                className="px-6 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                Get Access
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
