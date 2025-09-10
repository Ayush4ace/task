'use client';

import React from 'react';
import Task from './Task';
import { useUI } from '@/hooks/useUI';
import StrictModeDroppable from './StrictModeDroppable';

const Column = ({ column, tasks }) => {
  const { openTaskModal } = useUI();

  const handleAddTask = () => {
    openTaskModal({ 
      columnId: column._id, 
      boardId: column.boardId 
    });
  };

  const sortedTasks = tasks.sort((a, b) => a.order - b.order);

  return (
    <div className="bg-gray-50 rounded-lg p-4 w-80 flex-shrink-0 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{column.title}</h2>
        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <StrictModeDroppable 
        droppableId={column._id}
        isDropDisabled={false}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-96 rounded transition-colors p-2 ${
              snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-white'
            }`}
          >
            {sortedTasks.map((task, index) => (
              <Task key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p>No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </StrictModeDroppable>
      
      <button
        onClick={handleAddTask}
        className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center py-2 rounded hover:bg-gray-100 transition-colors"
      >
        + Add task
      </button>
    </div>
  );
};

export default Column;

