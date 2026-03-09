import React from "react";
import { motion } from "framer-motion";
import skategirl from "../assets/scatinggirl.mp4"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-[#FAFAFB] overflow-hidden pt-20">
      {/* Structural Background Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/30 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 ">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT SIDE: Content (Professional & Sharp) */}
          <div className="lg:col-span-6 text-left border-l-2 border-indigo-600/20 pl-8 py-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-2 py-1">
                Enterprise AI v2.0
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-[5.5rem] font-bold tracking-tighter text-slate-900 mb-6 leading-[0.95] font-sans"
            >
              Precision <br />
              <span className="text-indigo-600 italic">Intelligence.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed font-normal border-l-2 border-slate-200 pl-6"
            >
              Architect deep-learning assessments with SCIO’s proprietary
              generative engine. Engineered for educators who demand surgical
              accuracy and student-first personalization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-row gap-4 mb-14"
            >
              <button className="px-8 py-4 bg-slate-900 text-white font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-indigo-600 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                Deploy SCIO Free
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 font-bold text-sm uppercase tracking-widest rounded-sm border border-slate-200 hover:bg-slate-50 transition-all">
                The Methodology
              </button>
            </motion.div>

            {/* Structured Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-12"
            >
              <div className="space-y-1">
                <div className="text-4xl font-light text-slate-900 tabular-nums">
                  99.8
                  <span className="text-indigo-600 text-xl font-bold">%</span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Inference Accuracy
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-light text-slate-900 tabular-nums">
                  0.4
                  <span className="text-indigo-600 text-xl font-bold">s</span>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Latency / Quiz
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: The Lottie Visual */}
          <div className="lg:col-span-6 relative flex justify-center items-center w-[600px] h-fit">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[500px]"
            >
              {/* Sharp Edge Frame for the Visual */}
              <div className="relative bg-white p-0 shadow-2xl rounded-[1.5vw] overflow-hidden w-[40vw]">
                <div className="bg-slate-50 flex items-center justify-center  ">
                  <video
                    src={skategirl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                    style={{ maxWidth: "100%" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                

               
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 5s ease-in-out 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
