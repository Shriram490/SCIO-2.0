import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      id: '01',
      title: 'Neural Generation',
      description: 'Deploy comprehensive assessments in under 30 seconds via our proprietary inference engine.',
      accent: 'border-indigo-500'
    },
    {
      id: '02',
      title: 'Adaptive Logic',
      description: 'Dynamic difficulty scaling that recalibrates in real-time based on student response patterns.',
      accent: 'border-slate-900'
    },
    {
      id: '03',
      title: 'Quantum Analytics',
      description: 'Granular data visualization mapping knowledge gaps with surgical precision.',
      accent: 'border-purple-500'
    },
    {
      id: '04',
      title: 'Multi-Modal Input',
      description: 'Full support for complex syntax, open-ended proofs, and standard objective formats.',
      accent: 'border-green-500'
    },
    {
      id: '05',
      title: 'Elastic Scaling',
      description: 'Zero-latency architecture supporting simultaneous deployment across entire districts.',
      accent: 'border-blue-500'
    },
    {
      id: '06',
      title: 'Encryption Tier-1',
      description: 'Enterprise-grade security protocols with 99.9% uptime for mission-critical reliability.',
      accent: 'border-rose-500'
    }
  ];

  return (
    <section className="relative py-24 bg-[#FAFAFB] overflow-hidden border-t border-slate-200">
      {/* Background Grid - Matching the Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header - Precise & Sharp */}
        <div className="mb-20 border-l-2 border-indigo-600 pl-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-4"
          >
            System Capabilities
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-6">
            Engineered for <br />
            <span className="italic text-slate-500 underline decoration-indigo-200 decoration-4 underline-offset-8">Precision.</span>
          </h2>
        </div>
        
        {/* Features Grid - Sharp Edge Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group p-10 border-r border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-300 relative overflow-hidden`}
            >
              {/* Feature ID - Top Right */}
              <div className="absolute top-6 right-8 text-xs font-black text-slate-200 group-hover:text-indigo-100 transition-colors tabular-nums">
                // {feature.id}
              </div>

              {/* Precise Content */}
              <div className={`w-8 h-1 mb-8 ${feature.accent} border-t-2`}></div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-slate-500 text-sm leading-relaxed font-normal mb-6">
                {feature.description}
              </p>

              {/* Minimal Arrow */}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                Documentation <span>→</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA - Matching the Hero Buttons */}
        <div className="mt-20 flex justify-start">
          <button className="px-10 py-5 bg-slate-900 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-indigo-600 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(79,70,229,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
            System Overview
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;