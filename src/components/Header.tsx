import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Star,
  Compass,
  Settings,
  X,
  Loader2,
  Sparkles,
  Check,
} from 'lucide-react';
import { GeocodingResult, CityLocation, UnitPreferences } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface HeaderProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  units: UnitPreferences;
  onUpdateUnits: (newUnits: UnitPreferences) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  units,
  onUpdateUnits,
  isFavorite,
  onToggleFavorite,
  onUseCurrentLocation,
  isLoadingLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search trigger
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchCities(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
        if (results.length === 0) {
          setSearchError(`No city found matching "${searchQuery}". Try another spelling.`);
        }
      } catch (err) {
        console.error(err);
        setSearchError('Error connecting to geocoding API.');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (result: GeocodingResult) => {
    const cityLoc: CityLocation = {
      name: result.name,
      country: result.country || '',
      admin1: result.admin1,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    };
    onSelectCity(cityLoc);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  return (
    <header className="bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Weather Intelligence
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  v2.1.0-docker
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide uppercase">Containerized Deployment Framework</p>
            </div>
          </div>

          {/* Quick Actions for Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleFavorite}
              id="favorite-btn-mobile"
              className={`p-2 rounded-xl border text-sm transition-all ${
                isFavorite
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-[#141417] border-white/10 text-slate-400 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save as favorite'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              id="settings-btn-mobile"
              className="p-2 rounded-xl bg-[#141417] border border-white/10 text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: City Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl w-full">
          <form onSubmit={handleManualSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city (e.g. Paris, FR, Tokyo, JP, London)..."
              id="city-search-input"
              className="w-full pl-10 pr-24 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLoadingLocation}
              id="geolocation-btn"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-blue-400 transition-colors disabled:opacity-50"
              title="Detect current location"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#141417] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Searching Open-Meteo Geocoding API...
                </div>
              ) : searchError ? (
                <div className="p-4 text-sm text-amber-400 bg-amber-500/10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  {searchError}
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <button
                    key={`${res.id}-${res.latitude}-${res.longitude}`}
                    onClick={() => handleSelectResult(res)}
                    id={`search-item-${res.id}`}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                        {res.name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {[res.admin1, res.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))
              ) : null}
            </div>
          )}
        </div>

        {/* Right Actions: Favorite, Units Settings & Current Location */}
        <div className="hidden md:flex items-center gap-3">
          {/* Favorite Toggle Button */}
          <button
            onClick={onToggleFavorite}
            id="favorite-btn-desktop"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium border transition-all ${
              isFavorite
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-[#141417] border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            {isFavorite ? 'Saved' : 'Favorite'}
          </button>

          {/* Unit Toggle Pill */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              id="unit-settings-btn"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141417] border border-white/10 text-xs text-slate-200 hover:bg-white/5 transition-colors font-mono"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>
                °{units.temp} | {units.wind}
              </span>
            </button>

            {/* Settings Popover */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141417] border border-white/10 rounded-3xl p-5 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Unit Preferences
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Temperature */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs text-slate-400 font-medium">Temperature</span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
                    <button
                      onClick={() => onUpdateUnits({ ...units, temp: 'C' })}
                      id="unit-temp-c"
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        units.temp === 'C'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      onClick={() => onUpdateUnits({ ...units, temp: 'F' })}
                      id="unit-temp-f"
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        units.temp === 'F'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                {/* Wind Speed */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs text-slate-400 font-medium">Wind Speed</span>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                    {(['kmh', 'mph', 'ms'] as const).map((unit) => (
                      <button
                        key={unit}
                        onClick={() => onUpdateUnits({ ...units, wind: unit })}
                        id={`unit-wind-${unit}`}
                        className={`py-1 text-xs font-medium rounded-lg transition-all ${
                          units.wind === unit
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precipitation */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-medium">Precipitation</span>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
                    <button
                      onClick={() => onUpdateUnits({ ...units, precip: 'mm' })}
                      id="unit-precip-mm"
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        units.precip === 'mm'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Millimeters (mm)
                    </button>
                    <button
                      onClick={() => onUpdateUnits({ ...units, precip: 'in' })}
                      id="unit-precip-in"
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        units.precip === 'in'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Inches (in)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
