import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useEffect } from 'react';
import {
  fetchBoards,
  fetchBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  setCurrentBoard,
} from '@/lib/store/slices/boardsSlice';
import {
  fetchColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from '@/lib/store/slices/columnsSlice';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from '@/lib/store/slices/tasksSlice';

export const useBoard = () => {
  const dispatch = useDispatch();
  const { items: boards, currentBoard, loading, error } = useSelector(state => state.boards);
  const { items: columns } = useSelector(state => state.columns);
  const { items: tasks } = useSelector(state => state.tasks);


  useEffect(() => {
    console.log('Boards:', boards);
    console.log('Current Board:', currentBoard);
    console.log('Columns:', columns);
    console.log('Tasks:', tasks);
  }, [boards, currentBoard, columns, tasks]);

  // Board actions
  const loadBoards = useCallback(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const loadBoard = useCallback((boardId) => {
    dispatch(fetchBoardById(boardId));
  }, [dispatch]);

  const addBoard = useCallback((boardData) => {
    return dispatch(createBoard(boardData)).unwrap();
  }, [dispatch]);

  const editBoard = useCallback((boardId, updates) => {
    return dispatch(updateBoard({ id: boardId, updates })).unwrap();
  }, [dispatch]);

  const removeBoard = useCallback((boardId) => {
    return dispatch(deleteBoard(boardId)).unwrap();
  }, [dispatch]);

  const selectBoard = useCallback((board) => {
    dispatch(setCurrentBoard(board));
  }, [dispatch]);

  // Column actions
  const loadColumns = useCallback((filters = {}) => {
    dispatch(fetchColumns(filters));
  }, [dispatch]);

  const addColumn = useCallback((columnData) => {
    return dispatch(createColumn(columnData)).unwrap();
  }, [dispatch]);

  const editColumn = useCallback((columnId, updates) => {
    return dispatch(updateColumn({ id: columnId, updates })).unwrap();
  }, [dispatch]);

  const removeColumn = useCallback((columnId) => {
    return dispatch(deleteColumn(columnId)).unwrap();
  }, [dispatch]);

  // Task actions
  const loadTasks = useCallback((filters = {}) => {
    dispatch(fetchTasks(filters));
  }, [dispatch]);

  const addTask = useCallback((taskData) => {
    return dispatch(createTask(taskData)).unwrap();
  }, [dispatch]);

  const editTask = useCallback((taskId, updates) => {
    return dispatch(updateTask({ id: taskId, updates })).unwrap();
  }, [dispatch]);

  const removeTask = useCallback((taskId) => {
    return dispatch(deleteTask(taskId)).unwrap();
  }, [dispatch]);

  const moveTaskToColumn = useCallback((taskId, moveData) => {
    return dispatch(moveTask({ taskId, moveData })).unwrap();
  }, [dispatch]);

  return {
    // State
    boards,
    currentBoard,
    columns,
    tasks,
    loading,
    error,
    
    // Board actions
    loadBoards,
    loadBoard,
    addBoard,
    editBoard,
    removeBoard,
    selectBoard,
    
    // Column actions
    loadColumns,
    addColumn,
    editColumn,
    removeColumn,
    
    // Task actions
    loadTasks,
    addTask,
    editTask,
    removeTask,
    moveTaskToColumn,
  };
};