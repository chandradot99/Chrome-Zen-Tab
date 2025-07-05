import React from 'react';
import { useTime } from '../hooks/useTime';
import TaskNotes from '../components/TaskNotes';
import MyDates from '../components/MyDates';
import TimeWeather from '../components/TimeWeather';
import QuickLinks from '../components/QuickLinks';
import BackgroundManager, { BackgroundInfoCard } from '../components/BGManager';

const Home: React.FC = () => {
  const currentTime = useTime();

  return (
    <BackgroundManager>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <TimeWeather />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Important Dates (25%) */}
          <div className="col-span-3">
            <MyDates />
          </div>

          {/* Center Column - Tasks & Notes (50%) */}
          <div className="col-span-6">
            <TaskNotes />
          </div>

          {/* Right Column - Quick Links & Background Control (25%) */}
          <div className="col-span-3 space-y-6">
            <QuickLinks />
            
            {/* Background Info Card with working refresh */}
            <BackgroundInfoCard />
          </div>
        </div>
      </div>
    </BackgroundManager>
  );
};

export default Home;
