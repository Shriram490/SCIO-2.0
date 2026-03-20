import React from 'react';
import { motion } from 'framer-motion';

const AISection = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden border-b border-slate-200">
      {/* Subtle Data Stream Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT SIDE: Architectural Content */}
          <div className="lg:col-span-6 border-l-2 border-slate-900 pl-8 py-2">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              System Logic: Gen-01
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-8 leading-tight">
              Automated <br />
              <span className="text-indigo-600 italic">Inference Engine.</span>
            </h2>
            
            <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed border-l border-slate-200 pl-6">
              Our proprietary LLM stack deconstructs raw curriculum data into granular learning nodes. SCIO doesn’t just "write questions"—it maps educational objectives to high-probability retention patterns.
            </p>
            
            <div className="space-y-8 mb-12">
              {[
                { title: "Standard Alignment", desc: "Cross-referenced against national K-12 and Higher-Ed frameworks." },
                { title: "Node Recalibration", desc: "Difficulty adjusts dynamically based on historical cohort latency." },
                { title: "Multi-Source Intake", desc: "Process PDFs, Lecture Video, or raw Markdown with 99.8% semantic parity." }
              ].map((item, i) => (
                <div key={i} className="flex items-start group">
                  <div className="flex-shrink-0 w-2 h-10 bg-indigo-100 group-hover:bg-indigo-600 transition-colors mt-1" />
                  <div className="ml-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="px-8 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-sm shadow-[4px_4px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
              Start Generation
            </button>
          </div>
          
          {/* RIGHT SIDE: Bionic UI Visualization */}
          <div className="lg:col-span-6 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] shadow-2xl overflow-hidden group"
            >
              <div className="relative bg-white rounded-[2.4rem] p-8 overflow-hidden">
                {/* Simulated Terminal / Code Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">ai_process_log.exe</div>
                </div>

                <div className="space-y-6">
                  {/* Task Card 1 */}
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        <span className="animate-pulse text-xs">AI</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2.5 bg-slate-200 rounded-full w-3/4 mb-2 animate-pulse" />
                        <div className="h-2 bg-slate-100 rounded-full w-1/2" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Card 2 (Processing) */}
                  <div className="bg-white border-2 border-indigo-50 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="h-2.5 bg-slate-200 rounded-full w-2/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-1.5 bg-slate-100 rounded-full" />
                      <div className="h-1.5 bg-slate-100 rounded-full w-5/6" />
                      <div className="h-1.5 bg-indigo-50 rounded-full w-4/5" />
                    </div>
                    {/* Scanning Animation Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-indigo-500/5 to-transparent h-full w-full -translate-y-full animate-[scan_3s_linear_infinite]" />
                  </div>
                  
                  {/* Result Card (Success) */}
                  <div className="bg-indigo-600 p-5 rounded-2xl shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Inference Complete</span>
                      </div>
                      <span className="text-white/60 text-[10px] font-mono">99.8% ACC</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full">
                      <div className="bg-white h-full rounded-full w-full origin-left scale-x-[0.9] animate-fill" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Architectural Label on Right Side */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 border border-slate-200 shadow-xl hidden lg:block">
              <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Architecture</div>
              <div className="text-sm font-bold text-slate-900">AI Sandbox v1.0.4</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes fill {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-fill { animation: fill 2s ease-out forwards; }
      `}</style>
    </section>
  );
};

export default AISection;