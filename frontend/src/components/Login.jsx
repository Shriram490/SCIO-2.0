import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData);
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.message || "LOGIN_FAILED");
      }
    } catch (err) {
      setError(err.message || "AUTH_CRITICAL: UPLINK_DENIED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* LEFT PANE: Input Terminal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative border-r border-slate-100">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex lg:hidden items-center gap-3 mb-8"
            >
              <div className="w-6 h-6 bg-slate-900 flex items-center justify-center">
                <span className="text-white font-black text-xs italic">S</span>
              </div>
              <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
                SCIO_
              </span>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              Initialize Session
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              New User?{" "}
              <Link to="/signin" className="text-indigo-600 hover:underline">
                Register Node
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {[
                {
                  label: "Uplink Email",
                  name: "email",
                  type: "email",
                  placeholder: "USER@DOMAIN.COM",
                },
                {
                  label: "Access Key",
                  name: "password",
                  type: "password",
                  placeholder: "••••••••",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold uppercase tracking-tight focus:outline-none focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-300"
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-2 border-slate-300 rounded-none checked:bg-slate-900"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  Maintain Session
                </span>
              </label>
              <a
                href="#"
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
              >
                Recover Key?
              </a>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 border-l-4 border-rose-500 p-3 text-rose-600 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Establish Connection"}
            </button>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                Sandbox Credentials:
              </p>
              <div className="grid grid-cols-1 gap-1 font-mono text-[10px] text-slate-600">
                <p>U: admin@example.com / P: password</p>
                <p>U: user@example.com / P: password</p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT PANE: Visual Identity & Industrial Brand */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-16 flex-col justify-between">
        {/* Decorative Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 text-right">
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              SCIO_SYSTEMS
            </span>
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-lg italic">S</span>
            </div>
          </Link>

          <h2 className="text-6xl font-bold text-white tracking-tighter leading-none mb-6">
            WELCOME <br />
            <span className="text-indigo-500 italic text-5xl">
              BACK_OPERATOR.
            </span>
          </h2>
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium ml-auto max-w-sm leading-relaxed">
            Re-establishing connection to the pedagogical assessment engine.
          </p>
        </div>

        {/* Technical Data Visualization Mockup */}
        <div className="relative z-10 border-r border-slate-700 pr-8 text-right self-end">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
            Core_Status
          </p>
          <div className="flex gap-2 justify-end mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-1 ${i < 5 ? "bg-indigo-500" : "bg-slate-700"}`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Load: 12.4% | Ping: 14ms
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
