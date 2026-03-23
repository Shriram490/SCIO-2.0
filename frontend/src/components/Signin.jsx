import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { register } from "../services/authService";

const Signin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("ERROR: CREDENTIAL_MISMATCH");
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        navigate("/");
      } else {
        setError(response.message || "REGISTRATION_FAILED");
      }
    } catch (err) {
      setError(err.message || "SYSTEM_FAILURE: CONNECTION_TIMEOUT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* LEFT PANE: Visual Identity & Data Stats */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-16 flex-col justify-between">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-lg italic">S</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              SCIO_SYSTEMS
            </span>
          </Link>

          <h2 className="text-6xl font-bold text-white tracking-tighter leading-none mb-6">
            CREATE <br />
            <span className="text-indigo-500 italic">ACCOUNT.</span>
          </h2>
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium max-w-sm leading-relaxed">
            Create your teacher profile to access the classroom platform.
          </p>
        </div>

        {/* Decorative System Map */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] border border-white rounded-full flex items-center justify-center">
            <div className="w-[300px] h-[300px] border border-white rotate-45" />
          </div>
        </div>

        <div className="relative z-10 border-l border-slate-700 pl-8">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
            Encryption_Standard
          </p>
          <p className="text-xs text-slate-500 font-mono">
            AES-256-GCM Secure Connection Active
          </p>
        </div>
      </div>

      {/* RIGHT PANE: Input Terminal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              Create Account
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Existing User?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Re-Authenticate
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  label: "Full Name",
                  name: "name",
                  type: "text",
                  placeholder: "J. DOE",
                },
                {
                  label: "Network Email",
                  name: "email",
                  type: "email",
                  placeholder: "USER@DOMAIN.COM",
                },
                {
                  label: "Secure Password",
                  name: "password",
                  type: "password",
                  placeholder: "••••••••",
                },
                {
                  label: "Verify Password",
                  name: "confirmPassword",
                  type: "password",
                  placeholder: "••••••••",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
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

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 border-l-4 border-rose-500 p-3 text-rose-600 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <div className="py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 border-2 border-slate-300 rounded-none checked:bg-indigo-600 transition-all"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-slate-900">
                  Accept Privacy Policy & User Terms
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          {/* Infrastructure Footer */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
            <div className="text-[9px] font-mono text-slate-300 uppercase tracking-tighter">
              SCIO_ID_AUTH_SERVICE_V2
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-indigo-500 animate-pulse" />
              <div className="w-2 h-2 bg-slate-200" />
              <div className="w-2 h-2 bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
