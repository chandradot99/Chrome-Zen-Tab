import React from 'react';
import { 
  Mail, Calendar, Github, Youtube, Twitter, Linkedin, 
  Instagram, MessageSquare, Video, FileText, Code, 
  HelpCircle, Palette, Music, Coffee, ShoppingCart,
  Search, Globe, Bookmark, Link as LinkIcon, X
} from 'lucide-react';

interface PredefinedLink {
  name: string;
  iconName: string;
  url: string;
  color: string;
  category: string;
}

interface PredefinedLinksPanelProps {
  onClose: () => void;
  onAddLink: (link: PredefinedLink) => void;
  isLinkAdded: (url: string) => boolean;
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
  LinkIcon,
};

const PredefinedLinksPanel: React.FC<PredefinedLinksPanelProps> = ({
  onClose,
  onAddLink,
  isLinkAdded
}) => {
  const predefinedLinks: PredefinedLink[] = [
    // Work & Productivity
    { name: 'Gmail', iconName: 'Mail', url: 'https://gmail.com', color: 'from-red-500 to-red-600', category: 'Work' },
    { name: 'Google Drive', iconName: 'FileText', url: 'https://drive.google.com', color: 'from-blue-500 to-blue-600', category: 'Work' },
    { name: 'Calendar', iconName: 'Calendar', url: 'https://calendar.google.com', color: 'from-green-500 to-green-600', category: 'Work' },
    { name: 'Notion', iconName: 'FileText', url: 'https://notion.so', color: 'from-gray-700 to-gray-800', category: 'Work' },
    { name: 'Slack', iconName: 'MessageSquare', url: 'https://slack.com', color: 'from-purple-500 to-purple-600', category: 'Work' },
    { name: 'Zoom', iconName: 'Video', url: 'https://zoom.us', color: 'from-blue-600 to-blue-700', category: 'Work' },
    
    // Development
    { name: 'GitHub', iconName: 'Github', url: 'https://github.com', color: 'from-gray-800 to-black', category: 'Dev' },
    { name: 'VS Code', iconName: 'Code', url: 'https://vscode.dev', color: 'from-blue-500 to-blue-600', category: 'Dev' },
    { name: 'Stack Overflow', iconName: 'HelpCircle', url: 'https://stackoverflow.com', color: 'from-orange-500 to-orange-600', category: 'Dev' },
    { name: 'CodePen', iconName: 'Code', url: 'https://codepen.io', color: 'from-green-500 to-green-600', category: 'Dev' },
    
    // Social & Entertainment  
    { name: 'YouTube', iconName: 'Youtube', url: 'https://youtube.com', color: 'from-red-600 to-red-700', category: 'Social' },
    { name: 'Twitter', iconName: 'Twitter', url: 'https://twitter.com', color: 'from-blue-400 to-blue-500', category: 'Social' },
    { name: 'LinkedIn', iconName: 'Linkedin', url: 'https://linkedin.com', color: 'from-blue-600 to-blue-700', category: 'Social' },
    { name: 'Instagram', iconName: 'Instagram', url: 'https://instagram.com', color: 'from-pink-500 to-purple-500', category: 'Social' },
    { name: 'Reddit', iconName: 'MessageSquare', url: 'https://reddit.com', color: 'from-orange-500 to-red-500', category: 'Social' },
    
    // Tools & Utilities
    { name: 'ChatGPT', iconName: 'MessageSquare', url: 'https://chat.openai.com', color: 'from-green-500 to-teal-500', category: 'Tools' },
    { name: 'Spotify', iconName: 'Music', url: 'https://spotify.com', color: 'from-green-500 to-green-600', category: 'Tools' },
    { name: 'Figma', iconName: 'Palette', url: 'https://figma.com', color: 'from-purple-500 to-pink-500', category: 'Tools' },
    { name: 'Google Search', iconName: 'Search', url: 'https://google.com', color: 'from-blue-500 to-purple-500', category: 'Tools' },
  ];

  const categories = ['Work', 'Dev', 'Social', 'Tools'];

  return (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium text-sm drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
          Quick Add Popular Links
        </h3>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {categories.map((category) => {
          const categoryLinks = predefinedLinks.filter(link => link.category === category);
          return (
            <div key={category}>
              <div className="text-white/60 text-xs font-medium mb-2 uppercase tracking-wide drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                {category}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {categoryLinks.map((link, index) => {
                  const IconComponent = iconMap[link.iconName] || LinkIcon;
                  return (
                    <button
                      key={index}
                      onClick={() => onAddLink(link)}
                      disabled={isLinkAdded(link.url)}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm ${
                        isLinkAdded(link.url)
                          ? 'bg-green-500/10 border border-green-400/20 text-green-300 cursor-not-allowed'
                          : 'bg-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent size={16} className="text-current" />
                        <span className="font-medium drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                          {link.name}
                        </span>
                      </div>
                      {isLinkAdded(link.url) ? (
                        <span className="text-green-400 text-xs">✓ Added</span>
                      ) : (
                        <span className="text-white/40 text-xs">+ Add</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PredefinedLinksPanel;