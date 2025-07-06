import React, { useState, useEffect } from 'react';
import { RotateCcw, ExternalLink } from 'lucide-react';

interface BackgroundManagerProps {
  children: React.ReactNode;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ children }) => {
  const [currentBackground, setCurrentBackground] = useState<string>('');
  const [currentSeed, setCurrentSeed] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('');

  // Fallback gradient background
  const fallbackBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

  // Get current time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'sunrise';
    if (hour >= 8 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'sunset';
    return 'night';
  };

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  // Get appropriate nature category based on time and season
  const getNatureCategory = () => {
    const timeOfDay = getTimeOfDay();
    const season = getCurrentSeason();
    
    // Time-based categories
    const timeCategories = {
      sunrise: ['sunrise', 'dawn', 'morning', 'golden-hour', 'misty-landscape'],
      day: ['landscape', 'mountains', 'forest', 'meadow', 'clear-sky'],
      sunset: ['sunset', 'dusk', 'golden-light', 'evening-sky', 'warm-colors'],
      night: ['starry-sky', 'moonlit', 'dark-forest', 'night-sky', 'aurora']
    };

    // Season-based categories  
    const seasonCategories = {
      spring: ['blooming-trees', 'green-fields', 'flowers', 'fresh-leaves'],
      summer: ['sunny-day', 'blue-sky', 'bright-landscape', 'ocean'],
      autumn: ['fall-colors', 'golden-leaves', 'harvest', 'warm-tones'],
      winter: ['snow-landscape', 'frost', 'winter-trees', 'cold-beauty']
    };

    // Combine categories based on current conditions
    const availableCategories = [
      ...timeCategories[timeOfDay],
      ...seasonCategories[season]
    ];

    // Return a random category from the appropriate ones
    return availableCategories[Math.floor(Math.random() * availableCategories.length)];
  };

  // Generate a smart seed based on category and randomness
  const generateSmartSeed = () => {
    const category = getNatureCategory();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return {
      seed: `${category}-${timestamp}-${random}`,
      category: category
    };
  };

  // Load a contextual nature background
  const loadContextualBackground = () => {
    const { seed, category } = generateSmartSeed();
    const newUrl = `https://picsum.photos/seed/${seed}/1920/1080?blur=1`;
    
    console.log('Loading contextual background:', { category, seed });
    
    // Pre-load the image silently
    const img = new Image();
    img.onload = () => {
      setCurrentBackground(newUrl);
      setCurrentSeed(seed);
      setCurrentCategory(category);
    };
    img.onerror = () => {
      console.warn('Failed to load background image');
    };
    img.src = newUrl;
  };

  // Initial load
  useEffect(() => {
    loadContextualBackground();
  }, []);

  // Refresh every hour to get time-appropriate backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      loadContextualBackground();
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, []);

  // Listen for refresh events from BackgroundInfoCard
  useEffect(() => {
    const handleBackgroundRefresh = () => {
      loadContextualBackground();
    };

    window.addEventListener('backgroundRefresh', handleBackgroundRefresh);
    
    return () => {
      window.removeEventListener('backgroundRefresh', handleBackgroundRefresh);
    };
  }, []);

  // Get time-appropriate overlay opacity
  const getTimeBasedOverlay = () => {
    const timeOfDay = getTimeOfDay();
    switch (timeOfDay) {
      case 'sunrise':
      case 'sunset':
        return 'bg-black/60'; // Lighter for golden hours
      case 'night':
        return 'bg-black/80'; // Darker for night
      default:
        return 'bg-black/70'; // Default for day
    }
  };

  // Author Attribution Component
  const AuthorAttribution = () => {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <div className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-white/70 text-xs">
            <span>📸</span>
            <span>Nature by</span>
            <a 
              href="https://picsum.photos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/90 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white/60"
            >
              Lorem Picsum
            </a>
            <ExternalLink size={10} className="text-white/50" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Layer - Always show fallback first */}
      <div 
        className="fixed inset-0 transition-all duration-1000"
        style={{ background: fallbackBackground }}
      />
      
      {/* Dynamic Background Image - Fades in when loaded */}
      {currentBackground && (
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: `url(${currentBackground})` }}
        />
      )}
      
      {/* Time-based Overlay for better text readability */}
      <div className={`fixed inset-0 transition-all duration-1000 ${getTimeBasedOverlay()}`}></div>

      {/* Floating Orbs Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/4 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Author Attribution */}
      <AuthorAttribution />
    </div>
  );
};

// Export the BackgroundInfoCard as a separate component for use in layouts
export const BackgroundInfoCard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Get current time period for display
  const getTimePeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'Dawn';
    if (hour >= 8 && hour < 17) return 'Day';
    if (hour >= 17 && hour < 20) return 'Dusk';
    return 'Night';
  };

  // Handle manual refresh
  const handleRefreshBackground = () => {
    setIsRefreshing(true);
    setRefreshCount(prev => prev + 1);
    
    // Trigger refresh event
    window.dispatchEvent(new CustomEvent('backgroundRefresh'));
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🌿</span>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefreshBackground}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get new nature background"
          >
            <RotateCcw 
              size={16} 
              className={isRefreshing ? 'animate-spin' : ''} 
            />
          </button>
        </div>
        
        <h3 className="text-white font-medium text-sm mb-2 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
          Nature Background
        </h3>
        <p className="text-white/60 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] mb-2">
          Beautiful nature for every moment
        </p>
        
        {/* Time Period Info */}
        <div className="inline-flex items-center px-2 py-1 bg-white/10 rounded-full mb-2">
          <span className="text-white/50 text-xs">
            {getTimePeriod()} • Natural scenery
          </span>
        </div>
        
        <div className="text-white/40 text-xs">
          {isRefreshing ? 'Loading nature scene...' : 'Updates hourly with time'}
        </div>
      </div>
    </div>
  );
};

export default BackgroundManager;
