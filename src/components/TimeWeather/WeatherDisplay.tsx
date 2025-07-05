import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Settings, Clock } from 'lucide-react';
import WeatherSettings from './WeatherSettings';
import { STORAGE_KEYS } from '../../utils/constants';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  lastUpdated: number;
  weatherCode: number;
  isDay: number;
}

interface LocationData {
  lat: number;
  lon: number;
  city: string;
}

interface WeatherDisplayProps {
  onWeatherUpdate?: (weatherData: WeatherData | null) => void;
}

const WEATHER_API_KEY = '85fe6fb8c8f845d79c5101056250407';

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ onWeatherUpdate }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Auto-refresh weather every hour
  useEffect(() => {
    if (location) {
      const interval = setInterval(() => {
        fetchWeather(location.lat, location.lon);
      }, 60 * 60 * 1000); // 1 hour
      
      return () => clearInterval(interval);
    }
  }, [location]);

  // Enhanced weather fetching logic
  useEffect(() => {
    if (location) {
      // Check if we need to fetch fresh weather data
      const shouldFetchFreshData = !weather || 
        (Date.now() - weather.lastUpdated > 15 * 60 * 1000); // 15 minutes threshold
      
      if (shouldFetchFreshData) {
        console.log('Fetching fresh weather data...');
        fetchWeather(location.lat, location.lon);
      } else {
        console.log('Using cached weather data');
      }
    }
  }, [location]);

  // Notify parent component when weather updates
  useEffect(() => {
    if (onWeatherUpdate) {
      onWeatherUpdate(weather);
    }
  }, [weather, onWeatherUpdate]);

  const loadSavedData = async (): Promise<void> => {
    try {
      // Load saved weather data
      const savedWeather = localStorage.getItem(STORAGE_KEYS.WEATHER_DATA);
      if (savedWeather) {
        const weatherData = JSON.parse(savedWeather);
        // Only use saved weather if it's less than 15 minutes old
        if (Date.now() - weatherData.lastUpdated < 15 * 60 * 1000) {
          console.log('Loading cached weather data');
          setWeather(weatherData);
        } else {
          console.log('Weather data expired, will fetch fresh data');
        }
      }

      // Load saved location data
      const savedLocation = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        console.log('Loading saved location:', locationData);
        setLocation(locationData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading saved data:', error);
      setIsLoading(false);
    }
  };

  const saveData = (key: string, data: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Saved ${key}:`, data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const fetchWeather = async (lat: number, lon: number): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Fetching weather data from API...');
      
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`WeatherAPI error: ${response.status}`);
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temp_c),
        description: data.current.condition.text,
        icon: getWeatherEmoji(data.current.condition.code, data.current.is_day),
        city: data.location.name,
        country: data.location.country,
        lastUpdated: Date.now(),
        weatherCode: data.current.condition.code,
        isDay: data.current.is_day
      };

      console.log('Weather data fetched successfully:', weatherData);
      setWeather(weatherData);
      saveData(STORAGE_KEYS.WEATHER_DATA, weatherData);
      setError('');
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherEmoji = (code: number, isDay: number): string => {
    if (code === 1000) return isDay ? '☀️' : '🌙';
    if (code === 1003) return isDay ? '🌤️' : '🌙';
    if (code === 1006 || code === 1009) return '☁️';
    if (code === 1030 || code === 1135 || code === 1147) return '🌫️';
    if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) {
      return '🌧️';
    }
    if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) {
      return '❄️';
    }
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
      return '⛈️';
    }
    return isDay ? '🌤️' : '🌙';
  };

  const refreshWeather = (): void => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  };

  const handleLocationUpdate = (newLocation: LocationData): void => {
    setLocation(newLocation);
    saveData(STORAGE_KEYS.LOCATION, newLocation);
    fetchWeather(newLocation.lat, newLocation.lon);
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-2xl p-4 text-center shadow-2xl relative w-48 h-32 z-[100]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl"></div>
      
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-2 right-2 p-1 text-white/60 hover:text-white/90 transition-colors drop-shadow-lg z-[10]"
        title="Weather settings"
      >
        <Settings size={14} />
      </button>

      <div className="relative h-full flex flex-col justify-center">
        {weather ? (
          <>
            <div className="text-2xl mb-1 drop-shadow-lg">{weather.icon}</div>
            <div className="text-2xl font-light text-white mb-1 drop-shadow-xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
              {weather.temperature}°
            </div>
            <div className="text-xs text-white/80 uppercase tracking-wide capitalize mb-1 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              {weather.description}
            </div>
            <div className="text-xs text-white/70 flex items-center justify-center drop-shadow-lg">
              <MapPin size={10} className="mr-1" />
              <span className="[text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] truncate max-w-24">{weather.city}</span>
            </div>
            <button
              onClick={refreshWeather}
              disabled={isLoading}
              className="absolute bottom-1 right-1 p-1 text-white/60 hover:text-white/90 transition-colors disabled:opacity-50 drop-shadow-lg"
              title="Refresh weather"
            >
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-2xl mb-2">
              <Clock size={24} className="text-white/70 mx-auto drop-shadow-lg" />
            </div>
            <div className="text-white/70 text-xs mb-1 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              No Weather
            </div>
            <div className="text-white/50 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              Set location
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-1 left-1 text-red-300 text-xs max-w-32 drop-shadow-lg bg-red-900/20 px-1 py-0.5 rounded backdrop-blur-sm">
            {error}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <WeatherSettings
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        onLocationUpdate={handleLocationUpdate}
        currentLocation={location}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default WeatherDisplay;
