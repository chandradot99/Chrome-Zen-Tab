import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

interface NotesEditorProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ notes, onNotesChange }) => {
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save indicator
  useEffect(() => {
    if (notes.trim()) {
      setLastSaved(new Date());
    }
  }, [notes]);

  const clearNotes = (): void => {
    if (notes.trim() && confirm('Clear all notes? This cannot be undone.')) {
      onNotesChange('');
    }
  };

  const copyNotes = async (): Promise<void> => {
    if (notes.trim()) {
      try {
        await navigator.clipboard.writeText(notes);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy notes:', err);
      }
    }
  };

  const getNotesStats = () => {
    const lines = notes.split('\n').filter(line => line.trim()).length;
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const chars = notes.length;
    return { lines, words, chars };
  };

  const formatLastSaved = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just saved';
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleDateString();
  };

  const notesStats = getNotesStats();

  return (
    <div className="flex flex-col transition-all duration-300 h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {notesStats.chars > 0 
              ? `${notesStats.words} words • ${notesStats.lines} lines`
              : 'Quick notes & thoughts'
            }
          </div>
          {lastSaved && (
            <div className="text-white/40 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              {formatLastSaved(lastSaved)}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {notes.trim() && (
            <>
              <button
                onClick={copyNotes}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white/80"
                title="Copy notes"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
              <button
                onClick={clearNotes}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white/80"
                title="Clear notes"
              >
                <RotateCcw size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 flex flex-col relative">
        <textarea 
          ref={notesRef}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] text-base leading-relaxed"
          placeholder="Jot down quick thoughts, meeting notes, ideas...

Auto-saves as you type ✓"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '1.6'
          }}
        />
      </div>

      {/* Simple Status */}
      <div className="mt-3 text-xs text-white/40 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
        {notesStats.chars > 0 && `${notesStats.chars} characters`}
      </div>
    </div>
  );
};

export default NotesEditor;