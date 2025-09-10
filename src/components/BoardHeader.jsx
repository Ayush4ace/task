'use client';

import React from 'react';
import { useUI } from '@/hooks/useUI';

const BoardHeader = ({ board }) => {
  const { openTaskModal } = useUI();

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {board.columns?.length || 0} columns • {board.tasksCount || 0} tasks
          </p>
        </div>
        
        
      </div>
    </div>
  );
};

export default BoardHeader;