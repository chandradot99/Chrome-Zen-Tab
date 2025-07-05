import React, { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import AddLinkForm from './AddLinkForm';
import QuickLinksGrid from './LinksGrid';
import PredefinedLinksPanel from './PredefinedLinks';
import { STORAGE_KEYS } from '../../utils/constants';

interface QuickLink {
  id: string;
  name: string;
  iconName: string;
  url: string;
  color: string;
}

interface PredefinedLink {
  name: string;
  iconName: string;
  url: string;
  color: string;
  category: string;
}

const QuickLinksManager: React.FC = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPredefined, setShowPredefined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    loadQuickLinks();
  }, []);

  const loadQuickLinks = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([STORAGE_KEYS.QUICK_LINKS], (result: any) => {
          if (result[STORAGE_KEYS.QUICK_LINKS]) {
            setQuickLinks(result[STORAGE_KEYS.QUICK_LINKS]);
          } else {
            // Set default links if none exist
            setDefaultLinks();
          }
          setIsLoading(false);
        });
      } else {
        const stored = localStorage.getItem(STORAGE_KEYS.QUICK_LINKS);
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
      { id: '1', name: 'Google Search', iconName: 'Search', url: 'https://google.com', color: 'from-blue-500 to-purple-500' },
      { id: '2', name: 'ChatGPT', iconName: 'MessageSquare', url: 'https://chat.openai.com', color: 'from-green-500 to-teal-500' },
      { id: '3', name: 'Gmail', iconName: 'Mail', url: 'https://gmail.com', color: 'from-red-500 to-red-600' },
      { id: '4', name: 'Calendar', iconName: 'Calendar', url: 'https://calendar.google.com', color: 'from-blue-500 to-blue-600' },
      { id: '5', name: 'GitHub', iconName: 'Github', url: 'https://github.com', color: 'from-gray-800 to-black' },
      { id: '6', name: 'YouTube', iconName: 'Youtube', url: 'https://youtube.com', color: 'from-red-600 to-red-700' },
    ];
    setQuickLinks(defaultLinks);
    saveQuickLinks(defaultLinks);
  };

  const saveQuickLinks = (linksToSave: QuickLink[]) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [STORAGE_KEYS.QUICK_LINKS]: linksToSave });
      } else {
        localStorage.setItem(STORAGE_KEYS.QUICK_LINKS, JSON.stringify(linksToSave));
      }
    } catch (error) {
      console.error('Error saving quick links:', error);
    }
  };

  const handleAddCustomLink = (formData: { name: string; url: string; icon: string }) => {
    const newLink: QuickLink = {
      id: Date.now().toString(),
      name: formData.name,
      iconName: 'LinkIcon', // Default to LinkIcon for custom links
      url: formData.url,
      color: colors[quickLinks.length % colors.length]
    };

    const updatedLinks = [...quickLinks, newLink];
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);
    setShowAddForm(false);
  };

  const handleAddPredefinedLink = (predefinedLink: PredefinedLink) => {
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

  const handleDeleteLink = (id: string) => {
    const updatedLinks = quickLinks.filter(link => link.id !== id);
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);
  };

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  const isLinkAdded = (url: string) => {
    return quickLinks.some(link => link.url === url);
  };

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            Loading links...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-md font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            Quick Links
          </h2>
        </div>
      </div>

      {/* Quick Links Grid */}
      <QuickLinksGrid
        links={quickLinks}
        onLinkClick={handleLinkClick}
        onLinkDelete={handleDeleteLink}
      />

      {/* Action Buttons and Forms */}
      <div className="space-y-3">
        {!showAddForm && !showPredefined && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-sm"
              title="Add custom website link"
            >
              <Plus size={14} className="mr-1.5" />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                Add Link
              </span>
            </button>
            <button
              onClick={() => setShowPredefined(true)}
              className="flex-1 py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-sm"
              title="Choose from popular websites"
            >
              <Star size={14} className="mr-1.5" />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                Popular
              </span>
            </button>
          </div>
        )}

        {/* Custom Link Form */}
        {showAddForm && (
          <AddLinkForm
            onSubmit={handleAddCustomLink}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Predefined Links Panel */}
        {showPredefined && (
          <PredefinedLinksPanel
            onClose={() => setShowPredefined(false)}
            onAddLink={handleAddPredefinedLink}
            isLinkAdded={isLinkAdded}
          />
        )}
      </div>
    </div>
  );
};

export default QuickLinksManager;