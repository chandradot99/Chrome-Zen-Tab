import React from 'react';
import {
  Mail, Calendar, Github, Youtube, Twitter, Linkedin,
  Instagram, MessageSquare, Video, FileText, Code,
  HelpCircle, Palette, Music, Coffee, ShoppingCart,
  Search, Globe, Bookmark, Link, X
} from 'lucide-react';

interface QuickLink {
  id: string;
  name: string;
  iconName: string;
  url: string;
  color: string;
}

interface QuickLinkItemProps {
  link: QuickLink;
  onClick: (url: string) => void;
  onDelete: (id: string) => void;
  isCompact?: boolean;
}

// Icon mapping object
const iconMap: Record<string, React.ComponentType<any>> = {
  Mail,
  Calendar,
  Github,
  Youtube,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare,
  Video,
  FileText,
  Code,
  HelpCircle,
  Palette,
  Music,
  Coffee,
  ShoppingCart,
  Search,
  Globe,
  Bookmark,
  Link,
};

const QuickLinkItem: React.FC<QuickLinkItemProps> = ({
  link,
  onClick,
  onDelete,
  isCompact = false
}) => {
  const IconComponent = iconMap[link.iconName] || Link;

  return (
    <div className="group relative">
      <button
        onClick={() => onClick(link.url)}
        className="w-full aspect-square bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] p-3 shadow-lg"
        title={`Open ${link.name}`}
      >
        <div className="mb-2">
          <IconComponent 
            size={isCompact ? 18 : 20} 
            className="text-white drop-shadow-lg" 
          />
        </div>
        <div className="text-white text-xs font-medium text-center leading-tight drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] max-w-full">
          <span className="block truncate">
            {link.name}
          </span>
        </div>
      </button>
      
      <button
        onClick={() => onDelete(link.id)}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center shadow-lg border border-red-400/30"
        title="Remove link"
      >
        <X size={12} />
      </button>
    </div>
  );
};

export default QuickLinkItem;