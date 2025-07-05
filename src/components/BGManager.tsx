import React, { useState, useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { RotateCcw } from 'lucide-react';

interface BackgroundData {
  url: string;
  timestamp: number;
  date: string;
  category: string;
}

interface BackgroundManagerProps {
  children: React.ReactNode;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Storage for cached background
  const [cachedBackground, setCachedBackground] = useStorage<BackgroundData | null>(
    STORAGE_KEYS.CACHED_BACKGROUND, 
    null
  );

  const [currentBackground, setCurrentBackground] = useState<string>('');

  // Zen-focused categories perfect for productivity backgrounds
  const zenCategories = [
    'nature',      // Natural landscapes
    'landscape',   // Beautiful vistas
    'mountains',   // Inspiring peaks
    'ocean',       // Calming waters
    'sky',         // Open skies
    'forest',      // Peaceful woods
    'sunset',      // Warm, peaceful moments
    'clouds',      // Soft, dreamy skies
  ];

  // Fallback gradient background
  const fallbackBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

  // Get today's date string for comparison
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Generate a consistent seed based on date for same image per day
  const getDailySeed = () => {
    const today = getTodayString();
    const seed = today.split('-').join(''); // Remove dashes: 20241225
    return seed;
  };

  // Get a random zen category
  const getRandomZenCategory = () => {
    return zenCategories[Math.floor(Math.random() * zenCategories.length)];
  };

  // Get Lorem Picsum image URL with daily seed and zen category
  const getDailyBackgroundUrl = (isRefresh = false) => {
    const category = getRandomZenCategory();
    
    if (isRefresh) {
      // For manual refresh, use timestamp to ensure new image
      const timestamp = Date.now();
      return `https://picsum.photos/seed/${category}-${timestamp}/1920/1080?blur=1`;
    } else {
      // For daily auto-change, use date to ensure same image per day
      const seed = getDailySeed();
      return `https://picsum.photos/seed/${category}-${seed}/1920/1080?blur=1`;
    }
  };

  // Check if we need a new background
  const shouldFetchNewBackground = () => {
    if (!cachedBackground) return true;
    
    const today = getTodayString();
    return cachedBackground.date !== today;
  };

  // Load background image silently in the background
  const loadBackground = async (isRefresh = false) => {
    try {
      // Start with cached background if available and not refreshing
      if (!isRefresh && cachedBackground && !shouldFetchNewBackground()) {
        setCurrentBackground(cachedBackground.url);
      }

      // If we need a new background or refreshing, load it silently
      if (shouldFetchNewBackground() || isRefresh) {
        const newUrl = getDailyBackgroundUrl(isRefresh);
        const category = getRandomZenCategory();
        
        // Pre-load the image silently
        const img = new Image();
        img.onload = () => {
          const newBackground: BackgroundData = {
            url: newUrl,
            timestamp: Date.now(),
            date: getTodayString(),
            category: category
          };
          
          setCachedBackground(newBackground);
          setCurrentBackground(newUrl);
          setIsRefreshing(false);
        };
        img.onerror = () => {
          // Silently fail - keep using fallback or cached background
          console.warn('Failed to load new background image');
          setIsRefreshing(false);
        };
        img.src = newUrl;
      }
    } catch (error) {
      console.error('Error loading background:', error);
      setIsRefreshing(false);
    }
  };

  // Handle manual refresh
  const handleRefreshBackground = () => {
    setIsRefreshing(true);
    loadBackground(true);
  };

  // Initial load
  useEffect(() => {
    loadBackground();
  }, []);

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
      
      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black/40 transition-all duration-1000"></div>

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
    </div>
  );
};

// Export the BackgroundInfoCard as a separate component for use in layouts
export const BackgroundInfoCard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Storage for cached background
  const [cachedBackground, setCachedBackground] = useStorage<BackgroundData | null>(
    STORAGE_KEYS.CACHED_BACKGROUND, 
    null
  );

  // Zen categories
  const zenCategories = [
    'nature', 'landscape', 'mountains', 'ocean', 'sky', 
    'forest', 'minimal', 'sunset', 'clouds', 'water'
  ];

  // Get a random zen category
  const getRandomZenCategory = () => {
    return zenCategories[Math.floor(Math.random() * zenCategories.length)];
  };

  // Get today's date string
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Handle manual refresh
  const handleRefreshBackground = () => {
    setIsRefreshing(true);
    
    // Generate new background URL with timestamp for variety
    const category = getRandomZenCategory();
    const timestamp = Date.now();
    const newUrl = `https://picsum.photos/seed/${category}-${timestamp}/1920/1080?blur=1`;
    
    // Pre-load the image
    const img = new Image();
    img.onload = () => {
      const newBackground: BackgroundData = {
        url: newUrl,
        timestamp: Date.now(),
        date: getTodayString(),
        category: category
      };
      
      setCachedBackground(newBackground);
      setIsRefreshing(false);
      
      // Force a page reload to apply the new background
      window.location.reload();
    };
    img.onerror = () => {
      console.warn('Failed to load new background image');
      setIsRefreshing(false);
    };
    img.src = newUrl;
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🖼️</span>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefreshBackground}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get new background image"
          >
            <RotateCcw 
              size={16} 
              className={isRefreshing ? 'animate-spin' : ''} 
            />
          </button>
        </div>
        
        <h3 className="text-white font-medium text-sm mb-2 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
          Daily Background
        </h3>
        <p className="text-white/60 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] mb-2">
          Beautiful nature scenes for focus
        </p>
      </div>
    </div>
  );
};

export default BackgroundManager;