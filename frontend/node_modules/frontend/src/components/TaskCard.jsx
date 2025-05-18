import React, { useState } from 'react';

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }
    onUpdate(task._id, { title: editTitle.trim(), description: editDesc.trim() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setIsEditing(false);
  };

  return (
    <div
      className="
        bg-white dark:bg-gray-700 
        rounded-lg shadow-md p-4 mb-3 
        transition-colors duration-200
      "
    >
      {isEditing ? (
        <>
          <input
            type="text"
            className="w-full bg-white p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-white p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSave}
              className="cursor-pointer bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer bg-gray-400 text-gray-800 px-3 py-1 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h4 className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
          )}
          <div className="mt-3 flex gap-4">
            {onDelete && (
              <button
                onClick={() => onDelete(task._id)}
                className="cursor-pointer text-red-600 dark:text-red-400 font-semibold hover:text-red-800 dark:hover:text-red-300 transition"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-300 transition"
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
