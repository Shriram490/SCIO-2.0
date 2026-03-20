import React from 'react';
import { motion } from 'framer-motion';

const Students = () => {
  const features = [
    {
      id: '01',
      title: 'AI Skill Mapping',
      description: 'The engine identifies your cognitive baseline and recalibrates difficulty in real-time.',
      tag: 'ADAPTIVE'
    },
    {
      id: '02',
      title: 'Latent Feedback Loop',
      description: 'Instant verification with step-by-step logic deconstruction for every incorrect response.',
      tag: 'REAL-TIME'
    },
    {
      id: '03',
      title: 'Cross-Platform Sync',
      description: 'Continuous session persistence across mobile, tablet, and desktop interfaces.',
      tag: 'MOBILE'
    },
    {
      id: '04',
      title: 'Velocity Tracking',
      description: 'Visual data reports mapping your mastery speed against curriculum milestones.',
      tag: 'METRICS'
    },
    {
      id: '05',
      title: 'Cluster Learning',
      description: 'Encrypted peer-to-peer study modules for collaborative knowledge synthesis.',
      tag: 'SOCIAL'
    },
    {
      id: '06',
      title: 'Mastery Incentives',
      description: 'Performance-based achievement nodes that validate subject-matter expertise.',
      tag: 'GAMIFIED'
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden border-b border-slate-200">
      {/* Background Tech Detail */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-50/50 border-l border-slate-100 hidden lg:block" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header: Precise & Professional */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 border-b-2 border-indigo-600 mb-6"
          >
            Terminal / Student_Interface
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.9]">
            Cognitive <br />
            <span className="italic text-slate-400">Optimization.</span>
          </h2>
        </div>
        
        {/* Feature Grid: Sharp Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-slate-200 mb-24">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              whileHover={{ backgroundColor: '#fcfcfd' }}
              className="p-10 border-r border-b border-slate-200 group transition-all"
            >
              <div className="text-[10px] font-bold text-slate-300 mb-6 tabular-nums">ID_CORE_{feature.id}</div>
              <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                {feature.description}
              </p>
              <div className="inline-block px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {feature.tag}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Professional Social Proof */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-slate-900" />
              Verified Performance
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Alex Chen', role: 'Mathematics Cluster', text: 'The AI adjusted to my learning speed in Calculus. Mastery achieved 40% faster.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
                { name: 'Maria Rodriguez', role: 'Biology Division', text: 'Instant deconstruction of mistakes allows for immediate recalibration of mental models.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
              ].map((story, i) => (
                <div key={i} className="flex gap-6 p-6 border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
                  <img src={story.img} alt={story.name} className="w-12 h-12 grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <p className="text-slate-600 text-sm italic mb-3 font-medium">"{story.text}"</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{story.name}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">// {story.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Data-Heavy CTA Card */}
          <div className="lg:col-span-5">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 p-10 shadow-[24px_24px_0px_0px_rgba(79,70,229,0.1)] relative overflow-hidden"
            >
              {/* Decorative Tech Overlay */}
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <div className="w-12 h-12 border-t-2 border-r-2 border-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-tighter">System Integration</h3>
              
              <div className="space-y-6 mb-10">
                {[
                  { label: 'Improvement Index', value: '+95%', width: 'w-[95%]' },
                  { label: 'Retention Velocity', value: '2.4x', width: 'w-[70%]' },
                  { label: 'Active User Nodes', value: '50k+', width: 'w-[85%]' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <span>{stat.label}</span>
                      <span className="text-white">{stat.value}</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        className={`h-full bg-indigo-500 origin-left ${stat.width}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-5 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none">
                Get Student Access
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Students;