// src/components/KanbanColumn.js
import React from 'react';
import TaskCard from './TaskCard';
// SprintInfoCard is no longer used here

// Updated header colors for generic columns
const headerColors = {
  todo: 'bg-blue-100 text-blue-700 border border-blue-300',
  inProgress: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  completed: 'bg-green-100 text-green-700 border border-green-300',
};

const KanbanColumn = ({ column, tasks, onDragOver, onDrop, onDragStart }) => {
  // The 'column' prop now directly contains id, name, and tasks
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
      className="bg-gray-100 p-3 rounded-lg min-h-[calc(100vh-300px)] flex flex-col" // Adjusted min-height based on your original CSS
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          {/* Arrow button logic might not be needed if all columns are standard */}
          {/* <button className="text-gray-500 hover:text-black mr-2">
            <i className="fas fa-arrow-left"></i>
          </button> */}
          <h3 className={`text-sm font-semibold px-2 py-1 rounded ${headerColors[column.id] || 'bg-gray-200 text-gray-800'}`}>
            {/* Display task count from tasks.length directly */}
            {`${tasks.length} ${column.name}`}
          </h3>
        </div>
      </div>
      
      <div className="flex-grow space-y-0 overflow-y-auto pr-1 kanban-column-content"> {/* Added class for custom scrollbar */}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} columnId={column.id} />
        ))}
        {tasks.length === 0 && (
          <div className="flex-grow flex items-center justify-center text-center text-gray-400 text-sm p-4">
            No tasks in this column.
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;