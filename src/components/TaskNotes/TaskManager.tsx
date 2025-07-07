import React, { useState, useRef, useEffect } from 'react';
import { CheckSquare, Square, Plus, RotateCcw, Star } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: boolean;
}

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksChange }) => {
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [showTaskInput, setShowTaskInput] = useState<boolean>(false);
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const taskInputRef = useRef<HTMLInputElement>(null);

  // Clear recently completed animation after delay
  useEffect(() => {
    if (recentlyCompleted) {
      const timer = setTimeout(() => setRecentlyCompleted(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [recentlyCompleted]);

  const addTask = (): void => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
      priority: false
    };

    const updatedTasks = [...tasks, newTask];
    onTasksChange(updatedTasks);
    setNewTaskText('');
    setShowTaskInput(false);
  };

  const toggleTask = (taskId: string): void => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setRecentlyCompleted(taskId);
    }
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    );
    onTasksChange(updatedTasks);
  };

  const togglePriority = (taskId: string): void => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, priority: !task.priority }
        : task
    );
    onTasksChange(updatedTasks);
  };

  const deleteTask = (taskId: string): void => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };

  const clearCompleted = (): void => {
    const completedCount = tasks.filter(task => task.completed).length;
    if (completedCount > 0 && confirm(`Delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
      const updatedTasks = tasks.filter(task => !task.completed);
      onTasksChange(updatedTasks);
    }
  };

  const clearAllTasks = (): void => {
    if (tasks.length > 0 && confirm('Delete all tasks? This cannot be undone.')) {
      onTasksChange([]);
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
    const priority = tasks.filter(task => task.priority && !task.completed).length;
    return { total, completed, pending, priority };
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    switch (filter) {
      case 'pending':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      default:
        filtered = tasks;
    }

    // Sort: priority first, then by completion status, then by creation date
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Incomplete tasks first
      }
      if (a.priority !== b.priority) {
        return a.priority ? -1 : 1; // Priority tasks first
      }
      return a.createdAt - b.createdAt; // Older tasks first
    });
  };

  const taskStats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  const renderTaskInput = () => (
    <div className="flex space-x-2">
      <input
        ref={taskInputRef}
        type="text"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        onKeyDown={handleTaskKeyPress}
        placeholder={tasks.length === 0 ? "Enter your first task..." : "What needs to be done?"}
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
        className="px-3 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="h-[420px] flex flex-col">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-white/60 text-sm drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]">
            {taskStats.total > 0 
              ? `${taskStats.completed}/${taskStats.total} done ${taskStats.priority > 0 ? `• ${taskStats.priority} priority` : ''}`
              : 'No tasks yet'
            }
          </div>
          
          {/* Filter Tabs */}
          {taskStats.total > 0 && (
            <div className="flex bg-white/5 rounded-lg p-1">
              {[
                { key: 'all', label: 'All', count: taskStats.total },
                { key: 'pending', label: 'Todo', count: taskStats.pending },
                { key: 'completed', label: 'Done', count: taskStats.completed }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as typeof filter)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    filter === key 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {label} {count > 0 && `(${count})`}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
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
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex-1 flex flex-col">
        {tasks.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <CheckSquare size={36} className="text-white/30 mx-auto mb-4" />
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
          /* Tasks List */
          <div className="flex-1 overflow-hidden flex flex-col">
            {filteredTasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-white/50 text-sm">
                  No {filter} tasks
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`group flex items-center justify-between px-2 py-1 rounded-xl hover:bg-white/5 transition-all duration-300 ${
                      recentlyCompleted === task.id ? 'bg-green-500/20 animate-pulse' : ''
                    } ${task.priority && !task.completed ? 'border-l-2 border-yellow-400/50' : ''}`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
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
                      
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span 
                          className={`flex-1 text-sm transition-all duration-200 truncate ${
                            task.completed 
                              ? 'line-through text-white/50' 
                              : 'text-white/90'
                          } drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)]`}
                          title={task.text}
                        >
                          {task.text}
                        </span>
                        
                        {!task.completed && (
                          <button
                            onClick={() => togglePriority(task.id)}
                            className={`flex-shrink-0 transition-colors ${
                              task.priority 
                                ? 'text-yellow-400 hover:text-yellow-300' 
                                : 'text-white/40 hover:text-yellow-400'
                            }`}
                            title={task.priority ? "Remove priority" : "Mark as priority"}
                          >
                            <Star size={14} fill={task.priority ? "currentColor" : "none"} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-1.5 rounded flex-shrink-0"
                        title="Delete task"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Task Section */}
            {filter !== 'completed' && (
              <div className="mt-3 pt-3 border-t border-white/10 flex-shrink-0">
                {showTaskInput ? (
                  renderTaskInput()
                ) : (
                  <button
                    onClick={startAddingTask}
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span className="drop-shadow-lg [text-shadow:_0_2px_6px_rgb(0_0_0_/_40%)] text-sm">Add Task</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty state task input */}
        {tasks.length === 0 && showTaskInput && (
          <div className="mt-6 pt-4 border-t border-white/10">
            {renderTaskInput()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;