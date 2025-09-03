import React, { useState, useMemo } from 'react';
import Button from './Button';

// SVG Icons
const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="18,15 12,9 6,15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6,9 12,15 18,9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [estPomos, setEstPomos] = useState(1);
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [error, setError] = useState('');

  // Calculate totals
  const totalTasks = tasks.length;
  const totalEstPomos = tasks.reduce((sum, task) => sum + task.estPomos, 0);
  const completedPomos = tasks.reduce((sum, task) => sum + task.completedPomos, 0);

  // Calculate finish time (approximate)
  const finishAt = useMemo(() => {
    const remainingPomos = totalEstPomos - completedPomos;
    if (remainingPomos <= 0) return 'Done';
    
    const now = new Date();
    const minutesPerPomo = 25; // Basic calculation, could include breaks
    const finishTime = new Date(now.getTime() + (remainingPomos * minutesPerPomo * 60000));
    
    return finishTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, [totalEstPomos, completedPomos]);

  // Keyboard shortcut for saving when description is open
  React.useEffect(() => {
    if (!showAddForm || !showDescription) return;

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSaveTask();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAddForm, showDescription, title, estPomos, description, editingTask]);

  const resetForm = () => {
    setTitle('');
    setEstPomos(1);
    setDescription('');
    setShowDescription(false);
    setEditingTask(null);
  };

  const handleAddTask = () => {
    setShowAddForm(true);
    resetForm();
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  const handleSaveTask = () => {
    if (!title.trim()) {
      setError('title is required field');
      return;
    }
    setError('');

    if (editingTask) {
      // Edit existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: title.trim(), estPomos, description }
          : task
      ));
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        estPomos,
        completedPomos: 0,
        description
      };
      setTasks(prev => [...prev, newTask]);
    }

    handleCancelForm();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setEstPomos(task.estPomos);
    setDescription(task.description || '');
    setShowDescription(!!task.description);
    setShowAddForm(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const incrementPomos = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completedPomos: Math.min(task.completedPomos + 1, task.estPomos) }
        : task
    ));
  };

  const decrementPomos = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completedPomos: Math.max(task.completedPomos - 1, 0) }
        : task
    ));
  };

  return (
      <div className="max-w-[470px] mx-auto bg-gradient-to-r from-[#2523D5] to-[#FA3C91] rounded-[15px] p-[15px] pt-[6px]">
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-white/20 pb-[6px]">
          <span>tasks: {totalTasks}</span>
          <div className="flex items-center gap-[7px]">
            <span>pomos: {completedPomos}/{totalEstPomos}</span>
            <span>finish at: {finishAt}</span>
          </div>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-[8px] mt-[8px] mb-[8px]">
          {tasks.map(task => (
              <div
                  key={task.id}
                  className="border border-white/20 rounded-[4px] px-[12px] py-[15px]"
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-medium mb-1">{task.title}</h3>
                    <div className="flex items-center gap-3 ml-4">
                      {/* Pomos counter */}
                      <div className="flex items-center gap-2">
                      <span className="text-[16px] font-medium min-w-[50px] text-center">
                        {task.completedPomos}/{task.estPomos}
                      </span>
                      </div>

                      {/* Edit button */}
                      <button
                          onClick={() => handleEditTask(task)}
                          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                      >
                        <EditIcon />
                      </button>

                      {/* Delete button */}
                      <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                  {task.description && (
                      <p className="text-[12px] mt-[8px] text-white/80 mb-2 whitespace-pre-wrap">
                        {task.description}
                      </p>
                  )}
                </div>
              </div>
          ))}
        </div>

        {/* Add Task Button */}
        {!showAddForm && (
            <button
                onClick={handleAddTask}
                className="py-[15px] border border-dashed w-full rounded-[11px] bg-[black]/20"
            >
              add task +
            </button>
        )}

        {/* Add/Edit Task Form Overlay */}
        {showAddForm && (
            <div className="flex items-end justify-center">
              <div className="relative w-full border border-white/20 rounded-[4px] py-[15px] px-[12px]">
                {/* Title Input */}
                <div className="flex justify-between mb-[8px]">
                  <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (e.target.value.trim()) {
                          setError('');
                        } else {
                          setError('title is required field');
                        }
                      }}
                      placeholder="Which task are you working on?"
                      className="w-full border-none focus:outline-none p-[0]"
                      autoFocus
                  />
                  <button
                      onClick={handleCancelForm}
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Est Pomos */}
                <div className="flex items-center mb-[8px]">
                  <span className="text-[14px] text-white/80">Est pomos:</span>
                  <div className="flex items-center gap-[5px]">
                    <span className="text-[18px] font-medium min-w-[30px] text-center">{estPomos}</span>
                    <button
                        onClick={() => setEstPomos(Math.max(1, estPomos - 1))}
                        className='bg-[white] rounded-[3px] flex justify-center items-center'
                    >
                      <ChevronDownIcon />
                    </button>
                    <button
                        onClick={() => setEstPomos(estPomos + 1)}
                        className='bg-[white] rounded-[3px] flex justify-center items-center'>
                      <ChevronUpIcon />
                    </button>
                  </div>
                </div>

                {/* Add Description Toggle */}
                {!showDescription && (
                    <button
                        onClick={() => setShowDescription(true)}
                        className="mb-[8px] text-[14px] underline underline-offset-[2px]"
                    >
                      + add description
                    </button>
                )}

                {/* Description Input */}
                {showDescription && (
                  <div className="relative mb-[4px]">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="type your description here..."
                        rows={4}
                        className="bg-[black]/20 p-[8px] w-full bg-white/5 border-none rounded-[15px] focus:outline-none max-h-[100px] min-h-[32px] placeholder:text-[12px] text-[12px]"
                    />
                    <button
                        onClick={() => setShowDescription(false)}
                        className="absolute top-[3px] right-[10px]"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <Button
                      onClick={handleSaveTask}
                      className="px-6 py-2 text-[14px] rounded-full !bg-gradient-to-l from-[#2523D5] to-[#FA3C91]"
                  >
                    Save
                  </Button>
                </div>

                {error && (
                    <p className="absolute top-[35px] text-[10px] text-red-500 text-[#FA3C91]">
                      *{error}
                    </p>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

export default Tasks;