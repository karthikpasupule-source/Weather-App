import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import {
  CityLocation,
  OpenMeteoForecastResponse,
  UnitPreferences,
} from './types/weather';
import { fetchWeatherData, POPULAR_CITIES } from './services/openMeteo';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { DockerRuntimeWidget } from './components/DockerRuntimeWidget';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { DailyForecast } from './components/DailyForecast';
import { SearchHistoryFavorites } from './components/SearchHistoryFavorites';
import { ErrorAlert } from './components/ErrorAlert';
import { Footer } from './components/Footer';

const LOCAL_STORAGE_FAVORITES_KEY = 'weather_app_favorites_v1';
const LOCAL_STORAGE_RECENTS_KEY = 'weather_app_recents_v1';
const LOCAL_STORAGE_UNITS_KEY = 'weather_app_units_v1';

export default function App() {
  // Current selected city (Default to London)
  const [currentCity, setCurrentCity] = useState<CityLocation>(POPULAR_CITIES[0]);

  // Weather response state
  const [weatherData, setWeatherData] = useState<OpenMeteoForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Unit preferences state
  const [units, setUnits] = useState<UnitPreferences>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_UNITS_KEY);
      return saved ? JSON.parse(saved) : { temp: 'C', wind: 'kmh', precip: 'mm' };
    } catch {
      return { temp: 'C', wind: 'kmh', precip: 'mm' };
    }
  });

  // Favorite cities state
  const [favorites, setFavorites] = useState<CityLocation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[2]];
    } catch {
      return [POPULAR_CITIES[0], POPULAR_CITIES[1], POPULAR_CITIES[2]];
    }
  });

  // Recent searches history state
  const [recents, setRecents] = useState<CityLocation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECENTS_KEY);
      return saved ? JSON.parse(saved) : [POPULAR_CITIES[0]];
    } catch {
      return [POPULAR_CITIES[0]];
    }
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  // Save units to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_UNITS_KEY, JSON.stringify(units));
  }, [units]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save recents to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_RECENTS_KEY, JSON.stringify(recents));
  }, [recents]);

  // Main weather fetch function
  const loadWeather = useCallback(async (city: CityLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(data);

      // Add to recents
      setRecents((prev) => {
        const filtered = prev.filter(
          (c) =>
            c.latitude.toFixed(2) !== city.latitude.toFixed(2) ||
            c.longitude.toFixed(2) !== city.longitude.toFixed(2)
        );
        return [city, ...filtered].slice(0, 10);
      });
    } catch (err: unknown) {
      console.error('Failed to load weather:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to Open-Meteo weather service.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather when current city changes
  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  // Handle city selection
  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
  };

  // Check if current city is in favorites
  const isCurrentFavorite = favorites.some(
    (c) =>
      c.latitude.toFixed(2) === currentCity.latitude.toFixed(2) &&
      c.longitude.toFixed(2) === currentCity.longitude.toFixed(2)
  );

  // Toggle favorite status
  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites((prev) =>
        prev.filter(
          (c) =>
            c.latitude.toFixed(2) !== currentCity.latitude.toFixed(2) ||
            c.longitude.toFixed(2) !== currentCity.longitude.toFixed(2)
        )
      );
    } else {
      setFavorites((prev) => [currentCity, ...prev]);
    }
  };

  // Browser Geolocation lookup
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCity: CityLocation = {
          name: 'Your Location',
          country: 'Current GPS',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setCurrentCity(userCity);
        setIsLoadingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLoadingLocation(false);
        alert('Could not determine current location. Defaulting to selected city.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <Header
        currentCity={currentCity}
        onSelectCity={handleSelectCity}
        units={units}
        onUpdateUnits={setUnits}
        isFavorite={isCurrentFavorite}
        onToggleFavorite={handleToggleFavorite}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Search History & Favorites Navigation Bar */}
        <SearchHistoryFavorites
          favorites={favorites}
          recents={recents}
          currentCity={currentCity}
          onSelectCity={handleSelectCity}
          onClearRecents={() => setRecents([])}
        />

        {/* Loading Spinner State */}
        {isLoading && (
          <div className="rounded-3xl bg-[#141417] border border-white/10 p-16 text-center flex flex-col items-center justify-center my-8 shadow-2xl">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white font-mono">
              Fetching Open-Meteo Telemetry...
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Querying Geocoding & Forecast Endpoints for {currentCity.name}
            </p>
          </div>
        )}

        {/* Error Alert State */}
        {!isLoading && error && (
          <ErrorAlert
            message={error}
            onRetry={() => loadWeather(currentCity)}
            onSelectCity={handleSelectCity}
          />
        )}

        {/* Main Weather Intelligence Bento Grid */}
        {!isLoading && !error && weatherData && (
          <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* 1. Hero Current Weather Display */}
            <div className="col-span-12 lg:col-span-8">
              <CurrentWeatherCard
                city={currentCity}
                weather={weatherData}
                units={units}
              />
            </div>

            {/* 2. Docker Runtime Telemetry Status Widget */}
            <div className="col-span-12 lg:col-span-4">
              <DockerRuntimeWidget
                city={currentCity}
                elevation={weatherData.elevation}
              />
            </div>

            {/* 3. Planning Recommendations Engine */}
            {weatherData.current && (
              <div className="col-span-12 lg:col-span-6">
                <PlanningRecommendations
                  current={weatherData.current}
                  daily={weatherData.daily}
                />
              </div>
            )}

            {/* 4. 24-Hour Interactive Forecast Chart */}
            <div className="col-span-12 lg:col-span-6">
              <HourlyForecastChart
                hourly={weatherData.hourly}
                units={units}
              />
            </div>

            {/* 5. 7-Day Daily Forecast List */}
            <div className="col-span-12">
              <DailyForecast
                daily={weatherData.daily}
                units={units}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer Notice */}
      <Footer />
    </div>
  );
}
