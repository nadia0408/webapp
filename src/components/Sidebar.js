// src/components/Sidebar.js
import { Link, useLocation } from 'react-router-dom';

const links = [
  { name: 'Posts', to: '/posts', icon: 'fas fa-file-alt' },
  { name: 'Comments', to: '/comments', icon: 'fas fa-flag' },
  { name: 'Albums', to: '/albums', icon: 'fas fa-images' },
  { name: 'Photos', to: '/photos', icon: 'fas fa-camera-retro' },
  { name: 'Todos', to: '/todos', icon: 'fas fa-check-square' },
  { name: 'Users', to: '/users', icon: 'fas fa-users' },
  // { name: 'Kanban', to: '/kanban', icon: 'fas fa-columns' }, // Removed this line
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 bg-gray-200 p-4 space-y-2 flex-shrink-0 h-full shadow-lg">
      <div className="flex items-center gap-2 text-xl font-bold mb-6 text-gray-700">
        {/* <div className="logo-icon">🔒</div> LOCKATED (from your HTML) */}
        <span>Task Manager</span> {/* Or your app name */}
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-2.5 rounded-md text-sm font-medium transition-colors ${
              // Handle active state for paths like /posts, /users etc.
              location.pathname.startsWith(link.to) 
                ? 'bg-red-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900'
            }`}
          >
            {link.icon && <i className={`${link.icon} w-5 h-5`}></i>}
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;