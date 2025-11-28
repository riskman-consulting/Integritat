import { NavLink } from "react-router-dom";
import { Users, FileText, Home, Settings, LogOut, PieChart, Hexagon } from "lucide-react";
import logo from '../assets/integritat-logo.png';


const Sidebar = () => {
  const menu = [
    { name: "Dashboard", icon: <Home size={16} />, path: "/admin/dashboard" },
    { name: "Clients", icon: <Users size={16} />, path: "/admin/clients" },
    { name: "Settings", icon: <Settings size={16} />, path: "/admin/settings" },
  ];

  return (
    <div className="w-72 h-screen bg-white text-slate-600 flex flex-col shadow-xl border-r border-slate-200 font-sans">
      
      {/* 1. BRAND HEADER */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Replaced image with a Lucide Icon for stability */}
          <div className="text-blue-600">
            <img src={logo} alt="" className="h-14 w-14"/>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-wide">Integritat</h1>
        </div>
      </div>

      {/* 2. NAVIGATION MENU */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Main Menu
        </p>
        
        {menu.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-300 group font-medium
              ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm border-r-2 border-blue-600" // Light Mode Active State
                  : "hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1" // Light Mode Hover
              }`
            }
          >
            {/* Icon Wrapper */}
            <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
            </span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* 3. FOOTER / LOGOUT ONLY */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;