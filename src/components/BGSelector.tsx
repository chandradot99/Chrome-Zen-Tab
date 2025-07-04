import React from 'react';

interface Background {
  name: string;
  image: string;
  overlay: string;
}

interface BackgroundSelectorProps {
  backgrounds: Background[];
  activeBackground: number;
  onBackgroundChange: (index: number) => void;
  onToggleAutoChange: () => void;
  autoChangeEnabled: boolean;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ 
  backgrounds, 
  activeBackground, 
  onBackgroundChange, 
  onToggleAutoChange,
  autoChangeEnabled 
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-lg mr-3">
          🎨
        </div>
        Backgrounds
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {backgrounds.map((bg, index) => (
          <button
            key={index}
            onClick={() => onBackgroundChange(index)}
            className={`relative aspect-video rounded-xl border-2 transition-all duration-300 hover:scale-105 overflow-hidden group ${
              activeBackground === index ? 'border-white' : 'border-white/20'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bg.image})` }}
            ></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-1 left-1 text-white text-xs font-medium bg-black/50 px-1 py-0.5 rounded text-[10px]">
              {bg.name}
            </div>
            {activeBackground === index && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <button 
        onClick={onToggleAutoChange}
        className="w-full mt-3 py-2 px-3 bg-white/10 border border-white/20 rounded-xl text-white/80 text-sm font-medium hover:bg-white/20 transition-all duration-300"
      >
        Daily Auto-Change: {autoChangeEnabled ? 'ON' : 'OFF'}
      </button>
    </div>
  );
};

export default BackgroundSelector;
