import React, { useState, useEffect } from 'react';
import { 
  Mail, Calendar, Github, Youtube, Twitter, Linkedin, 
  Instagram, MessageSquare, Video, FileText, Code, 
  HelpCircle, Palette, Music, Coffee, ShoppingCart,
  Search, Globe, Bookmark, Plus, X, Star, Link as LinkIcon
} from 'lucide-react';

interface QuickLink {
  id: string;
  name: string;
  iconName: string; // Store icon name as string instead of component
  url: string;
  color: string;
}

interface PredefinedLink {
  name: string;
  iconName: string; // Store icon name as string
  url: string;
  color: string;
  category: string;
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

// Chrome storage helper
const QUICK_LINKS_STORAGE_KEY = 'zenTab_quick_links';

// Declare chrome types
declare const chrome: any;

const QuickLinksManager: React.FC = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPredefined, setShowPredefined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '🔗'
  });

  const colors = [
    'from-red-500 to-red-600',
    'from-blue-500 to-blue-600', 
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-indigo-600',
    'from-cyan-500 to-cyan-600',
  ];

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

  useEffect(() => {
    loadQuickLinks();
  }, []);

  const loadQuickLinks = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([QUICK_LINKS_STORAGE_KEY], (result: any) => {
          if (result[QUICK_LINKS_STORAGE_KEY]) {
            setQuickLinks(result[QUICK_LINKS_STORAGE_KEY]);
          } else {
            // Set default links if none exist
            setDefaultLinks();
          }
          setIsLoading(false);
        });
      } else {
        const stored = localStorage.getItem(QUICK_LINKS_STORAGE_KEY);
        if (stored) {
          setQuickLinks(JSON.parse(stored));
        } else {
          setDefaultLinks();
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading quick links:', error);
      setDefaultLinks();
      setIsLoading(false);
    }
  };

  const setDefaultLinks = () => {
    const defaultLinks: QuickLink[] = [
      { id: '1', name: 'Gmail', iconName: 'Mail', url: 'https://gmail.com', color: 'from-red-500 to-red-600' },
      { id: '2', name: 'Calendar', iconName: 'Calendar', url: 'https://calendar.google.com', color: 'from-blue-500 to-blue-600' },
      { id: '3', name: 'GitHub', iconName: 'Github', url: 'https://github.com', color: 'from-gray-800 to-black' },
      { id: '4', name: 'YouTube', iconName: 'Youtube', url: 'https://youtube.com', color: 'from-red-600 to-red-700' },
    ];
    setQuickLinks(defaultLinks);
    saveQuickLinks(defaultLinks);
  };

  const saveQuickLinks = (linksToSave: QuickLink[]) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [QUICK_LINKS_STORAGE_KEY]: linksToSave });
      } else {
        localStorage.setItem(QUICK_LINKS_STORAGE_KEY, JSON.stringify(linksToSave));
      }
    } catch (error) {
      console.error('Error saving quick links:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.url.trim()) {
      return;
    }

    // Add https:// if no protocol specified
    let url = formData.url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const newLink: QuickLink = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      iconName: 'LinkIcon', // Default to LinkIcon for custom links
      url: url,
      color: colors[quickLinks.length % colors.length]
    };

    const updatedLinks = [...quickLinks, newLink];
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);

    // Reset form
    setFormData({ name: '', url: '', icon: '🔗' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updatedLinks = quickLinks.filter(link => link.id !== id);
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  const addPredefinedLink = (predefinedLink: PredefinedLink) => {
    // Check if link already exists
    const exists = quickLinks.some(link => link.url === predefinedLink.url);
    if (exists) {
      return;
    }

    const newLink: QuickLink = {
      id: Date.now().toString(),
      name: predefinedLink.name,
      iconName: predefinedLink.iconName,
      url: predefinedLink.url,
      color: predefinedLink.color
    };

    const updatedLinks = [...quickLinks, newLink];
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);
  };

  const isLinkAdded = (url: string) => {
    return quickLinks.some(link => link.url === url);
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">Loading links...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <LinkIcon size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Quick Links</h2>
        </div>
        {quickLinks.length > 0 && (
          <div className="text-white/60 text-sm">
            {quickLinks.length}/12
          </div>
        )}
      </div>

      {/* Quick Links Grid - Dynamic columns (max 3) */}
      <div className={`grid gap-3 mb-4 ${
        quickLinks.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
      }`}>
        {quickLinks.map((link) => (
          <div key={link.id} className="group cursor-pointer">
            <div 
              onClick={() => handleLinkClick(link.url)}
              className="aspect-square backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 hover:scale-105 p-3 relative"
            >
              <div className={`mb-1 ${
                quickLinks.length <= 4 ? 'text-2xl' : 'text-xl'
              }`}>
                {(() => {
                  const IconComponent = iconMap[link.iconName];
                  return IconComponent ? (
                    <IconComponent size={quickLinks.length <= 4 ? 24 : 20} className="text-white" />
                  ) : (
                    <LinkIcon size={quickLinks.length <= 4 ? 24 : 20} className="text-white" />
                  );
                })()}
              </div>
              <div className={`text-white/80 font-medium text-center ${
                quickLinks.length <= 4 ? 'text-xs' : 'text-xs'
              }`}>{link.name}</div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(link.id);
                }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-all duration-200 text-xs"
                title="Remove link"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        
        {/* Empty slots - show preview of next grid structure */}
        {quickLinks.length < 12 && Array.from({ 
          length: Math.min(
            quickLinks.length <= 4 ? 4 - quickLinks.length : 
            Math.ceil((quickLinks.length + 1) / 3) * 3 - quickLinks.length, 
            12 - quickLinks.length
          ) 
        }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square border border-white/10 rounded-xl border-dashed flex items-center justify-center">
            <div className="text-white/30 text-[10px]">Empty</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!showAddForm && !showPredefined && (
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" /> Add Custom Link
            </button>
            <button
              onClick={() => setShowPredefined(true)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl text-white font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center justify-center"
            >
              <Star size={16} className="mr-2" /> Popular Links
            </button>
          </div>
        )}

        {/* Custom Link Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Icon</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-center outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                      placeholder="🔗"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter link name..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                    required
                  />
                  <div className="text-white/40 text-xs mt-1">You can omit https:// - it will be added automatically</div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  type="submit"
                  disabled={!formData.name.trim() || !formData.url.trim()}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', url: '', icon: '🔗' });
                  }}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Predefined Links - Compact Inline Design */}
        {showPredefined && (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-medium text-sm">Quick Add Popular Links</h3>
              <button
                onClick={() => setShowPredefined(false)}
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
                    <div className="text-white/60 text-xs font-medium mb-2 uppercase tracking-wide">{category}</div>
                    <div className="grid grid-cols-1 gap-1">
                      {categoryLinks.map((link, index) => (
                        <button
                          key={index}
                          onClick={() => addPredefinedLink(link)}
                          disabled={isLinkAdded(link.url)}
                          className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm ${
                            isLinkAdded(link.url)
                              ? 'bg-green-500/10 border border-green-400/20 text-green-300 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-white/10 text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const IconComponent = iconMap[link.iconName];
                              return IconComponent ? (
                                <IconComponent size={16} className="text-current" />
                              ) : (
                                <LinkIcon size={16} className="text-current" />
                              );
                            })()}
                            <span className="font-medium">{link.name}</span>
                          </div>
                          {isLinkAdded(link.url) ? (
                            <span className="text-green-400 text-xs">✓ Added</span>
                          ) : (
                            <span className="text-white/40 text-xs">+ Add</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {quickLinks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-white/40 text-sm mb-2">No quick links added yet</div>
          <div className="text-white/30 text-xs">Add some to get started!</div>
        </div>
      )}
    </div>
  );
};

export default QuickLinksManager;