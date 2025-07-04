import React from 'react';
import { useTime } from '../hooks/useTime';
import { useStorage } from '../hooks/useStorage';
import { 
  DEFAULT_BACKGROUNDS, 
  STORAGE_KEYS 
} from './../utils/constants';
import TimeWeather from '../components/TimeWeather';
import TabbedTasksNotes from '../components/DailyNotes';
import BackgroundSelector from '../components/BGSelector';
import QuickLinksManager from '../components/QuickLinks';
import ImportantDatesManager from '../components/Birthdays';

const Home: React.FC = () => {
  const currentTime = useTime();
  
  // Storage hooks for persistent data
  const [activeBackground, setActiveBackground] = useStorage(STORAGE_KEYS.ACTIVE_BACKGROUND, 0);
  const [autoChangeEnabled, setAutoChangeEnabled] = useStorage(STORAGE_KEYS.AUTO_CHANGE_BACKGROUND, true);
  const [backgrounds] = useStorage(STORAGE_KEYS.BACKGROUNDS, DEFAULT_BACKGROUNDS);

  const handleBackgroundChange = (index: number) => {
    setActiveBackground(index);
  };

  const handleToggleAutoChange = () => {
    setAutoChangeEnabled(!autoChangeEnabled);
  };

  const handleSearch = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${backgrounds[activeBackground]?.image})` }}
      ></div>
      
      {/* Overlay with 90% opacity */}
      <div className="fixed inset-0 bg-black/40 transition-all duration-1000"></div>

      {/* Floating Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/4 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <TimeWeather />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Birthdays (25%) */}
          <div className="col-span-3">
            <ImportantDatesManager />
          </div>

          {/* Center Column - Daily Notes (50%) */}
          <div className="col-span-6">
            <TabbedTasksNotes />
          </div>

          {/* Right Column - Quick Links & Controls (25%) */}
          <div className="col-span-3 space-y-6">
            <QuickLinksManager />

            <BackgroundSelector 
              backgrounds={backgrounds}
              activeBackground={activeBackground}
              onBackgroundChange={handleBackgroundChange}
              onToggleAutoChange={handleToggleAutoChange}
              autoChangeEnabled={autoChangeEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
