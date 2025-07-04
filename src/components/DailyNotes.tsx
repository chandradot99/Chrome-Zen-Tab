import React, { useState, useEffect } from 'react';
import { FileText, RotateCcw } from 'lucide-react';

// Chrome storage helper
const NOTES_STORAGE_KEY = 'zenTab_daily_notes';

// Declare chrome types
declare const chrome: any;

const DailyNotes: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    loadNotes();
  }, []);

  // Auto-save notes with debounce
  useEffect(() => {
    if (!isLoading && notes !== '') {
      const saveTimer = setTimeout(() => {
        saveNotes(notes);
        setLastSaved(new Date());
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [notes, isLoading]);

  const loadNotes = async (): Promise<void> => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get([NOTES_STORAGE_KEY], (result: any) => {
          if (result[NOTES_STORAGE_KEY]) {
            setNotes(result[NOTES_STORAGE_KEY]);
          }
          setIsLoading(false);
        });
      } else {
        const stored = localStorage.getItem(NOTES_STORAGE_KEY);
        if (stored) {
          setNotes(stored);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setIsLoading(false);
    }
  };

  const saveNotes = (notesToSave: string): void => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [NOTES_STORAGE_KEY]: notesToSave });
      } else {
        localStorage.setItem(NOTES_STORAGE_KEY, notesToSave);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const clearNotes = (): void => {
    if (notes.trim() && confirm('Clear all notes? This cannot be undone.')) {
      setNotes('');
      saveNotes('');
    }
  };

  const getStats = () => {
    const lines = notes.split('\n').filter(line => line.trim()).length;
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const chars = notes.length;
    return { lines, words, chars };
  };

  const { lines, words, chars } = getStats();

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60">Loading notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
            <FileText size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Daily Notes</h2>
        </div>
        
        <button
          onClick={clearNotes}
          disabled={!notes.trim()}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear all notes"
        >
          <RotateCcw size={16} />
          <span className="text-xs">Clear</span>
        </button>
      </div>
      
      {/* Notes Textarea */}
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/40 resize-none outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
        placeholder="What's on your mind today?

Write anything you want...
• Daily todos
• Meeting notes  
• Random thoughts
• Project ideas

Start typing and your notes will auto-save!"
        style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '15px',
          lineHeight: '1.6'
        }}
      />
      
      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-white/40">
          {lines} lines • {words} words • {chars} characters
        </div>
        <div className="flex items-center text-white/40">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            Date.now() - lastSaved.getTime() < 2000 ? 'bg-green-400 animate-pulse' : 'bg-white/30'
          }`}></div>
          <span>
            {Date.now() - lastSaved.getTime() < 2000 
              ? 'Saved' 
              : 'Auto-saved'
            }
          </span>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-3 text-center">
        <div className="text-white/30 text-xs">
          Notes auto-save as you type • Click "Clear" to start fresh
        </div>
      </div>
    </div>
  );
};

export default DailyNotes;