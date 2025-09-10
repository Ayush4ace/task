'use client';

import React, { useState, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useBoard } from '@/hooks/useBoard';

const TaskForm = () => {
  const { selectedTask, closeTaskModal, activeBoard } = useUI();
  const { addTask, editTask, columns } = useBoard();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    columnId: '',
    status: 'todo',
    boardId: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Selected Task:', selectedTask);
    console.log('Active Board:', activeBoard);
    console.log('Columns:', columns);
    
    if (selectedTask) {
      // Editing existing task
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        assignedTo: selectedTask.assignedTo || '',
        columnId: selectedTask.columnId || '',
        status: selectedTask.status || 'todo',
        boardId: selectedTask.boardId || activeBoard?._id || '',
      });
    } else {
      // Creating new task - use activeBoard or first available boardId
      const defaultBoardId = activeBoard?._id || (columns.length > 0 ? columns[0].boardId : '');
      const defaultColumnId = columns.length > 0 ? columns[0]._id : '';
      
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        columnId: defaultColumnId,
        status: 'todo',
        boardId: defaultBoardId,
      });
    }
  }, [selectedTask, columns, activeBoard]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    
    if (!formData.title.trim() || !formData.columnId || !formData.boardId) {
      console.error('Missing required fields:', formData);
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedTask && selectedTask._id) {
        console.log('Editing task:', selectedTask._id);
        await editTask(selectedTask._id, formData);
      } else {
        console.log('Creating new task');
        await addTask(formData);
      }
      closeTaskModal();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="boardId"
            value={formData.boardId}
          />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to (email)
              </label>
              <input
                type="email"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Column *
              </label>
              <select
                name="columnId"
                value={formData.columnId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting || columns.length === 0}
              >
                <option value="">Select a column</option>
                {columns.map(column => (
                  <option key={column._id} value={column._id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting || !formData.boardId || !formData.columnId}
            >
              {isSubmitting ? 'Saving...' : selectedTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;