'use client';

import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import UserAvatar from './UserAvtar';
import { useUI } from '@/hooks/useUI';

const Task = ({ task, index }) => {
  const { openTaskModal } = useUI();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleClick = () => {
    openTaskModal(task);
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'done': 'bg-green-100 text-green-800',
    'review': 'bg-purple-100 text-purple-800',
  };

  const statusColor = statusColors[task.status] || statusColors.todo;

  // Don't render until mounted to avoid Strict Mode issues
  if (!isMounted || !task._id) {
    return (
      <div className="bg-white p-4 mb-3 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <Draggable 
      draggableId={task._id} 
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={`bg-white p-4 mb-3 rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : ''
          }`}
          style={provided.draggableProps.style}
        >
          <h3 className="font-medium text-gray-900 text-sm mb-2">{task.title}</h3>
          
          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
              {task.status}
            </span>
            
            {task.assignedTo && (
              <UserAvatar email={task.assignedTo} />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(Task);