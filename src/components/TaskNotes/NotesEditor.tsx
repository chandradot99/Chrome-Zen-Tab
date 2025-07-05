import React, { useRef } from 'react';
import { RotateCcw } from 'lucide-react';

interface NotesEditorProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ notes, onNotesChange }) => {
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const clearNotes = (): void => {
    if (notes.trim() && confirm('Clear all notes? This cannot be undone.')) {
      onNotesChange('');
    }
  };

  const getNotesStats = () => {
    const lines = notes.split('\n').filter(line => line.trim()).length;
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const chars = notes.length;
    return { lines, words, chars };
  };

  const notesStats = getNotesStats();

  return (
    <div className="h-[320px] flex flex-col">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          {notesStats.chars > 0 
            ? `${notesStats.words} words • ${notesStats.lines} lines`
            : 'Start writing your thoughts'
          }
        </div>
        <div className="flex items-center space-x-2">
          {notes.trim() && (
            <button
              onClick={clearNotes}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white/80"
              title="Clear notes"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 flex flex-col relative">
        <textarea 
          ref={notesRef}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full flex-1 bg-transparent text-white placeholder-white/40 resize-none outline-none drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] text-base leading-relaxed relative z-20"
          placeholder="Write your thoughts, ideas, meeting notes...

• Project updates and progress
• Meeting takeaways and action items
• Creative ideas and inspiration
• Daily reflections and learnings
• Important reminders

Your notes auto-save as you type!"
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '1.6'
          }}
        />
      </div>

      {/* Status */}
      <div className="mt-4 text-sm text-white/40 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
        {`${notesStats.chars} characters • ${notesStats.words} words`}
      </div>
    </div>
  );
};

export default NotesEditor;
