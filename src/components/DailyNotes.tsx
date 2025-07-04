import React, { useState, useEffect, useRef } from 'react';
import { FileText, RotateCcw, CheckSquare, Square, Plus, Edit3 } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type ActiveTab = 'tasks' | 'notes';

const TabbedTasksNotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [showTaskInput, setShowTaskInput] = useState<boolean>(false);
  const taskInputRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-save notes with debounce
  useEffect(() => {
    if (!isLoading) {
      const saveTimer = setTimeout(() => {
        saveNotes(notes);
        setLastSaved(new Date());
      }, 1000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [notes, isLoading]);

  // Auto-save tasks whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
      if (tasks.length > 0) {
        setLastSaved(new Date());
      }
    }
  }, [tasks, isLoading]);

  const loadData = async (): Promise<void> => {
    try {
      // Load tasks
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      // Load notes with default fallback - using correct storage key
      const storedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (storedNotes) {
        setNotes(storedNotes);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const saveTasks = (tasksToSave: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const saveNotes = (notesToSave: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, notesToSave);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const addTask = (): void => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setNewTaskText('');
    setShowTaskInput(false);
  };

  const toggleTask = (taskId: string): void => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId: string): void => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const clearCompleted = (): void => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount > 0 && confirm(`Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
      const updatedTasks = tasks.filter(task => !task.completed);
      setTasks(updatedTasks);
    }
  };

  const clearAllTasks = (): void => {
    if (tasks.length > 0 && confirm('Delete all tasks? This cannot be undone.')) {
      setTasks([]);
    }
  };

  const clearNotes = (): void => {
    if (notes.trim() && confirm('Clear all notes? This cannot be undone.')) {
      setNotes('');
    }
  };

  const startAddingTask = (): void => {
    setShowTaskInput(true);
    setTimeout(() => {
      if (taskInputRef.current) {
        taskInputRef.current.focus();
      }
    }, 100);
  };

  const handleTaskKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      addTask();
    } else if (e.key === 'Escape') {
      setShowTaskInput(false);
      setNewTaskText('');
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const getNotesStats = () => {
    const lines = notes.split('\n').filter(line => line.trim()).length;
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const chars = notes.length;
    return { lines, words, chars };
  };

  const taskStats = getTaskStats();
  const notesStats = getNotesStats();

  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="text-white/60 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Loading...</div>
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
          <div>
            <h2 className="text-2xl font-semibold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
              {activeTab === 'tasks' ? 'Daily Tasks' : 'Notes'}
            </h2>
            <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
              {activeTab === 'tasks' 
                ? taskStats.total > 0 
                  ? `${taskStats.completed}/${taskStats.total} completed • ${taskStats.pending} pending`
                  : 'No tasks yet'
                : notesStats.chars > 0 
                  ? `${notesStats.words} words • ${notesStats.lines} lines`
                  : 'Start writing your thoughts'
              }
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-2">
          {activeTab === 'tasks' ? (
            <>
              {taskStats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1 rounded"
                  title="Clear completed tasks"
                >
                  Clear done
                </button>
              )}
              {taskStats.total > 0 && (
                <button
                  onClick={clearAllTasks}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white/80"
                  title="Clear all tasks"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </>
          ) : (
            notes.trim() && (
              <button
                onClick={clearNotes}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white/80"
                title="Clear notes"
              >
                <RotateCcw size={16} />
              </button>
            )
          )}
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'tasks'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckSquare size={18} />
          <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Tasks</span>
          {taskStats.pending > 0 && (
            <span className="bg-orange-500/80 text-white text-xs px-2 py-0.5 rounded-full">
              {taskStats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'notes'
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Edit3 size={18} />
          <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Notes</span>
          {notesStats.words > 0 && (
            <span className="bg-blue-500/80 text-white text-xs px-2 py-0.5 rounded-full">
              {notesStats.words}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[320px] flex flex-col">
        {activeTab === 'tasks' ? (
          /* Tasks Content */
          <>
            {tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CheckSquare size={48} className="text-white/30 mx-auto mb-4" />
                <div className="text-white/60 text-lg mb-2 drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_40%)]">
                  No tasks yet
                </div>
                <div className="text-white/50 text-sm mb-6 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
                  Add your first task to get started
                </div>
                <button
                  onClick={startAddingTask}
                  className="py-3 px-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl text-white font-medium hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 shadow-lg"
                >
                  <Plus size={18} className="inline mr-2" />
                  <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Add First Task</span>
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="group flex items-center justify-between px-4 py-0.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckSquare size={20} className="text-green-400" />
                          ) : (
                            <Square size={20} />
                          )}
                        </button>
                        <span 
                          className={`flex-1 text-base transition-all duration-200 ${
                            task.completed 
                              ? 'line-through text-white/50' 
                              : 'text-white/90'
                          } drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]`}
                          title={task.text}
                        >
                          {task.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all duration-200 p-2 flex-shrink-0 ml-3"
                        title="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Task Section */}
                <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                  {showTaskInput ? (
                    <div className="flex space-x-3">
                      <input
                        ref={taskInputRef}
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={handleTaskKeyPress}
                        placeholder="What needs to be done?"
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                      />
                      <button
                        onClick={addTask}
                        disabled={!newTaskText.trim()}
                        className="px-4 py-3 bg-green-500/80 hover:bg-green-600/80 disabled:bg-gray-500/50 text-white rounded-xl transition-colors disabled:cursor-not-allowed font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowTaskInput(false);
                          setNewTaskText('');
                        }}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startAddingTask}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Plus size={18} />
                      <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">Add New Task</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Empty state task input */}
            {tasks.length === 0 && showTaskInput && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex space-x-3">
                  <input
                    ref={taskInputRef}
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={handleTaskKeyPress}
                    placeholder="Enter your first task..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/40 outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
                  />
                  <button
                    onClick={addTask}
                    disabled={!newTaskText.trim()}
                    className="px-4 py-3 bg-green-500/80 hover:bg-green-600/80 disabled:bg-gray-500/50 text-white rounded-xl transition-colors disabled:cursor-not-allowed font-medium"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowTaskInput(false);
                      setNewTaskText('');
                    }}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Notes Content */
          <div className="flex-1 flex flex-col relative">
            <textarea 
              ref={notesRef}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
        )}
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-white/40 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          {activeTab === 'tasks' 
            ? `${taskStats.total} tasks total`
            : `${notesStats.chars} characters • ${notesStats.words} words`
          }
        </div>
        <div className="flex items-center text-white/40 drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
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
        <div className="text-white/30 text-xs drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
          {activeTab === 'tasks' 
            ? 'Press Enter to add tasks, Escape to cancel • Click checkboxes to mark complete'
            : 'Your notes auto-save as you type • Switch to Tasks tab to manage your todos'
          }
        </div>
      </div>
    </div>
  );
};

export default TabbedTasksNotes;