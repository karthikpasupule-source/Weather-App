import React from 'react';
import { Star, History, Building2, Trash2 } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { POPULAR_CITIES } from '../services/openMeteo';

interface SearchHistoryFavoritesProps {
  favorites: CityLocation[];
  recents: CityLocation[];
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onClearRecents: () => void;
}

export const SearchHistoryFavorites: React.FC<SearchHistoryFavoritesProps> = ({
  favorites,
  recents,
  currentCity,
  onSelectCity,
  onClearRecents,
}) => {
  return (
    <div
      id="favorites-recents-section"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {/* Popular Cities */}
      <div className="p-6 rounded-3xl bg-[#141417] border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Global Weather Hubs
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((city) => {
            const isSelected =
              currentCity.latitude.toFixed(2) === city.latitude.toFixed(2) &&
              currentCity.longitude.toFixed(2) === city.longitude.toFixed(2);
            return (
              <button
                key={city.name}
                onClick={() => onSelectCity(city)}
                id={`popular-city-${city.name.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 shadow-md'
                    : 'bg-black/40 border-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Favorite Cities */}
      <div className="p-6 rounded-3xl bg-[#141417] border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Bookmarked Locations
          </h4>
        </div>
        {favorites.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 italic">
            No bookmarks saved. Click the star icon to save locations.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {favorites.map((city) => {
              const isSelected =
                currentCity.latitude.toFixed(2) === city.latitude.toFixed(2) &&
                currentCity.longitude.toFixed(2) === city.longitude.toFixed(2);
              return (
                <button
                  key={`${city.name}-${city.latitude}`}
                  onClick={() => onSelectCity(city)}
                  id={`favorite-city-${city.name.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-black/40 border-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {city.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Searches */}
      <div className="p-6 rounded-3xl bg-[#141417] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Query History
            </h4>
          </div>
          {recents.length > 0 && (
            <button
              onClick={onClearRecents}
              id="clear-recents-btn"
              className="text-[10px] font-mono text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        {recents.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 italic">No search history recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recents.slice(0, 6).map((city) => {
              const isSelected =
                currentCity.latitude.toFixed(2) === city.latitude.toFixed(2) &&
                currentCity.longitude.toFixed(2) === city.longitude.toFixed(2);
              return (
                <button
                  key={`${city.name}-${city.latitude}`}
                  onClick={() => onSelectCity(city)}
                  id={`recent-city-${city.name.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-md'
                      : 'bg-black/40 border-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
