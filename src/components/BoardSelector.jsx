'use client';

import React from 'react';
import { useBoard } from '@/hooks/useBoard';
import { useState } from 'react';
const BoardSelector = ({ boards, selectedBoardId, onSelectBoard }) => {
  const { addBoard } = useBoard();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      const newBoard = await addBoard({ title: newBoardName.trim() });
      onSelectBoard(newBoard._id);
      setNewBoardName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <select
        value={selectedBoardId || ''}
        onChange={(e) => onSelectBoard(e.target.value)}
        className="border rounded px-3 py-1 text-sm"
      >
        {boards.map(board => (
          <option key={board._id} value={board._id}>
            {board.title}
          </option>
        ))}
      </select>

      {isCreating ? (
        <form onSubmit={handleCreateBoard} className="flex items-center space-x-2">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Board name"
            className="border rounded px-2 py-1 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-2 py-1 rounded text-sm"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          + New Board
        </button>
      )}
    </div>
  );
};

export default BoardSelector;