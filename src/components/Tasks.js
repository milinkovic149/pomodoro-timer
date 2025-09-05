import React, { useState, useMemo, useEffect } from 'react';
import Button from './Button';
import { useUser } from '../contexts/UserContext';

// SVG Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

// Small check icon for marking tasks done
const CheckIcon = ({ filled = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {filled && <circle cx="12" cy="12" r="10" fill="currentColor" />}
    <polyline points="6,12 10,16 18,8" stroke={filled ? '#fff' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Tasks = () => {
  const { tasksData, saveTasksData, activeTaskId, setActiveTaskId } = useUser();
  const [tasks, setTasks] = useState(tasksData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [estPomos, setEstPomos] = useState(1);
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTasks(tasksData);
  }, [tasksData]);

  // Calculate totals
  const totalTasks = tasks.length;
  // Guard against string values coming from storage by coercing to Number
  const totalEstPomos = tasks.reduce((sum, task) => sum + Number(task.estPomos || 0), 0);
  const completedPomos = tasks.reduce((sum, task) => sum + Number(task.completedPomos || 0), 0);

  // Calculate finish time (approximate)
  const finishAt = useMemo(() => {
    const remainingPomos = totalEstPomos - completedPomos;
    if (remainingPomos <= 0) return 'Done';

    const now = new Date();
    const workMins = 25; // minutes of focused work per pomo

    // Compute total minutes including breaks between pomodoros
    // There are (remainingPomos - 1) breaks; after every 4th completed pomo there's a long break (15min), otherwise short (5min)
    let totalMinutes = remainingPomos * workMins;
    for (let i = 1; i < remainingPomos; i++) {
      const pomoNumber = completedPomos + i; // pomo index after this upcoming pomo
      totalMinutes += (pomoNumber % 4 === 0) ? 15 : 5;
    }

    const finishTime = new Date(now.getTime() + totalMinutes * 60000);
    return finishTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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
  }, [showAddForm, showDescription, handleSaveTask]);

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

  const handleSaveTask = React.useCallback(() => {
    if (!title.trim()) {
      setError('title is required field');
      return;
    }
    setError('');

    let newTasks;
    if (editingTask) {
      // Edit existing task
      newTasks = tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: title.trim(), estPomos, description }
          : task
      );
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        estPomos,
        completedPomos: 0,
        done: false,
        description
      };
      // put new tasks at the top
      newTasks = [newTask, ...tasks];
    }

    setTasks(newTasks);
    saveTasksData(newTasks);
    // close & reset form inline to avoid depending on resetForm
    setShowAddForm(false);
    setTitle('');
    setEstPomos(1);
    setDescription('');
    setShowDescription(false);
    setEditingTask(null);
  }, [title, estPomos, description, editingTask, tasks, saveTasksData]);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setEstPomos(task.estPomos);
    setDescription(task.description || '');
    setShowDescription(!!task.description);
    setShowAddForm(true);
  };

  const handleDeleteTask = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
    saveTasksData(newTasks);
  };

  // Toggle done state for a task. If marking done, ensure completedPomos >= estPomos.
  const toggleDone = (taskId) => {
    const newTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      const isNowDone = !t.done;
      // If marking done -> set completed to estPomos; if unmarking -> reset completed to 0
      const completed = isNowDone ? Number(t.estPomos || 0) : 0;
      return { ...t, done: isNowDone, completedPomos: completed };
    });

    // Move done tasks to the bottom while preserving order within groups
    const notDone = newTasks.filter(t => !t.done);
    const done = newTasks.filter(t => t.done);
    const ordered = [...notDone, ...done];
    setTasks(ordered);
    saveTasksData(ordered);

    // If we just marked the active task done, advance active to next not-done task
    if (activeTaskId === taskId) {
      const idx = newTasks.findIndex(t => t.id === taskId);
      let next = null;
      for (let i = idx + 1; i < newTasks.length; i++) {
        if (!newTasks[i].done) { next = newTasks[i]; break; }
      }
      if (!next) {
        for (let i = 0; i < newTasks.length; i++) {
          if (!newTasks[i].done) { next = newTasks[i]; break; }
        }
      }
      setActiveTaskId(next ? next.id : null);
    }
  };

  const incrementPomos = (taskId) => {
    const newTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completedPomos: Math.min(task.completedPomos + 1, task.estPomos) }
        : task
    );

    // If task reached its estimated pomodoros, mark done and advance active
    const updatedTask = newTasks.find(t => t.id === taskId);
    if (updatedTask && updatedTask.completedPomos >= updatedTask.estPomos && !updatedTask.done) {
      const newTasksWithDone = newTasks.map(t => t.id === taskId ? { ...t, done: true } : t);
      // reorder so done tasks are at the bottom
      const notDone = newTasksWithDone.filter(t => !t.done);
      const done = newTasksWithDone.filter(t => t.done);
      const ordered = [...notDone, ...done];
      setTasks(ordered);
      saveTasksData(ordered);
      // advance active to next available task
      const idx = newTasksWithDone.findIndex(t => t.id === taskId);
      // find next not-done task after idx, otherwise earlier, otherwise null
      let next = null;
      for (let i = idx + 1; i < newTasksWithDone.length; i++) {
        if (!newTasksWithDone[i].done) { next = newTasksWithDone[i]; break; }
      }
      if (!next) {
        for (let i = 0; i < newTasksWithDone.length; i++) {
          if (!newTasksWithDone[i].done) { next = newTasksWithDone[i]; break; }
        }
      }
      setActiveTaskId(next ? next.id : null);
      return;
    }

    setTasks(newTasks);
    saveTasksData(newTasks);
  };

  const decrementPomos = (taskId) => {
    const newTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completedPomos: Math.max(task.completedPomos - 1, 0) }
        : task
    );
    setTasks(newTasks);
    saveTasksData(newTasks);
  };

  const handleSetActive = (taskId) => {
    setActiveTaskId(taskId);
  };

  // If tasksData updates (e.g., from Timer addPomo), auto-mark done and advance active if needed
  useEffect(() => {
    // tasks is kept in state from tasksData via useEffect above; operate on tasks
    const toMark = tasks.filter(t => t.completedPomos >= t.estPomos && !t.done);
    if (toMark.length === 0) return;
    const idsToMark = new Set(toMark.map(t => t.id));
    const newTasks = tasks.map(t => idsToMark.has(t.id) ? { ...t, done: true } : t);
    // reorder so done tasks go to bottom
    const notDone = newTasks.filter(t => !t.done);
    const done = newTasks.filter(t => t.done);
    const ordered = [...notDone, ...done];
    setTasks(ordered);
    saveTasksData(ordered);

    // If active task was one of these, advance
    if (activeTaskId && idsToMark.has(activeTaskId)) {
      const idx = newTasks.findIndex(t => t.id === activeTaskId);
      let next = null;
      for (let i = idx + 1; i < newTasks.length; i++) {
        if (!newTasks[i].done) { next = newTasks[i]; break; }
      }
      if (!next) {
        for (let i = 0; i < newTasks.length; i++) {
          if (!newTasks[i].done) { next = newTasks[i]; break; }
        }
      }
      setActiveTaskId(next ? next.id : null);
    }
  }, [tasks, activeTaskId, saveTasksData, setActiveTaskId]);

  return (
      <div className="border border-1 max-w-[470px] mx-auto bg-gradient-to-r from-[#2523D5] to-[#FA3C91] rounded-[15px] p-[15px] pt-[10px]">
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-white border-opacity-20 pb-[6px]">
          <span>tasks: {totalTasks}</span>
          <div className="flex items-center gap-[7px]">
            <span>pomos: {completedPomos}/{totalEstPomos}</span>
            <span>finish at: {finishAt}</span>
          </div>
        </div>

        {/* Add/Edit Task Form (now rendered above the list) */}
        {showAddForm && (
            <div className="flex items-end justify-center mt-[10px] mb-[10px]">
              <div className="relative w-full border border-white border-opacity-20 rounded-[4px] py-[15px] px-[12px]">
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
                        className="absolute top-[3px] right-[10px] max-w-[15px]"
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

        {/* Task List */}
        <div className="flex flex-col gap-[8px] mt-[8px] mb-[8px]">
          {tasks.map(task => (
              <div
                  key={task.id}
                  onClick={() => handleSetActive(task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSetActive(task.id); } }}
                  className={`border rounded-[4px] px-[12px] py-[15px] cursor-pointer ${task.id === activeTaskId ? 'border-l-5 border-white border-opacity-80 bg-green-500/10' : ''} ${task.done ? 'border-white border-opacity-50' : 'border-white border-opacity-20'}`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-[16px] font-medium mb-1 ${task.done ? 'line-through opacity-60' : ''}`}>{task.title}</h3>
                    <div className="flex items-center gap-[2px]">
                      {/* Pomos counter */}
                      <div className="flex items-center gap-2">
                      <span className="text-[16px] font-medium min-w-[50px] text-center">
                        {task.completedPomos}/{task.estPomos}
                      </span>
                      </div>

                      {/* Edit button */}
                      <button
                          onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}
                          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                      >
                        <EditIcon />
                      </button>

                      {/* done toggle (checkbox) */}
                      <button
                          onClick={(e) => { e.stopPropagation(); toggleDone(task.id); }}
                          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                          aria-label={task.done ? 'mark not done' : 'mark done'}
                      >
                        <CheckIcon filled={Boolean(task.done)} />
                      </button>

                      {/* Delete button */}
                      <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                  {task.description && (
                      <p className={`text-[12px] mt-[8px] text-white/80 mb-2 whitespace-pre-wrap ${task.done ? 'line-through opacity-60' : ''}`}>
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

        {/* Add/Edit form moved above the list (duplicate removed) */}
      </div>
  );
};

export default Tasks;