// src/pages/ResourcePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TableView from '../components/TableView';
import KanbanBoard from '../components/KanbanBoard';

// Define field templates for consistent data handling (can be moved to a shared constants file)
const fieldTemplates = {
    posts: ['userId', 'id', 'title', 'body'],
    comments: ['postId', 'id', 'name', 'email', 'body'],
    albums: ['userId', 'id', 'title'],
    photos: ['albumId', 'id', 'title', 'url', 'thumbnailUrl'],
    todos: ['userId', 'id', 'title', 'completed'],
    users: ['id', 'name', 'username', 'email']
};

// Helper to get a primary display field (title or name)
const getPrimaryField = (resourceName) => {
    if (fieldTemplates[resourceName]?.includes('title')) return 'title';
    if (fieldTemplates[resourceName]?.includes('name')) return 'name';
    return 'id'; // Fallback
};

function ResourcePage() {
  const { resourceName } = useParams(); // e.g., "posts", "users"
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('table'); // 'table' or 'kanban'

  useEffect(() => {
    if (!resourceName) return;

    setLoading(true);
    setError(null);
    setTableData([]); // Clear old data on resource change

    fetch(`https://jsonplaceholder.typicode.com/${resourceName}?_limit=20`) // Fetch limited data for table view
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${resourceName}. Status: ${res.status}`);
        return res.json();
      })
      .then(fetchedData => {
        const items = Array.isArray(fetchedData) ? fetchedData : [fetchedData];
        // Ensure all objects have all keys from fieldTemplates for consistency
        const templateKeys = fieldTemplates[resourceName] || (items.length > 0 ? Object.keys(items[0]) : []);
        const consistentData = items.map(item => {
            const newItem = {};
            templateKeys.forEach(key => newItem[key] = item[key]);
            return newItem;
        });
        setTableData(consistentData);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching ${resourceName}:`, err);
        setError(err.message);
        setLoading(false);
      });
  }, [resourceName]);

  const getTabClass = (viewName) => 
    `pb-2 hover:text-red-600 ${currentView === viewName ? 'border-b-4 border-red-500 text-red-600 font-semibold' : 'text-gray-500'}`;

  const handleSetTableData = (newData) => {
    setTableData(newData);
    // Potentially update localStorage or backend if table data changes are persisted
  };
  
  const pageTitle = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  if (loading) return <div className="p-6 text-gray-700">Loading {pageTitle}...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading {pageTitle}: {error}</div>;

  return (
    <div className="p-6 flex-1"> {/* Ensure ResourcePage takes up space */}
      <div className="flex gap-6 border-b-2 mb-4">
        <button className={getTabClass('table')} onClick={() => setCurrentView('table')}>
          {pageTitle} List
        </button>
        <button className={getTabClass('kanban')} onClick={() => setCurrentView('kanban')}>
          Kanban View
        </button>
      </div>

      {currentView === 'table' && (
        // Pass setTableData for TableView to manage its own data (e.g., after delete)
        <TableView data={tableData} setData={handleSetTableData} resourceName={resourceName} />
      )}
      {currentView === 'kanban' && (
        <KanbanBoard
          resourceType={resourceName}
          initialItems={tableData.slice(0, 10)} // Pass first 10 items from table data as seed for Kanban
          fieldTemplates={fieldTemplates} // Pass field templates for task transformation
          getPrimaryField={getPrimaryField} // Pass helper to get title/name
        />
      )}
    </div>
  );
}

export default ResourcePage;