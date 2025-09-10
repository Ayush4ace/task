import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  openTaskForm,
  closeTaskForm,
  setActiveBoard,
  setSearchTerm,
  setFilter,
  showNotification,
  clearNotification,
} from '@/lib/store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useDispatch();
  const {
    isTaskFormOpen,
    selectedTask,
    activeBoard,
    searchTerm,
    filters,
    notification,
  } = useSelector(state => state.ui);

  const openTaskModal = useCallback((task = null) => {
    // Always include the active board ID if available
    const taskData = task ? { 
      ...task, 
      boardId: task.boardId || activeBoard?._id 
    } : { boardId: activeBoard?._id };
    
    dispatch(openTaskForm(taskData));
  }, [dispatch, activeBoard]);

  const closeTaskModal = useCallback(() => {
    dispatch(closeTaskForm());
  }, [dispatch]);

  const setCurrentBoard = useCallback((board) => {
    dispatch(setActiveBoard(board));
  }, [dispatch]);

  const updateSearchTerm = useCallback((term) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilter(newFilters));
  }, [dispatch]);

  const displayNotification = useCallback((message, type = 'info') => {
    dispatch(showNotification({ message, type }));
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  }, [dispatch]);

  const clearCurrentNotification = useCallback(() => {
    dispatch(clearNotification());
  }, [dispatch]);

  return {
    // State
    isTaskFormOpen,
    selectedTask,
    activeBoard,
    searchTerm,
    filters,
    notification,
    
    // Actions
    openTaskModal,
    closeTaskModal,
    setCurrentBoard,
    updateSearchTerm,
    updateFilters,
    displayNotification,
    clearCurrentNotification,
  };
};