import React from 'react';
import { Palette } from 'lucide-react';

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
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
            <Palette size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            Backgrounds
          </h2>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
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
            <div className="absolute bottom-1 left-1 text-white text-xs font-medium bg-black/50 px-1 py-0.5 rounded text-[10px] drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              {bg.name}
            </div>
            {activeBackground === index && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <button 
        onClick={onToggleAutoChange}
        className="w-full py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg"
      >
        <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
          Daily Auto-Change: {autoChangeEnabled ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
};

export default BackgroundSelector;
