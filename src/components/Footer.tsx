import React from 'react';
import { Terminal, ShieldCheck, ExternalLink, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0B] border-t border-white/10 mt-12 py-8 px-4 lg:px-8 text-xs text-slate-500 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Left info */}
        <div>
          <p className="font-bold text-slate-300 text-xs">
            Weather Intelligence App • Open-Meteo Integration
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Containerized Docker deployment ready for Ubuntu WSL and Cloud Run environments.
          </p>
        </div>

        {/* Center Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-[#141417] border border-white/10 text-blue-300 flex items-center gap-1.5 text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Ubuntu WSL
          </span>
          <span className="px-3 py-1 rounded-xl bg-[#141417] border border-white/10 text-cyan-300 flex items-center gap-1.5 text-[10px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Docker Engine
          </span>
          <span className="px-3 py-1 rounded-xl bg-[#141417] border border-white/10 text-emerald-400 flex items-center gap-1.5 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Open-Meteo API OK
          </span>
        </div>

        {/* Right Links */}
        <div>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 flex items-center gap-1 transition-colors inline-flex text-xs"
          >
            Open-Meteo Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
