import React from 'react';
import { AlertTriangle, RefreshCw, MapPin } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { POPULAR_CITIES } from '../services/openMeteo';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
  onSelectCity: (city: CityLocation) => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  return (
    <div
      id="error-alert-card"
      className="rounded-3xl bg-[#141417] border border-amber-500/30 p-6 md:p-8 backdrop-blur-xl text-center flex flex-col items-center max-w-2xl mx-auto my-8 shadow-2xl font-mono"
    >
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 animate-bounce" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Telemetry Alert</h3>
      <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">{message}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          id="retry-api-btn"
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Open-Meteo Connection
        </button>
      </div>

      {/* Suggested Cities Fallback */}
      <div className="mt-8 pt-6 border-t border-white/5 w-full">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Select a default location:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => onSelectCity(city)}
              id={`fallback-city-${city.name.toLowerCase()}`}
              className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 hover:text-blue-400 hover:border-blue-500/50 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3 h-3 text-blue-400" />
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
