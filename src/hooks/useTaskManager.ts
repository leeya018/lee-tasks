import { useState, useEffect, useCallback } from 'react';
import { Category, Task, TaskManagerData, CategoryColor } from '@/types/task';
import { format, addDays } from 'date-fns';

const STORAGE_KEY = 'daily-task-manager';

const getDefaultData = (): TaskManagerData => ({
  categories: [],
  tasks: {},
});

const generateId = () => crypto.randomUUID();

export const formatDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export function useTaskManager() {
  const [data, setData] = useState<TaskManagerData>(getDefaultData);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save data to localStorage:', error);
      }
    }
  }, [data, isLoaded]);

  const dateKey = formatDateKey(selectedDate);
  const tasksForDate = data.tasks[dateKey] || [];

  // Category operations
  const addCategory = useCallback((name: string, color: CategoryColor) => {
    const newCategory: Category = { id: generateId(), name, color };
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, name: string, color: CategoryColor) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === id ? { ...cat, name, color } : cat
      ),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData(prev => {
      // Remove all tasks belonging to this category
      const newTasks: TaskManagerData['tasks'] = {};
      Object.entries(prev.tasks).forEach(([date, tasks]) => {
        const filtered = tasks.filter(t => t.categoryId !== id);
        if (filtered.length > 0) {
          newTasks[date] = filtered;
        }
      });
      return {
        categories: prev.categories.filter(cat => cat.id !== id),
        tasks: newTasks,
      };
    });
  }, []);

  // Task operations
  const addTask = useCallback((categoryId: string, text: string) => {
    const newTask: Task = { id: generateId(), categoryId, text, done: false };
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [dateKey]: [...(prev.tasks[dateKey] || []), newTask],
      },
    }));
    return newTask;
  }, [dateKey]);

  const updateTask = useCallback((taskId: string, text: string) => {
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [dateKey]: prev.tasks[dateKey]?.map(task =>
          task.id === taskId ? { ...task, text } : task
        ) || [],
      },
    }));
  }, [dateKey]);

  const toggleTask = useCallback((taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [dateKey]: prev.tasks[dateKey]?.map(task =>
          task.id === taskId ? { ...task, done: !task.done } : task
        ) || [],
      },
    }));
  }, [dateKey]);

  const toggleTaskStar = useCallback((taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [dateKey]: prev.tasks[dateKey]?.map(task =>
          task.id === taskId ? { ...task, starred: !task.starred } : task
        ) || [],
      },
    }));
  }, [dateKey]);

  const reorderTasks = useCallback((categoryId: string, fromIndex: number, toIndex: number) => {
    setData(prev => {
      const categoryTasks = prev.tasks[dateKey]?.filter(t => t.categoryId === categoryId) || [];
      const otherTasks = prev.tasks[dateKey]?.filter(t => t.categoryId !== categoryId) || [];
      
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= categoryTasks.length || toIndex >= categoryTasks.length) {
        return prev;
      }

      const reordered = [...categoryTasks];
      const [movedTask] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, movedTask);

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [dateKey]: [...otherTasks, ...reordered],
        },
      };
    });
  }, [dateKey]);

  const deleteTask = useCallback((taskId: string) => {
    setData(prev => {
      const filtered = prev.tasks[dateKey]?.filter(t => t.id !== taskId) || [];
      const newTasks = { ...prev.tasks };
      if (filtered.length > 0) {
        newTasks[dateKey] = filtered;
      } else {
        delete newTasks[dateKey];
      }
      return { ...prev, tasks: newTasks };
    });
  }, [dateKey]);

  const moveTaskToNextDay = useCallback((taskId: string) => {
    setData(prev => {
      const task = prev.tasks[dateKey]?.find(t => t.id === taskId);
      if (!task) return prev;

      const nextDateKey = formatDateKey(addDays(selectedDate, 1));
      const movedTask = { ...task, done: false };

      // Remove from current date
      const currentFiltered = prev.tasks[dateKey]?.filter(t => t.id !== taskId) || [];
      const newTasks = { ...prev.tasks };
      
      if (currentFiltered.length > 0) {
        newTasks[dateKey] = currentFiltered;
      } else {
        delete newTasks[dateKey];
      }

      // Add to next date
      newTasks[nextDateKey] = [...(newTasks[nextDateKey] || []), movedTask];

      return { ...prev, tasks: newTasks };
    });
  }, [dateKey, selectedDate]);

  const copyTaskToNextDay = useCallback((taskId: string) => {
    setData(prev => {
      const task = prev.tasks[dateKey]?.find(t => t.id === taskId);
      if (!task) return prev;

      const nextDateKey = formatDateKey(addDays(selectedDate, 1));
      const copiedTask: Task = { ...task, id: generateId(), done: false };

      const newTasks = { ...prev.tasks };
      newTasks[nextDateKey] = [...(newTasks[nextDateKey] || []), copiedTask];

      return { ...prev, tasks: newTasks };
    });
  }, [dateKey, selectedDate]);

  const moveCategoryTasksToNextDay = useCallback((categoryId: string) => {
    setData(prev => {
      const categoryTasks = prev.tasks[dateKey]?.filter(t => t.categoryId === categoryId) || [];
      if (categoryTasks.length === 0) return prev;

      const nextDateKey = formatDateKey(addDays(selectedDate, 1));
      const movedTasks = categoryTasks.map(t => ({ ...t, done: false }));

      // Remove from current date
      const currentFiltered = prev.tasks[dateKey]?.filter(t => t.categoryId !== categoryId) || [];
      const newTasks = { ...prev.tasks };
      
      if (currentFiltered.length > 0) {
        newTasks[dateKey] = currentFiltered;
      } else {
        delete newTasks[dateKey];
      }

      // Add to next date
      newTasks[nextDateKey] = [...(newTasks[nextDateKey] || []), ...movedTasks];

      return { ...prev, tasks: newTasks };
    });
  }, [dateKey, selectedDate]);

  const copyCategoryTasksToNextDay = useCallback((categoryId: string) => {
    setData(prev => {
      const categoryTasks = prev.tasks[dateKey]?.filter(t => t.categoryId === categoryId) || [];
      if (categoryTasks.length === 0) return prev;

      const nextDateKey = formatDateKey(addDays(selectedDate, 1));
      const copiedTasks = categoryTasks.map(t => ({ ...t, id: generateId(), done: false }));

      const newTasks = { ...prev.tasks };
      newTasks[nextDateKey] = [...(newTasks[nextDateKey] || []), ...copiedTasks];

      return { ...prev, tasks: newTasks };
    });
  }, [dateKey, selectedDate]);

  // Navigation
  const goToPreviousDay = useCallback(() => {
    setSelectedDate(prev => addDays(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate(prev => addDays(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setData(getDefaultData());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // Data
    categories: data.categories,
    tasksForDate,
    selectedDate,
    isLoaded,

    // Category operations
    addCategory,
    updateCategory,
    deleteCategory,

    // Task operations
    addTask,
    updateTask,
    toggleTask,
    toggleTaskStar,
    reorderTasks,
    deleteTask,
    moveTaskToNextDay,
    copyTaskToNextDay,
    moveCategoryTasksToNextDay,
    copyCategoryTasksToNextDay,

    // Navigation
    goToPreviousDay,
    goToNextDay,
    goToToday,

    // Utils
    clearAllData,
  };
}