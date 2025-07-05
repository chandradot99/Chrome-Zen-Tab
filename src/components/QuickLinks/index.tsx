import React, { useState, useEffect } from 'react';
import { Plus, Star, Link as LinkIcon } from 'lucide-react';
import AddLinkForm from './AddLinkForm';
import QuickLinksGrid from './LinksGrid';
import PredefinedLinksPanel from './PredefinedLinks';

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

// Chrome storage helper
const QUICK_LINKS_STORAGE_KEY = 'zenTab_quick_links';

// Declare chrome types
declare const chrome: any;

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
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <LinkIcon size={16} className="text-white" />
          </div>
          <h2 className="text-md font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
            Quick Links
          </h2>
        </div>
        {quickLinks.length > 0 && (
          <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {quickLinks.length}/12
          </div>
        )}
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
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl text-white font-medium hover:from-white/20 hover:to-white/10 transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              <Plus size={16} className="mr-2" />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                Add Custom Link
              </span>
            </button>
            <button
              onClick={() => setShowPredefined(true)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl text-white font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              <Star size={16} className="mr-2" />
              <span className="drop-shadow-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">
                Popular Links
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