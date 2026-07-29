import {
  WeatherConditionInfo,
  UnitPreferences,
  ActivityRecommendation,
  CurrentWeather,
  DailyForecastData,
  HourlyForecastData,
} from '../types/weather';

/**
 * WMO Weather Interpretation Codes (WW)
 */
export const WMO_WEATHER_CODES: Record<number, WeatherConditionInfo> = {
  0: {
    description: 'Clear Sky',
    iconName: 'Sun',
    category: 'clear',
    gradientClass: 'from-amber-400 via-orange-500 to-sky-600',
    bgAtmosphereClass: 'bg-gradient-to-br from-amber-500/10 to-sky-500/10',
  },
  1: {
    description: 'Mainly Clear',
    iconName: 'SunMedium',
    category: 'clear',
    gradientClass: 'from-amber-300 via-sky-400 to-indigo-600',
    bgAtmosphereClass: 'bg-gradient-to-br from-amber-400/10 to-sky-500/10',
  },
  2: {
    description: 'Partly Cloudy',
    iconName: 'CloudSun',
    category: 'cloudy',
    gradientClass: 'from-blue-400 via-slate-400 to-indigo-600',
    bgAtmosphereClass: 'bg-gradient-to-br from-blue-400/10 to-slate-500/10',
  },
  3: {
    description: 'Overcast',
    iconName: 'Cloud',
    category: 'cloudy',
    gradientClass: 'from-slate-500 via-gray-600 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-slate-500/10 to-gray-700/10',
  },
  45: {
    description: 'Foggy',
    iconName: 'CloudFog',
    category: 'fog',
    gradientClass: 'from-slate-400 via-zinc-500 to-slate-700',
    bgAtmosphereClass: 'bg-gradient-to-br from-slate-400/10 to-zinc-600/10',
  },
  48: {
    description: 'Depositing Rime Fog',
    iconName: 'CloudFog',
    category: 'fog',
    gradientClass: 'from-teal-600 via-slate-600 to-blue-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-teal-500/10 to-blue-800/10',
  },
  51: {
    description: 'Light Drizzle',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    gradientClass: 'from-blue-400 via-cyan-500 to-slate-700',
    bgAtmosphereClass: 'bg-gradient-to-br from-cyan-500/10 to-blue-700/10',
  },
  53: {
    description: 'Moderate Drizzle',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    gradientClass: 'from-sky-500 via-blue-600 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-sky-500/10 to-blue-800/10',
  },
  55: {
    description: 'Dense Drizzle',
    iconName: 'CloudRain',
    category: 'drizzle',
    gradientClass: 'from-blue-600 via-indigo-700 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-indigo-500/10 to-slate-900/10',
  },
  56: {
    description: 'Light Freezing Drizzle',
    iconName: 'CloudSnow',
    category: 'drizzle',
    gradientClass: 'from-cyan-400 via-blue-600 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-cyan-400/10 to-slate-800/10',
  },
  57: {
    description: 'Dense Freezing Drizzle',
    iconName: 'CloudSnow',
    category: 'drizzle',
    gradientClass: 'from-teal-400 via-indigo-600 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-teal-400/10 to-slate-900/10',
  },
  61: {
    description: 'Slight Rain',
    iconName: 'CloudRain',
    category: 'rain',
    gradientClass: 'from-blue-400 via-indigo-600 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-blue-400/10 to-indigo-800/10',
  },
  63: {
    description: 'Moderate Rain',
    iconName: 'CloudRain',
    category: 'rain',
    gradientClass: 'from-indigo-500 via-blue-700 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-blue-600/10 to-slate-900/10',
  },
  65: {
    description: 'Heavy Rain',
    iconName: 'CloudRainWind',
    category: 'rain',
    gradientClass: 'from-blue-700 via-indigo-900 to-slate-950',
    bgAtmosphereClass: 'bg-gradient-to-br from-indigo-700/10 to-slate-950/10',
  },
  66: {
    description: 'Light Freezing Rain',
    iconName: 'CloudSnow',
    category: 'rain',
    gradientClass: 'from-cyan-500 via-blue-700 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-cyan-500/10 to-slate-900/10',
  },
  67: {
    description: 'Heavy Freezing Rain',
    iconName: 'CloudSnow',
    category: 'rain',
    gradientClass: 'from-teal-600 via-indigo-800 to-slate-950',
    bgAtmosphereClass: 'bg-gradient-to-br from-teal-600/10 to-slate-950/10',
  },
  71: {
    description: 'Slight Snow Fall',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-sky-200 via-indigo-400 to-slate-700',
    bgAtmosphereClass: 'bg-gradient-to-br from-sky-200/20 to-slate-700/10',
  },
  73: {
    description: 'Moderate Snow Fall',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-blue-300 via-sky-500 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-blue-300/20 to-slate-800/10',
  },
  75: {
    description: 'Heavy Snow Fall',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-indigo-300 via-blue-600 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-indigo-300/20 to-slate-900/10',
  },
  77: {
    description: 'Snow Grains',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-sky-300 via-indigo-500 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-sky-300/20 to-slate-800/10',
  },
  80: {
    description: 'Slight Rain Showers',
    iconName: 'CloudRain',
    category: 'rain',
    gradientClass: 'from-sky-400 via-blue-600 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-sky-400/10 to-blue-800/10',
  },
  81: {
    description: 'Moderate Rain Showers',
    iconName: 'CloudRain',
    category: 'rain',
    gradientClass: 'from-blue-500 via-indigo-700 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-blue-500/10 to-indigo-900/10',
  },
  82: {
    description: 'Violent Rain Showers',
    iconName: 'CloudRainWind',
    category: 'rain',
    gradientClass: 'from-indigo-600 via-purple-900 to-slate-950',
    bgAtmosphereClass: 'bg-gradient-to-br from-purple-800/10 to-slate-950/10',
  },
  85: {
    description: 'Slight Snow Showers',
    iconName: 'CloudSnow',
    category: 'snow',
    gradientClass: 'from-sky-300 via-indigo-500 to-slate-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-sky-300/20 to-slate-800/10',
  },
  86: {
    description: 'Heavy Snow Showers',
    iconName: 'CloudSnow',
    category: 'snow',
    gradientClass: 'from-indigo-400 via-blue-700 to-slate-900',
    bgAtmosphereClass: 'bg-gradient-to-br from-indigo-400/20 to-slate-900/10',
  },
  95: {
    description: 'Thunderstorm',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    gradientClass: 'from-amber-600 via-purple-900 to-slate-950',
    bgAtmosphereClass: 'bg-gradient-to-br from-amber-600/15 to-purple-950/20',
  },
  96: {
    description: 'Thunderstorm with Slight Hail',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    gradientClass: 'from-yellow-600 via-indigo-900 to-slate-950',
    bgAtmosphereClass: 'bg-gradient-to-br from-yellow-600/15 to-indigo-950/20',
  },
  99: {
    description: 'Thunderstorm with Heavy Hail',
    iconName: 'CloudLightning',
    category: 'thunderstorm',
    gradientClass: 'from-red-600 via-purple-950 to-slate-950',
    bgAtmosphereClass: 'bg-gradient-to-br from-red-600/15 to-slate-950/20',
  },
};

export function getWeatherInfo(code: number, isDay: number = 1): WeatherConditionInfo {
  const info = WMO_WEATHER_CODES[code] || {
    description: 'Unknown Conditions',
    iconName: 'Cloud',
    category: 'cloudy',
    gradientClass: 'from-gray-500 via-slate-600 to-zinc-800',
    bgAtmosphereClass: 'bg-gradient-to-br from-slate-500/10 to-zinc-800/10',
  };

  if (!isDay && code <= 1) {
    return {
      ...info,
      description: code === 0 ? 'Clear Night' : 'Mainly Clear Night',
      iconName: 'Moon',
      gradientClass: 'from-indigo-900 via-slate-900 to-zinc-950',
      bgAtmosphereClass: 'bg-gradient-to-br from-indigo-950/30 to-slate-950/30',
    };
  }

  return info;
}

// Unit Converters
export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const f = (celsius * 9) / 5 + 32;
    return `${Math.round(f)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatWind(kmh: number, unit: 'kmh' | 'mph' | 'ms'): string {
  if (unit === 'mph') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  if (unit === 'ms') {
    const ms = kmh / 3.6;
    return `${ms.toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecip(mm: number, unit: 'mm' | 'in'): string {
  if (unit === 'in') {
    const inches = mm * 0.0393701;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatDayName(dateString: string, isTodayIndex: boolean = false): string {
  if (isTodayIndex) return 'Today';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatHourTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatSunTime(isoString: string): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/**
 * Generates Planning Recommendations based on retrieved current weather & daily forecast
 */
export function generatePlanningRecommendations(
  current: CurrentWeather,
  daily?: DailyForecastData
): ActivityRecommendation[] {
  const tempC = current.temperature_2m;
  const windKmh = current.wind_speed_10m;
  const code = current.weather_code;
  const precipProb = daily?.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 0);
  const uvMax = daily?.uv_index_max?.[0] ?? 3;

  const list: ActivityRecommendation[] = [];

  // 1. Clothing Advice
  if (tempC < 5) {
    list.push({
      activity: 'Clothing',
      category: 'clothing',
      score: 'caution',
      title: 'Heavy Winter Wear Needed',
      description: 'Freezing temperatures. Wear a heavy thermal coat, scarf, gloves, and warm boots.',
      icon: 'Shirt',
    });
  } else if (tempC >= 5 && tempC < 15) {
    list.push({
      activity: 'Clothing',
      category: 'clothing',
      score: 'good',
      title: 'Layered Warm Clothing',
      description: 'Cool weather. A medium jacket, fleece, or sweater with jeans is recommended.',
      icon: 'Shirt',
    });
  } else if (tempC >= 15 && tempC < 25) {
    list.push({
      activity: 'Clothing',
      category: 'clothing',
      score: 'excellent',
      title: 'Light & Comfortable Attire',
      description: 'Pleasant temperatures! T-shirts, light long sleeves, and comfortable pants are ideal.',
      icon: 'Shirt',
    });
  } else {
    list.push({
      activity: 'Clothing',
      category: 'clothing',
      score: 'caution',
      title: 'Breathable Summer Wear',
      description: 'Warm to hot weather. Wear loose, light-colored cotton or linen clothes and sunglasses.',
      icon: 'Sun',
    });
  }

  // Umbrella / Rain Check
  if (code >= 51 || precipProb > 40 || current.precipitation > 0.5) {
    list.push({
      activity: 'Rain Preparedness',
      category: 'travel',
      score: 'poor',
      title: 'Carry an Umbrella or Raincoat',
      description: `High likelihood of precipitation (${precipProb}% chance). Waterproof gear is essential today.`,
      icon: 'Umbrella',
    });
  } else {
    list.push({
      activity: 'Rain Preparedness',
      category: 'travel',
      score: 'excellent',
      title: 'Dry Conditions Expected',
      description: 'Low chance of rain. Great day to head outside without rain gear.',
      icon: 'Sun',
    });
  }

  // 2. Outdoor Running & Cycling
  if (code >= 61 || code >= 95) {
    list.push({
      activity: 'Running & Cycling',
      category: 'outdoor',
      score: 'poor',
      title: 'Indoor Workout Recommended',
      description: 'Rain or thunderstorm risks make outdoor running slippery and unsafe.',
      icon: 'Activity',
    });
  } else if (tempC < 2 || tempC > 32 || windKmh > 35) {
    list.push({
      activity: 'Running & Cycling',
      category: 'outdoor',
      score: 'caution',
      title: 'Exercise with Caution',
      description: `Extreme temperatures (${Math.round(tempC)}°C) or strong winds (${Math.round(windKmh)} km/h). Stay hydrated and pace yourself.`,
      icon: 'Activity',
    });
  } else {
    list.push({
      activity: 'Running & Cycling',
      category: 'outdoor',
      score: 'excellent',
      title: 'Great Outdoor Fitness Day',
      description: 'Moderate temperatures and clean conditions offer optimal outdoor cardio settings.',
      icon: 'Activity',
    });
  }

  // 3. Outdoor Dining & Picnic
  if (code <= 2 && tempC >= 18 && tempC <= 28 && windKmh < 20) {
    list.push({
      activity: 'Picnics & Outdoor Dining',
      category: 'outdoor',
      score: 'excellent',
      title: 'Perfect Patio Weather',
      description: 'Mild breeze, comfortable sunshine, and low humidity make outdoor seating fantastic.',
      icon: 'Utensils',
    });
  } else {
    list.push({
      activity: 'Picnics & Outdoor Dining',
      category: 'outdoor',
      score: 'caution',
      title: 'Indoor Seating Preferred',
      description: 'Cloudy, chilly, or breezy conditions suggest opting for cozy indoor dining.',
      icon: 'Utensils',
    });
  }

  // 4. UV & Sun Protection
  if (uvMax >= 6) {
    list.push({
      activity: 'Sun Safety',
      category: 'health',
      score: 'caution',
      title: `High UV Index (${uvMax})`,
      description: 'Apply SPF 30+ sunscreen, wear a wide-brimmed hat, and seek shade during peak hours (11am-4pm).',
      icon: 'SunDim',
    });
  } else {
    list.push({
      activity: 'Sun Safety',
      category: 'health',
      score: 'good',
      title: `Low UV Exposure (${uvMax})`,
      description: 'Minimal risk from solar radiation. Normal sun precautions apply.',
      icon: 'SunDim',
    });
  }

  return list;
}
