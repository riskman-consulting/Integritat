const DashboardCard = ({ title, value, icon, className }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl border border-slate-200 p-8 flex flex-col hover:shadow-xl transition-all duration-300 h-full">
        
        {/* Top: Icon with dynamic styling */}
        <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-2xl mb-4 ${className} shadow-lg`}>
          {icon}
        </div>
        
        {/* Bottom: Data */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            {title}
          </span>
          <span className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;