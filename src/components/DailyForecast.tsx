import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  Wind,
  Sun,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset,
  Droplet,
  Umbrella,
} from 'lucide-react';
import { DailyForecastData, UnitPreferences } from '../types/weather';
import {
  formatDayName,
  formatTemp,
  formatWind,
  formatPrecip,
  getWeatherInfo,
  formatSunTime,
} from '../utils/weatherUtils';

interface DailyForecastProps {
  daily?: DailyForecastData;
  units: UnitPreferences;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, units }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Default expand today

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate min and max temperature across all 7 days to scale progress bars
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempRange = Math.max(1, allMax - allMin);

  return (
    <div
      id="daily-forecast-section"
      className="rounded-3xl bg-[#141417] border border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-xl h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white tracking-tight">7-Day Extended Outlook</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Daily temperature ranges, rain probability, and atmospheric metrics.
            </p>
          </div>
        </div>

        {/* 7-Day List */}
        <div className="space-y-3">
          {daily.time.map((timeStr, idx) => {
            const maxT = daily.temperature_2m_max[idx];
            const minT = daily.temperature_2m_min[idx];
            const code = daily.weather_code[idx];
            const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
            const rainSum = daily.precipitation_sum?.[idx] ?? 0;
            const uvMax = daily.uv_index_max?.[idx] ?? 0;
            const maxWind = daily.wind_speed_10m_max?.[idx] ?? 0;

            const info = getWeatherInfo(code);
            const isExpanded = expandedDay === idx;

            // Calculate bar position percentages
            const minOffsetPct = Math.max(0, Math.min(100, ((minT - allMin) / tempRange) * 100));
            const maxOffsetPct = Math.max(0, Math.min(100, ((maxT - allMin) / tempRange) * 100));
            const widthPct = Math.max(5, maxOffsetPct - minOffsetPct);

            return (
              <div
                key={timeStr}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-black/60 border-blue-500/50 shadow-xl'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : idx)}
                  id={`daily-card-${idx}`}
                  className="w-full p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left cursor-pointer"
                >
                  {/* Left: Day & Condition */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="w-24 flex-shrink-0 font-mono">
                      <span className="text-xs font-bold text-white block">
                        {formatDayName(timeStr, idx === 0)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {timeStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {info.description}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Temperature Range Bar */}
                  <div className="flex-1 flex items-center gap-3 max-w-md w-full my-1 md:my-0 font-mono">
                    <span className="text-xs font-bold text-blue-400 w-12 text-right">
                      {formatTemp(minT, units.temp)}
                    </span>

                    <div className="flex-1 h-2 rounded-full bg-white/5 relative overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400"
                        style={{
                          left: `${minOffsetPct}%`,
                          width: `${widthPct}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs font-bold text-rose-400 w-12">
                      {formatTemp(maxT, units.temp)}
                    </span>
                  </div>

                  {/* Right: Rain % & Expand Icon */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-2 md:pt-0 font-mono">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-blue-400 font-bold">
                        <CloudRain className="w-3.5 h-3.5" />
                        {rainProb}%
                      </span>
                      <span className="hidden sm:flex items-center gap-1 text-slate-400">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        UV {uvMax}
                      </span>
                    </div>

                    <div className="p-1 rounded-lg bg-white/5 text-slate-300">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block mb-1 flex items-center gap-1 text-[10px]">
                        <Umbrella className="w-3.5 h-3.5 text-blue-400" />
                        PRECIP SUM
                      </span>
                      <span className="text-xs font-bold text-white">
                        {formatPrecip(rainSum, units.precip)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block mb-1 flex items-center gap-1 text-[10px]">
                        <Wind className="w-3.5 h-3.5 text-indigo-400" />
                        MAX WIND
                      </span>
                      <span className="text-xs font-bold text-white">
                        {formatWind(maxWind, units.wind)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block mb-1 flex items-center gap-1 text-[10px]">
                        <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                        SUNRISE
                      </span>
                      <span className="text-xs font-bold text-white">
                        {formatSunTime(daily.sunrise?.[idx] ?? '')}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 block mb-1 flex items-center gap-1 text-[10px]">
                        <Sunset className="w-3.5 h-3.5 text-orange-400" />
                        SUNSET
                      </span>
                      <span className="text-xs font-bold text-white">
                        {formatSunTime(daily.sunset?.[idx] ?? '')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
