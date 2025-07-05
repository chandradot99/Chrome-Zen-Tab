import React from 'react';
import TimeDisplay from './TimeDisplay';
import WeatherDisplay from './WeatherDisplay';
import GreetingSection from './GreetingSection';
import TimezoneDisplay, { Timezone } from './TimeZoneDisplay';

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
  const [timezones, setTimezones] = React.useState<Timezone[]>([]);

  const handleTimezoneUpdate = (updatedTimezones: Timezone[]) => {
    setTimezones(updatedTimezones);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <TimeDisplay onTimezoneUpdate={handleTimezoneUpdate} />
      {timezones.length ?  <TimezoneDisplay timezones={timezones} /> : <GreetingSection />}
      <WeatherDisplay onWeatherUpdate={onWeatherUpdate} />
    </div>
  );
};

export default TimeWeather;
