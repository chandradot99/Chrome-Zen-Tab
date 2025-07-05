import React, { useState } from 'react';

interface LocationData {
  lat: number;
  lon: number;
  city: string;
}

interface WeatherSettingsProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationUpdate: (location: LocationData) => void;
  currentLocation: LocationData | null;
  isLoading: boolean;
  error: string;
}

const WEATHER_API_KEY = '85fe6fb8c8f845d79c5101056250407';

const WeatherSettings: React.FC<WeatherSettingsProps> = ({
  isVisible,
  onClose,
  onLocationUpdate,
  currentLocation,
  isLoading,
  error
}) => {
  const [manualCity, setManualCity] = useState<string>('');
  const [localError, setLocalError] = useState<string>('');

  const getCurrentLocation = (): void => {
    if (!navigator.geolocation) {
      setLocalError('Geolocation is not supported by this browser');
      return;
    }

    setLocalError('');

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
          
          onLocationUpdate(locationData);
        } catch (error) {
          console.error('Error getting location:', error);
          setLocalError('Failed to get location information');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocalError('Unable to get your location. Please set city manually.');
      }
    );
  };

  const searchCity = async (cityName: string): Promise<void> => {
    if (!cityName.trim()) return;

    setLocalError('');

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

        onLocationUpdate(locationData);
        setManualCity('');
        onClose();
      } else {
        setLocalError('City not found. Please try a different name.');
      }
    } catch (error) {
      console.error('Error searching city:', error);
      setLocalError('Failed to search for city');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-72 backdrop-blur-xl bg-black/90 border border-white/30 rounded-xl p-3 shadow-2xl z-[100]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
            Weather Settings
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            ✕
          </button>
        </div>
        
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

        {currentLocation && (
          <div className="mt-2 text-xs text-white/80 drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
            Current: {currentLocation.city}
          </div>
        )}

        {(error || localError) && (
          <div className="mt-2 text-xs text-red-300 drop-shadow-sm bg-red-900/20 px-2 py-1 rounded backdrop-blur-sm">
            {error || localError}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherSettings;
