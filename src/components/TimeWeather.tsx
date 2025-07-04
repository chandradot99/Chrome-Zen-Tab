import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Settings, Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';

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

interface TimeWeatherProps {
  onWeatherUpdate?: (weatherData: WeatherData | null) => void;
}

const WEATHER_API_KEY = '85fe6fb8c8f845d79c5101056250407';

const TimeWeather: React.FC<TimeWeatherProps> = ({ onWeatherUpdate }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [manualCity, setManualCity] = useState<string>('');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Inspirational quotes for the greeting
  const quotes = [
    "Every moment is a fresh beginning.",
    "Believe you can and you're halfway there.",
    "The way to get started is to quit talking and begin doing.",
    "Don't let yesterday take up too much of today.",
    "All our dreams can come true if we have the courage to pursue them.",
    "Life is really simple, but we insist on making it complicated.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You are never too old to set another goal or to dream a new dream."
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [quotes.length]);

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

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: "Good Morning", icon: <Sunrise className="text-yellow-400" size={16} /> };
    } else if (hour >= 12 && hour < 17) {
      return { text: "Good Afternoon", icon: <Sun className="text-orange-400" size={16} /> };
    } else if (hour >= 17 && hour < 21) {
      return { text: "Good Evening", icon: <Sunset className="text-orange-500" size={16} /> };
    } else {
      return { text: "Good Night", icon: <Moon className="text-blue-300" size={16} /> };
    }
  };

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

  const getCurrentLocation = (): void => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`
          );
          
          if (!response.ok) {
            throw new Error(`WeatherAPI error: ${response.status}`);
          }
          
          const data = await response.json();
          
          const locationData: LocationData = {
            lat,
            lon,
            city: data.location.name
          };
          
          setLocation(locationData);
          saveData(STORAGE_KEYS.LOCATION, locationData);
          
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

          setWeather(weatherData);
          saveData(STORAGE_KEYS.WEATHER_DATA, weatherData);
        } catch (error) {
          console.error('Error getting location:', error);
          setError('Failed to get location information');
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please set city manually.');
        setIsLoading(false);
      }
    );
  };

  const searchCity = async (cityName: string): Promise<void> => {
    if (!cityName.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(cityName)}`
      );

      if (!response.ok) {
        throw new Error(`WeatherAPI search error: ${response.status}`);
      }

      const searchData = await response.json();

      if (searchData && searchData.length > 0) {
        const locationData: LocationData = {
          lat: searchData[0].lat,
          lon: searchData[0].lon,
          city: searchData[0].name
        };

        setLocation(locationData);
        saveData(STORAGE_KEYS.LOCATION, locationData);
        await fetchWeather(locationData.lat, locationData.lon);
        setManualCity('');
        setShowSettings(false);
      } else {
        setError('City not found. Please try a different name.');
      }
    } catch (error) {
      console.error('Error searching city:', error);
      setError('Failed to search for city');
    }

    setIsLoading(false);
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

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const refreshWeather = (): void => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    }
  };

  const greeting = getGreeting();
  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Time Display */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/25 rounded-2xl p-4 shadow-2xl w-48 h-32">
        <div className="relative h-full flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl"></div>
          <div className="relative text-center">
            <div className="text-3xl font-thin text-white mb-1 tracking-wide drop-shadow-2xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-white/90 font-light drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Greeting in the Middle */}
      <div className="flex flex-col items-center justify-center px-6">
        {/* Clean Greeting */}
        <div className="flex items-center space-x-2 mb-2">
          {greeting.icon}
          <h2 className="text-lg font-light text-white drop-shadow-xl [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
            {greeting.text}
          </h2>
        </div>
        
        {/* Minimal Quote */}
        <div className="max-w-xs text-center">
          <p className="text-white/70 text-xs font-light italic drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)] transition-all duration-500">
            "{currentQuote}"
          </p>
        </div>
      </div>

      {/* Weather Display */}
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

        {/* Compact Settings Panel */}
        {showSettings && (
          <div className="absolute top-full right-0 mt-2 w-72 backdrop-blur-xl bg-black/90 border border-white/30 rounded-xl p-3 shadow-2xl z-[100]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
            
            <div className="relative">
              <h3 className="text-white font-semibold mb-3 text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
                Weather Settings
              </h3>
              
              <div className="mb-3">
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="w-full py-2 px-3 bg-green-500/80 hover:bg-green-600/80 disabled:bg-gray-500/80 text-white text-sm rounded-lg transition-colors backdrop-blur-sm shadow-lg border border-white/20"
                >
                  <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                    {isLoading ? 'Getting Location...' : 'Use My Location'}
                  </span>
                </button>
              </div>

              <div>
                <label className="block text-white/90 text-sm mb-2 drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                  Enter City Name
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    placeholder="Enter city name..."
                    className="flex-1 bg-white/20 border border-white/30 rounded-lg p-2 text-white placeholder-white/60 text-sm outline-none focus:bg-white/25 focus:border-white/50 backdrop-blur-sm shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && searchCity(manualCity)}
                  />
                  <button
                    onClick={() => searchCity(manualCity)}
                    disabled={isLoading || !manualCity.trim()}
                    className="px-3 py-2 bg-blue-600/80 hover:bg-blue-500/80 disabled:bg-gray-500/80 text-white text-sm rounded-lg transition-colors backdrop-blur-sm shadow-lg border border-white/20"
                  >
                    <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                      Search
                    </span>
                  </button>
                </div>
              </div>

              {location && (
                <div className="mt-2 text-xs text-white/80 drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                  Current: {location.city}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeWeather;