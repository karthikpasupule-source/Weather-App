import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Clock, Thermometer, CloudRain, Wind, Sun } from 'lucide-react';
import { HourlyForecastData, UnitPreferences } from '../types/weather';
import {
  formatTemp,
  formatWind,
  formatHourTime,
  getWeatherInfo,
} from '../utils/weatherUtils';

interface HourlyForecastChartProps {
  hourly?: HourlyForecastData;
  units: UnitPreferences;
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({
  hourly,
  units,
}) => {
  const [metric, setMetric] = useState<'temp' | 'rain' | 'wind' | 'uv'>('temp');

  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take the next 24 hours of data starting from now or first entry
  const chartData = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const rawTemp = hourly.temperature_2m[idx];
    const tempVal =
      units.temp === 'F' ? Math.round((rawTemp * 9) / 5 + 32) : Math.round(rawTemp);

    const rawWind = hourly.wind_speed_10m[idx];
    const windVal =
      units.wind === 'mph'
        ? Math.round(rawWind * 0.621371)
        : Math.round(rawWind);

    return {
      timeIso: timeStr,
      timeLabel: formatHourTime(timeStr),
      temperature: tempVal,
      precipitationProb: hourly.precipitation_probability?.[idx] ?? 0,
      windSpeed: windVal,
      uvIndex: hourly.uv_index?.[idx] ?? 0,
      weatherCode: hourly.weather_code?.[idx] ?? 0,
    };
  });

  const getMetricConfig = () => {
    switch (metric) {
      case 'temp':
        return {
          dataKey: 'temperature',
          label: `Temperature (°${units.temp})`,
          stroke: '#38bdf8',
          fill: 'url(#tempGradient)',
          unitLabel: `°${units.temp}`,
        };
      case 'rain':
        return {
          dataKey: 'precipitationProb',
          label: 'Precipitation Chance (%)',
          stroke: '#60a5fa',
          fill: 'url(#rainGradient)',
          unitLabel: '%',
        };
      case 'wind':
        return {
          dataKey: 'windSpeed',
          label: `Wind Speed (${units.wind})`,
          stroke: '#a855f7',
          fill: 'url(#windGradient)',
          unitLabel: units.wind,
        };
      case 'uv':
        return {
          dataKey: 'uvIndex',
          label: 'UV Index',
          stroke: '#f59e0b',
          fill: 'url(#uvGradient)',
          unitLabel: ' UV',
        };
    }
  };

  const metricConfig = getMetricConfig();

  return (
    <div
      id="hourly-forecast-chart-section"
      className="rounded-3xl bg-[#141417] border border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-xl h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white tracking-tight">
                24-Hour Interactive Trend
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Hourly meteorological progression over the next 24 hours.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-1 p-1 bg-black/40 rounded-2xl border border-white/5">
            <button
              onClick={() => setMetric('temp')}
              id="metric-tab-temp"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all ${
                metric === 'temp'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              Temp
            </button>
            <button
              onClick={() => setMetric('rain')}
              id="metric-tab-rain"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all ${
                metric === 'rain'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              Rain %
            </button>
            <button
              onClick={() => setMetric('wind')}
              id="metric-tab-wind"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all ${
                metric === 'wind'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              Wind
            </button>
            <button
              onClick={() => setMetric('uv')}
              id="metric-tab-uv"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all ${
                metric === 'uv'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              UV Index
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timeLabel"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const info = getWeatherInfo(item.weatherCode);
                    return (
                      <div className="bg-[#0A0A0B] border border-white/10 p-3.5 rounded-2xl shadow-2xl text-xs font-mono">
                        <p className="font-bold text-slate-300 border-b border-white/5 pb-1 mb-1">
                          {item.timeLabel}
                        </p>
                        <p className="text-blue-400 font-bold text-sm">
                          {metricConfig.label}: {item[metricConfig.dataKey]} {metricConfig.unitLabel}
                        </p>
                        <p className="text-slate-400 mt-1">{info.description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={metricConfig.dataKey}
                stroke={metricConfig.stroke}
                strokeWidth={3}
                fillOpacity={1}
                fill={metricConfig.fill}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Mini Cards Horizontal Carousel */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
            Hourly Carousel Overview
          </h4>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {chartData.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="flex-shrink-0 w-24 p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all text-center flex flex-col items-center justify-between gap-1 font-mono"
                >
                  <span className="text-[10px] text-slate-500">{item.timeLabel}</span>
                  <span className="text-xs font-bold text-white my-1">
                    {item.temperature}°{units.temp}
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 flex items-center gap-0.5">
                    <CloudRain className="w-2.5 h-2.5" />
                    {item.precipitationProb}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
