import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Removed NavLink as sidebar handles it
import Posts from "./pages/Posts";
import Comments from "./pages/Comments";
import Albums from "./pages/Albums";
import Photos from "./pages/Photos";
import Todos from "./pages/Todos";
import Users from "./pages/Users";
import KanbanBoard from "./components/KanbanBoard"; // Corrected path
import Sidebar from "./components/Sidebar"; // Assuming Sidebar is in components
import ResourcePage from './pages/ResourcePage';

// If your pages/TableView components are simple, you might not need separate files
// For this example, I'm keeping them.
// import './App.css'; // If you have an App.css for overall layout

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden"> {/* Added flex and h-screen */}
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"> {/* Main content takes rest of space */}
          <Routes>
            <Route path="/posts" element={<Posts />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/users" element={<Users />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/" element={<KanbanBoard />} /> {/* Default to Kanban */}
            {/* Add other routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;