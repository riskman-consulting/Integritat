import { NavLink, useNavigate } from "react-router-dom";
import { Users, Home, Settings, LogOut, FolderPlus } from "lucide-react";
import { authAPI } from "../utils/api";
import logo from '../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/admin/dashboard" },
    { name: "Clients", icon: <Users size={18} />, path: "/admin/clients" },
    { name: "Projects", icon: <FolderPlus size={18} />, path: "/admin/project" },
    { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    authAPI.logout();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200 shadow-sm">

      {/* BRAND HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3 w-full">
          <img src={logo} alt="Integritat" className="h-8 w-auto" />
          <h1 className="text-lg font-bold text-slate-800">Integritat</h1>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm ${isActive
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group font-medium text-sm"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;