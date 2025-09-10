'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useUI } from '@/hooks/useUI';
const Notification = () => {
  const { notification } = useSelector(state => state.ui);
  const { clearCurrentNotification } = useUI();

  if (!notification) return null;

  const bgColor = {
    success: 'bg-green-500',  
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[notification.type] || 'bg-blue-500';

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-3`}>
        <span>{notification.message}</span>
        <button
          onClick={clearCurrentNotification}
          className="text-white hover:text-gray-200 text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;