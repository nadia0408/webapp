// src/components/KanbanToolbar.js
import React from 'react';

// Props:
// onAddTaskToOpen: function to trigger adding a new task to the "To Do" column
const KanbanToolbar = ({ onAddTaskToOpen }) => {
  return (
    <div className="p-4 bg-white border-b flex space-x-3">
      <button
        onClick={onAddTaskToOpen}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold flex items-center"
      >
        <i className="fas fa-plus mr-2"></i> Add Task to To Do
      </button>
      
      {/* Other toolbar items can be added here if needed later */}
    </div>
  );
};

export default KanbanToolbar;