import { NavLink } from "react-router-dom";
import { FiUsers, FiFileText, FiHome, FiSettings } from "react-icons/fi";
import logo from '../assets/logo.png'

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { name: "Clients", icon: <FiUsers />, path: "/admin/clients" },
    { name: "Audit Files", icon: <FiFileText />, path: "/admin/audits" },
    { name: "Settings", icon: <FiSettings />, path: "/admin/settings" },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 p-5 text-white">
      <div className="flex justify-center items-center gap-4">
        <img src={logo} alt="" className="h-12 w-12"/>
        <h1 className="text-xl font-bold mb-8 text-center">Integritat</h1>
        </div>

      {menu.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded cursor-pointer mb-2 
             ${isActive ? "bg-blue-600" : "hover:bg-slate-700"}`
          }
        >
          {item.icon}
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
