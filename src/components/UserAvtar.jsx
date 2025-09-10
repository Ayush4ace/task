'use client';

import React from 'react';

const UserAvatar = ({ email, size = 'sm' }) => {
  const getInitials = (email) => {
    return email.charAt(0).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const colorClasses = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-red-500 text-white',
    'bg-yellow-500 text-white',
    'bg-indigo-500 text-white',
  ];

  const colorIndex = email.length % colorClasses.length;
  const colorClass = colorClasses[colorIndex];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium ${sizeClasses[size]} ${colorClass}`}
      title={email}
    >
      {getInitials(email)}
    </div>
  );
};

export default UserAvatar;