import React from 'react';
import TimeDisplay from './TimeDisplay';
import WeatherDisplay from './WeatherDisplay';
import GreetingSection from './GreetingSection';

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

interface TimeWeatherProps {
  onWeatherUpdate?: (weatherData: WeatherData | null) => void;
}

const TimeWeather: React.FC<TimeWeatherProps> = ({ onWeatherUpdate }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Time Display */}
      <TimeDisplay />

      {/* Compact Greeting in the Middle */}
      <GreetingSection />

      {/* Weather Display */}
      <WeatherDisplay onWeatherUpdate={onWeatherUpdate} />
    </div>
  );
};

export default TimeWeather;
