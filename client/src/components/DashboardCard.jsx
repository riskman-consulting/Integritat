const DashboardCard = ({ title, value, icon, className }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-300">
      
      {/* Left: Data */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </span>
        <span className="text-3xl font-bold text-slate-800 mt-2">
          {value}
        </span>
      </div>

      {/* Right: Icon with dynamic styling */}
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl ${className}`}>
        {icon}
      </div>
      
    </div>
  );
};

export default DashboardCard;