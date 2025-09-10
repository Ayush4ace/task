'use client';

import React, { useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Enable after component mounts to avoid Strict Mode issues
    setEnabled(true);
  }, []);

  if (!enabled) {
    return (
      <div className="min-h-96 rounded bg-white p-2">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Droppable {...props}>
      {children}
    </Droppable>
  );
};

export default StrictModeDroppable;