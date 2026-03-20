import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Teachers = () => {
  const [hoursSaved, setHoursSaved] = useState(0);

  // Simple intersection observer logic could trigger this, 
  // but for now, we'll let it run on mount for impact.
  useEffect(() => {
    const timer = setInterval(() => {
      setHoursSaved(prev => (prev < 10 ? prev + 1 : 10));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const benefits = [
    {
      title: 'Time Reallocation',
      description: 'Redirect 10+ hours weekly from manual drafting to high-impact student mentorship.',
      tag: 'EFFICIENCY'
    },
    {
      title: 'Pedagogical Insights',
      description: 'Identify conceptual friction points via granular cohort response analytics.',
      tag: 'DATA'
    },
    {
      title: 'Dynamic Alignment',
      description: 'Sync assessments with proprietary curriculum standards in real-time.',
      tag: 'SYNC'
    },
    {
      title: 'Node Sharing',
      description: 'Create collaborative assessment modules across classrooms.',
      tag: 'TEAM'
    }
  ];

  return (
    <section className="relative py-24 bg-[#FAFAFB] overflow-hidden border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header: Sharp & Precise */}
        <div className="mb-20 border-l-2 border-slate-900 pl-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4"
          >
            User Success Metric
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-4">
            Empowering <br />
            <span className="italic text-slate-400">The Modern Faculty.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-24">
          
          {/* LEFT: Benefits Grid with Sharp Borders */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-slate-200">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="p-8 border-r border-b border-slate-200 transition-colors"
                >
                  <div className="t=ext-[10px] font-black text-indigo-500 mb-4 tracking-widest">// {benefit.tag}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-tight">{benefit.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: High-Contrast Testimonial */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative bg-white border border-slate-200 p-10 shadow-[20px_20px_0px_0px_rgba(226,232,240,0.5)]"
            >
              <div className="flex items-center mb-8">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop" 
                    alt="Teacher" 
                    className="w-16 h-16 grayscale hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase">Verified</div>
                </div>
                <div className="ml-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sarah Johnson</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase">Science Faculty • Boston High</p>
                </div>
              </div>

              <blockquote className="text-xl font-medium text-slate-700 leading-relaxed mb-8 italic">
                "SCIO has restructured my workflow. Assessment generation is no longer a bottleneck; it's a competitive advantage for my classroom engagement."
              </blockquote>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-slate-900" />
                  ))}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">Evaluation: 5.0 / 5.0</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM CTA: Industrial Style */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative bg-slate-900 p-12 overflow-hidden group"
        >
          {/* Decorative Sharp Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 translate-x-16 -translate-y-16 rotate-45" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">
                Hours Saved This Week: <span className="text-indigo-400 tabular-nums">{hoursSaved}+</span>
              </h3>
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Join the professional tier of AI-enabled educators.</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none">
                Get Enterprise Access
              </button>
              <button className="px-8 py-4 bg-transparent border border-slate-700 text-white font-black text-xs uppercase tracking-widest hover:border-white transition-all">
                The Methodology
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Teachers;