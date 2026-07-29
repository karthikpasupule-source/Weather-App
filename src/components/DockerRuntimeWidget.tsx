import React from 'react';
import { Cpu, Terminal, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { CityLocation } from '../types/weather';

interface DockerRuntimeWidgetProps {
  city: CityLocation;
  elevation?: number;
}

export const DockerRuntimeWidget: React.FC<DockerRuntimeWidgetProps> = ({
  city,
  elevation = 35,
}) => {
  return (
    <div className="bg-[#141417] rounded-3xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl h-full">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
              Docker Runtime
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            STABLE
          </span>
        </div>

        <div className="space-y-3">
          <div className="bg-black/40 rounded-2xl p-3.5 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-mono mb-1 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-blue-400" /> Environment
            </p>
            <p className="text-xs font-mono text-blue-300 flex items-center justify-between">
              <span>Ubuntu WSL x64</span>
              <span className="text-[10px] text-slate-400">Node v20.10.0</span>
            </p>
          </div>

          <div className="bg-black/40 rounded-2xl p-3.5 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-mono mb-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> Container Image
            </p>
            <p className="text-xs font-mono text-slate-200 truncate">
              weather-intelligence-app:latest
            </p>
          </div>

          <div className="bg-black/40 rounded-2xl p-3.5 border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-mono mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> API Telemetry
            </p>
            <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Open-Meteo Connected
            </p>
          </div>

          <div className="bg-black/40 rounded-2xl p-3.5 border border-white/5 font-mono text-xs space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">
              Geocoding Coordinates
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">LAT:</span>
              <span className="text-blue-300">{city.latitude.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">LON:</span>
              <span className="text-blue-300">{city.longitude.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-1.5">
              <span className="text-slate-500">ALT:</span>
              <span className="text-blue-300">{elevation}m MSL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          WSL DOCKER HEALTH: OK
        </div>
      </div>
    </div>
  );
};
