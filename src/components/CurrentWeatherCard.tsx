import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  Cloud,
  CloudSun,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  Wind,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  ArrowUpRight,
  Navigation,
  Thermometer,
  ShieldAlert,
  Snowflake,
} from 'lucide-react';
import {
  CityLocation,
  OpenMeteoForecastResponse,
  UnitPreferences,
} from '../types/weather';
import {
  getWeatherInfo,
  formatTemp,
  formatWind,
  formatPrecip,
  getWindDirectionText,
  formatSunTime,
} from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  city: CityLocation;
  weather: OpenMeteoForecastResponse;
  units: UnitPreferences;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sun,
  SunMedium,
  Moon,
  Cloud,
  CloudSun,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  Snowflake,
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  weather,
  units,
}) => {
  const current = weather.current;
  const daily = weather.daily;

  if (!current) return null;

  const info = getWeatherInfo(current.weather_code, current.is_day);
  const IconComponent = ICON_MAP[info.iconName] || Cloud;

  const todayMaxTemp = daily?.temperature_2m_max?.[0] ?? current.temperature_2m;
  const todayMinTemp = daily?.temperature_2m_min?.[0] ?? current.temperature_2m;
  const uvIndex = daily?.uv_index_max?.[0] ?? 0;
  const sunrise = daily?.sunrise?.[0] ?? '';
  const sunset = daily?.sunset?.[0] ?? '';

  // Calculate UV risk level
  const getUvRisk = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    return { text: 'Extreme', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
  };

  const uvRisk = getUvRisk(uvIndex);

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden rounded-3xl bg-[#141417] border border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-xl h-full flex flex-col justify-between"
    >
      {/* Dynamic Background Glow */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${info.bgAtmosphereClass}`}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Row: City Name + Time & Atmospheric Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                {city.name}
              </h2>
              {city.country && (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/5 text-blue-300 border border-white/10">
                  {city.country}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono flex flex-wrap items-center gap-2">
              {city.admin1 && <span>{city.admin1} • </span>}
              <span>Lat: {city.latitude.toFixed(2)}°, Lon: {city.longitude.toFixed(2)}°</span>
              <span>• Zone: {weather.timezone}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 shadow-inner">
              <IconComponent className="w-8 h-8 text-blue-400 animate-pulse" />
              <div>
                <span className="text-sm font-bold text-white block">
                  {info.description}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {current.is_day ? 'Daytime Condition' : 'Nighttime Condition'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Temperature Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Temperature Left Banner */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter">
                {formatTemp(current.temperature_2m, units.temp)}
              </span>
              <div className="flex flex-col text-slate-300 text-sm font-medium">
                <span className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                  <Thermometer className="w-4 h-4 text-blue-400" />
                  Feels like: <strong className="text-white text-sm">{formatTemp(current.apparent_temperature, units.temp)}</strong>
                </span>
                <span className="mt-1 text-xs text-slate-400 font-mono">
                  High: <strong className="text-rose-400">{formatTemp(todayMaxTemp, units.temp)}</strong> • Low: <strong className="text-blue-400">{formatTemp(todayMinTemp, units.temp)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Highlight Cards Right Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Wind */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-medium uppercase">Wind</span>
                <Wind className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3">
                <span className="text-base font-bold text-white font-mono block">
                  {formatWind(current.wind_speed_10m, units.wind)}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-1">
                  <Navigation
                    className="w-3 h-3 text-blue-400"
                    style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
                  />
                  {getWindDirectionText(current.wind_direction_10m)} ({current.wind_direction_10m}°)
                </span>
              </div>
            </div>

            {/* Humidity */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-medium uppercase">Humidity</span>
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3">
                <span className="text-base font-bold text-white font-mono block">
                  {current.relative_humidity_2m}%
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  {current.relative_humidity_2m > 70
                    ? 'High Humidity'
                    : current.relative_humidity_2m < 30
                    ? 'Dry Air'
                    : 'Comfortable'}
                </span>
              </div>
            </div>

            {/* UV Index */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-medium uppercase">UV Index</span>
                <Sun className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">{uvIndex}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${uvRisk.color}`}
                  >
                    {uvRisk.text}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">Peak Solar</span>
              </div>
            </div>

            {/* Barometric Pressure */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono font-medium uppercase">Pressure</span>
                <Gauge className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-3">
                <span className="text-base font-bold text-white font-mono block">
                  {Math.round(current.pressure_msl)} hPa
                </span>
                <span className="text-[10px] font-mono text-slate-400 block mt-1">
                  {current.pressure_msl > 1013 ? 'High Press' : 'Low Press'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Weather Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-4 border-t border-white/5">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
            <Cloud className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Cloud Cover</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {current.cloud_cover}%
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Precipitation</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {formatPrecip(current.precipitation, units.precip)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
            <Sunrise className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Sunrise</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {formatSunTime(sunrise)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
            <Sunset className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Sunset</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {formatSunTime(sunset)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 col-span-2 sm:col-span-4 lg:col-span-1">
            <Wind className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Wind Gusts</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {formatWind(current.wind_gusts_10m, units.wind)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
