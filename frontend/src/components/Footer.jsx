import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* BRAND BLOCK */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter uppercase italic">SCIO</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-10 font-medium">
              Architecting the next generation of assessment intelligence. 
              Our proprietary AI engine maps curriculum topics to high-probability learning outcomes.
            </p>
            
            {/* System Status - Interactive Element */}
            <div className="inline-flex items-center gap-4 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">System Status: Operational</span>
            </div>
          </div>

          {/* LINK GROUPS */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Infrastructure</h3>
              <ul className="space-y-4">
                {['AI Core', 'API Interface', 'Performance Metrics', 'Security'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-3 h-[1px] bg-indigo-500 transition-all mr-0 group-hover:mr-2"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Ecosystem</h3>
              <ul className="space-y-4">
                {['Research Blog', 'Case Studies', 'Faculty Portal', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center group">
                      <span className="w-0 group-hover:w-3 h-[1px] bg-indigo-500 transition-all mr-0 group-hover:mr-2"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-8">Connect</h3>
              <div className="flex gap-4 mb-8">
                {['FB', 'TW', 'LN', 'GH'].map((soc) => (
                  <a key={soc} href="#" className="w-10 h-10 border border-slate-700 flex items-center justify-center text-[10px] font-black hover:bg-indigo-600 hover:border-indigo-600 transition-all">
                    {soc}
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Support Terminal: <br/> <span className="text-slate-300">ops@scio.internal</span></p>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-mono text-slate-500 tracking-tight">
            © 2026 SCIO_SYSTEMS_GLOBAL. ALL_RIGHTS_RESERVED. [V2.0.4]
          </div>
          
          <div className="flex gap-8">
            {['Privacy_Protocol', 'Terms_of_Access', 'Cookie_Data'].map((link) => (
              <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;