import {
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoForecastResponse,
  CityLocation,
} from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches for cities matching the user query
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(
    cleanQuery
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server responded with status ${response.status}`);
    }
    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (err: unknown) {
    console.error('Error in searchCities:', err);
    throw new Error(
      err instanceof Error
        ? err.message
        : 'Failed to search cities. Please check your network connection.'
    );
  }
}

/**
 * Fetches comprehensive current, hourly, and daily weather data from Open-Meteo
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<OpenMeteoForecastResponse> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'rain_sum',
    'showers_sum',
    'snowfall_sum',
    'precipitation_hours',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'pressure_msl',
    'surface_pressure',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'uv_index',
  ].join(',');

  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&daily=${dailyParams}&hourly=${hourlyParams}&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service returned status code ${response.status}`);
    }
    const data: OpenMeteoForecastResponse = await response.json();
    return data;
  } catch (err: unknown) {
    console.error('Error fetching weather data:', err);
    throw new Error(
      err instanceof Error
        ? err.message
        : 'Unable to retrieve weather forecast. Please try again later.'
    );
  }
}

/**
 * Default preset cities for quick navigation
 */
export const POPULAR_CITIES: CityLocation[] = [
  { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
];
