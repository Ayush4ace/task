// Board.jsx
'use client';

import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useBoard } from '@/hooks/useBoard';
import { useUI } from '@/hooks/useUI';
import Column from './Column';
import BoardHeader from './BoardHeader';
import Notification from './Notification';
import DragDropErrorBoundary from './DragDropErrorBoundary';
import { moveTaskOptimistically as moveTaskOptimisticallyAction, revertTaskMove as revertTaskMoveAction } from '@/lib/store/slices/tasksSlice';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

const Board = ({ boardId }) => {
  const { currentBoard, columns, tasks, loadBoard, loadColumns, loadTasks, moveTaskToColumn } = useBoard();
  const { displayNotification } = useUI();
  const dispatch = useDispatch();

  // Rename these functions to avoid conflict with the imported actions
  const handleMoveTaskOptimistically = useCallback((params) => {
    dispatch(moveTaskOptimisticallyAction(params));
  }, [dispatch]);

  const handleRevertTaskMove = useCallback((params) => {
    dispatch(revertTaskMoveAction(params));
  }, [dispatch]);

  useEffect(() => {
    if (boardId) {
      loadBoard(boardId);
      loadColumns({ boardId });
      loadTasks({ boardId });
    }
  }, [boardId, loadBoard, loadColumns, loadTasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = draggableId;
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
    
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const destinationColumn = columns.find(c => c._id === destinationColumnId);
    const newStatus = destinationColumn ? destinationColumn.title.toLowerCase().replace(' ', '-') : task.status;

    const originalData = {
      columnId: task.columnId,
      status: task.status,
      order: task.order,
    };

    // Use the renamed function
    handleMoveTaskOptimistically({
      taskId,
      newColumnId: destinationColumnId,
      newStatus,
      newOrder: destination.index,
      originalColumnId: originalData.columnId,
      originalStatus: originalData.status,
      originalOrder: originalData.order,
    });

    try {
      await moveTaskToColumn(taskId, {
        columnId: destinationColumnId,
        status: newStatus,
        order: destination.index,
      });

      displayNotification('Task moved successfully!', 'success');
    } catch (error) {
      console.error('Failed to move task:', error);
      // Use the renamed function
      handleRevertTaskMove({
        taskId,
        ...originalData
      });
      displayNotification('Failed to move task. Please try again.', 'error');
    }
  };

  if (!currentBoard) {
    return <div className="p-4">Loading board...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <BoardHeader board={currentBoard} />
      
      <DragDropErrorBoundary>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 p-4 overflow-x-auto">
            <div className="flex space-x-4 min-h-full">
              {columns.map(column => (
                <Column
                  key={column._id}
                  column={column}
                  tasks={tasks.filter(task => task.columnId === column._id)}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      </DragDropErrorBoundary>
      
      <Notification />
    </div>
  );
};

export default Board;


