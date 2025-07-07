import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NotesEditorProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ notes, onNotesChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save indicator
  useEffect(() => {
    if (notes.trim()) {
      setLastSaved(new Date());
    }
  }, [notes]);

  // Quill modules configuration - minimal toolbar for chrome extension
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }]
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet'
  ];

  const clearNotes = (): void => {
    if (notes.trim() && confirm('Clear all notes? This cannot be undone.')) {
      onNotesChange('');
    }
  };

  const copyNotes = async (): Promise<void> => {
    if (notes.trim()) {
      try {
        // Copy plain text version
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = notes;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        await navigator.clipboard.writeText(plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy notes:', err);
      }
    }
  };

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };

  const getNotesStats = () => {
    // Get plain text stats from HTML content
    let textContent = notes;
    if (notes.includes('<')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = notes;
      textContent = tempDiv.textContent || tempDiv.innerText || '';
    }
    
    const lines = textContent.split('\n').filter(line => line.trim()).length;
    const words = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const chars = textContent.length;
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
    <div className={`flex flex-col transition-all duration-300 ${
      isExpanded ? 'h-[500px]' : 'h-[420px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {notesStats.chars > 0 
              ? `${notesStats.words} words • ${notesStats.lines} lines`
              : 'Rich text notes'
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
          <button
            onClick={toggleExpanded}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white/80"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* React Quill Editor */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col relative">
        <ReactQuill
          theme="snow"
          value={notes}
          onChange={onNotesChange}
          modules={modules}
          formats={formats}
          placeholder="Start writing with rich text formatting..."
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
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
