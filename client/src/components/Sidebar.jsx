import { NavLink } from "react-router-dom";
import { Users, FileText, Home, Settings, LogOut, FolderPlus } from "lucide-react";
import logo from '../assets/integritat-logo.png';


const Sidebar = () => {
  const menu = [
    { name: "Dashboard", icon: <Home size={16} />, path: "/admin/dashboard" },
    { name: "Clients", icon: <Users size={16} />, path: "/admin/clients" },
    { name: "Projects", icon: <FolderPlus size={16} />, path: "/admin/project" },
    { name: "Settings", icon: <Settings size={16} />, path: "/admin/settings" },
  ];

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-white to-slate-50 text-slate-600 flex flex-col shadow-2xl border-r border-slate-200 font-sans">
      
      {/* 1. BRAND HEADER */}
      <div className="h-24 flex items-center px-8 border-b border-slate-200 bg-gradient-to-r from-white to-blue-50">
        <div className="flex items-center gap-3 w-full">
          <div className="text-blue-600 flex-shrink-0">
            <img src={logo} alt="Integritat" className="h-12 w-12 drop-shadow-lg"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Integritat</h1>
            <p className="text-xs text-slate-500 font-medium">Audit Management</p>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION MENU */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">
          Navigation
        </p>
        
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 group font-medium text-sm ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 translate-x-1" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1"
              }`
            }
          >
            {/* Icon */}
            <span className="flex-shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
            </span>
            <span className="flex-1">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* 3. FOOTER / LOGOUT */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button className="flex items-center gap-3 w-full px-5 py-3 text-slate-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 rounded-lg transition-all duration-300 group font-medium">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
            <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;