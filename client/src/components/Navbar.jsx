import { FiBell, FiMenu, FiChevronDown, FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
      
      {/* LEFT: Mobile Menu + Search Bar */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        
        {/* Mobile Menu Trigger */}
        <button className="md:hidden text-slate-500 hover:text-slate-700">
          <FiMenu size={24} />
        </button>

        {/* Search Bar */}
        <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm text-slate-700 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
        </div>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-slate-600 transition">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="hidden md:block h-8 w-px bg-slate-200"></div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 cursor-pointer group">
          
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
            AD
          </div>
          
          {/* Name & Role */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition">Admin User</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Super Admin</span>
          </div>

          <FiChevronDown className="text-slate-400 group-hover:text-slate-600 transition hidden md:block" />
        </div>

      </div>
    </div>
  );
};

export default Navbar;