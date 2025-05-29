// src/components/KanbanBoard.js
import React, { useState, useEffect, useCallback } from 'react';
import KanbanToolbar from './KanbanToolbar';
import KanbanColumn from './KanbanColumn';

// Default Kanban columns for any resource
const getDefaultColumns = () => ({
  todo: { id: 'todo', name: 'To Do', tasks: [] },
  inProgress: { id: 'inProgress', name: 'In Progress', tasks: [] },
  completed: { id: 'completed', name: 'Completed', tasks: [] },
});

// Helper to transform API item to a Kanban task structure
const apiItemToKanbanTask = (item, resourceType, fieldTemplates, getPrimaryField) => {
  const primaryField = getPrimaryField(resourceType);
  let title = item[primaryField] || `Item ${item.id}`;
  
  let detailsArray = [];
  const fields = fieldTemplates[resourceType] || Object.keys(item);

  fields.forEach(key => {
    if (key === primaryField || key === 'id') return; // Already used or part of ID
    if (item[key] !== undefined && item[key] !== null) {
      let value = String(item[key]);
      if (typeof item[key] === 'object') value = JSON.stringify(item[key]);
      
      let displayValue = value;
      // Basic truncation for display
      if (key === 'body' && value.length > 100) displayValue = value.substring(0, 97) + '...';
      else if (value.length > 50) displayValue = value.substring(0, 47) + '...';

      if (key === 'thumbnailUrl' || (key === 'url' && resourceType === 'photos')) {
        detailsArray.push(`<img src="${item.thumbnailUrl || item.url}" alt="thumb" class="max-w-full h-16 object-contain rounded my-1">`);
      } else if (key === 'completed' && resourceType === 'todos') {
        detailsArray.push(`<span class="text-xs"><i class="fas ${item.completed ? 'fa-check-square text-green-500' : 'fa-square text-gray-400'}"></i> ${key.charAt(0).toUpperCase() + key.slice(1)}: ${item.completed}</span>`);
      } else {
        detailsArray.push(`<p class="text-xs text-gray-600 mb-1"><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${displayValue}</p>`);
      }
    }
  });

  return {
    id: `task-${resourceType}-${item.id}-${Date.now()}`, // Unique ID for DND
    originalId: item.id,
    resource: resourceType,
    title: title,
    detailsHTML: detailsArray.join(''), // This will be rendered by TaskCard
    // Add any other common fields if needed, or transform them into detailsHTML
  };
};


const KanbanBoard = ({ resourceType, initialItems, fieldTemplates, getPrimaryField }) => {
  const [columns, setColumns] = useState(getDefaultColumns());
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback(() => `kanban-data-react-${resourceType}`, [resourceType]);

  // Load columns from localStorage or initialize
  useEffect(() => {
    setIsLoading(true);
    const savedColumns = localStorage.getItem(getStorageKey());
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        // Ensure all default columns exist if saved data is partial
        setColumns(prev => ({ ...getDefaultColumns(), ...parsed }));
      } catch (e) {
        console.error("Failed to parse Kanban data from localStorage", e);
        setColumns(getDefaultColumns());
      }
    } else if (initialItems && initialItems.length > 0) {
      // If no saved data, and initialItems are provided, populate "To Do"
      const initialTasks = initialItems
        .slice(0, 5) // Take first 5 or as needed
        .map(item => apiItemToKanbanTask(item, resourceType, fieldTemplates, getPrimaryField));
      
      setColumns(prev => ({
        ...getDefaultColumns(),
        todo: { ...prev.todo, tasks: initialTasks },
      }));
    } else {
      // No saved data and no initial items (e.g., direct navigation to Kanban empty)
      // Optionally, fetch fresh data here if initialItems is empty but resourceType is valid
      // For now, just default to empty columns.
       setColumns(getDefaultColumns());
    }
    setIsLoading(false);
  }, [resourceType, initialItems, getStorageKey, fieldTemplates, getPrimaryField]);

  // Save columns to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) { // Only save after initial load/setup
      localStorage.setItem(getStorageKey(), JSON.stringify(columns));
    }
  }, [columns, getStorageKey, isLoading]);

  const handleDragStart = (e, taskId, originColumnId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('originColumnId', originColumnId);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const originColumnId = e.dataTransfer.getData('originColumnId');
    if (!taskId || originColumnId === targetColumnId || !columns[originColumnId] || !columns[targetColumnId]) return;

    let taskToMove;
    const newOriginTasks = columns[originColumnId].tasks.filter(task => {
      if (task.id === taskId) {
        taskToMove = task;
        return false;
      }
      return true;
    });

    if (taskToMove) {
      const newTargetTasks = [...columns[targetColumnId].tasks, taskToMove];
      setColumns(prev => ({
        ...prev,
        [originColumnId]: { ...prev[originColumnId], tasks: newOriginTasks },
        [targetColumnId]: { ...prev[targetColumnId], tasks: newTargetTasks },
      }));
    }
  };
  
  const addNewTaskToTodo = () => {
    const primaryField = getPrimaryField(resourceType);
    const title = prompt(`Enter ${primaryField} for new ${resourceType} task (will be added to 'To Do'):`);
    if (!title || title.trim() === "") return;

    // Create a mock API item for transformation
    const mockApiItem = { id: Date.now() }; // This will be the originalId
    mockApiItem[primaryField] = title.trim();
    // Add other default fields based on fieldTemplates if necessary for transformation
     (fieldTemplates[resourceType] || []).forEach(field => {
        if (!mockApiItem.hasOwnProperty(field) && field !== 'id' && field !== primaryField) {
            if (field === 'body') mockApiItem[field] = "Default body added via Kanban.";
            else if (field === 'email' && resourceType === 'comments') mockApiItem[field] = "new@example.com";
            else if (field === 'completed' && resourceType === 'todos') mockApiItem[field] = false;
            // Add more defaults as needed for other resource types
        }
    });

    const newTask = apiItemToKanbanTask(mockApiItem, resourceType, fieldTemplates, getPrimaryField);
    
    setColumns(prev => ({
      ...prev,
      todo: { ...prev.todo, tasks: [newTask, ...prev.todo.tasks] }, // Add to top
    }));
  };

  if (isLoading) {
    return <div className="p-4 text-gray-600">Loading Kanban board for {resourceType}...</div>;
  }

  return (
    <div className="flex flex-col h-full"> {/* Use h-full for flex child */}
      <KanbanToolbar onAddTaskToOpen={addNewTaskToTodo} />
      <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
        {Object.values(columns).map((column) => (
          <KanbanColumn
            key={column.id}
            column={column} // Pass the whole column object
            tasks={column.tasks}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            // No isFirstColumn needed anymore
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;