import React from 'react';

interface QuickLink {
  name: string;
  icon: string;
  url: string;
  color: string;
}

interface QuickLinksProps {
  quickLinks: QuickLink[];
  onAddLink: () => void;
  onLinkClick: (url: string) => void;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ quickLinks, onAddLink, onLinkClick }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-xl mr-3">
          🔗
        </div>
        Quick Links
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((link, index) => (
          <div key={index} className="group cursor-pointer" onClick={() => onLinkClick(link.url)}>
            <div className="aspect-square backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-105 p-3">
              <div className="text-2xl mb-1">{link.icon}</div>
              <div className="text-white/80 text-xs font-medium text-center">{link.name}</div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onAddLink}
        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300"
      >
        <span className="mr-2">+</span> Add Link
      </button>
    </div>
  );
};

export default QuickLinks;
