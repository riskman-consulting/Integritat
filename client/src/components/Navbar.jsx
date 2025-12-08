import { FiBell, FiMenu, FiChevronDown, FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
      
      {/* LEFT: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-6 flex-1">
        
        {/* Mobile Menu Trigger */}
        <button className="md:hidden text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-all">
          <FiMenu size={20} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:block relative flex-1 max-w-xs">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search projects, clients..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all placeholder:text-slate-500"
            />
        </div>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-slate-600 transition p-2 hover:bg-slate-100 rounded-lg">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white shadow-lg"></span>
        </button>

        {/* Vertical Divider */}
        <div className="hidden md:block h-6 w-px bg-slate-200"></div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 cursor-pointer group">
          
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-blue-200 group-hover:ring-blue-300 transition-all">
            AD
          </div>
          
          {/* Name & Role */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition">Admin</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Administrator</span>
          </div>

          <FiChevronDown className="text-slate-400 group-hover:text-slate-600 transition hidden md:block" />
        </div>

      </div>
    </div>
  );
};

export default Navbar;