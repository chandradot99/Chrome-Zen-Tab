import React from 'react';
import QuickLinkItem from './LinkItem';

interface QuickLink {
  id: string;
  name: string;
  iconName: string;
  url: string;
  color: string;
}

interface QuickLinksGridProps {
  links: QuickLink[];
  onLinkClick: (url: string) => void;
  onLinkDelete: (id: string) => void;
}

const QuickLinksGrid: React.FC<QuickLinksGridProps> = ({
  links,
  onLinkClick,
  onLinkDelete
}) => {
  const isCompact = links.length > 4;
  const gridCols = links.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';

  // Calculate empty slots for visual consistency
  const getEmptySlots = () => {
    if (links.length >= 12) return 0;
    
    if (links.length <= 4) {
      return 4 - links.length;
    } else {
      return Math.ceil((links.length + 1) / 3) * 3 - links.length;
    }
  };

  const emptySlots = Math.min(getEmptySlots(), 12 - links.length);

  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white/40 text-sm mb-2 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          No quick links added yet
        </div>
        <div className="text-white/30 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          Add some to get started!
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-3 mb-4 ${gridCols}`}>
      {/* Render existing links */}
      {links.map((link) => (
        <QuickLinkItem
          key={link.id}
          link={link}
          onClick={onLinkClick}
          onDelete={onLinkDelete}
          isCompact={isCompact}
        />
      ))}
      
      {/* Empty slots - show preview of next grid structure */}
      {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, index) => (
        <div 
          key={`empty-${index}`} 
          className="aspect-square border border-white/10 rounded-xl border-dashed flex items-center justify-center"
        >
          <div className="text-white/30 text-[10px] drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            Empty
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickLinksGrid;