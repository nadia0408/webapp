// src/components/TableView.js
import React from 'react';

const TableView = ({ data, setData, resourceName = "item" }) => {
  if (!data || data.length === 0) {
    return <p className="p-4 text-gray-500">No {resourceName} data available.</p>;
  }

  const columns = Object.keys(data[0]);

  const handleDeleteRow = (rowIndex) => {
    if (window.confirm(`Are you sure you want to delete this ${resourceName}?`)) {
      const newData = data.filter((_, index) => index !== rowIndex);
      setData(newData); // Parent component needs to handle this state update
    }
  };

  // Helper to format cell values (can be expanded)
  const formatCellValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value); // Simple stringify for objects/arrays
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto max-h-[calc(100vh-200px)]"> {/* Adjust max-h as needed */}
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
            <tr>
              {columns.map(col => (
                <th key={col} scope="col" className="px-4 py-3 font-semibold">
                  {col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {/* Prettify column names */}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 whitespace-nowrap max-w-xs truncate" title={formatCellValue(item[col])}>
                    {/* 
                      For basic display. If you need images or complex rendering:
                      if (col === 'thumbnailUrl' && typeof item[col] === 'string' && item[col].startsWith('http')) {
                        return <img src={item[col]} alt="thumbnail" className="w-10 h-10 object-cover rounded"/>;
                      } 
                    */}
                    {formatCellValue(item[col])}
                  </td>
                ))}
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="text-red-500 hover:text-red-700 font-medium"
                    title={`Delete ${resourceName}`}
                  >
                    <i className="fas fa-trash"></i>
                    {/* Delete */}
                  </button>
                  {/* Add other actions like Edit here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t">
          Showing {data.length} {resourceName}s
        </div>
      )}
    </div>
  );
};

export default TableView;