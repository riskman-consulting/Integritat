const DashboardCard = ({ title, value, icon, className }) => {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6 h-full">

      {/* Background Pulse Effect */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:scale-150 transition-transform duration-500" />

      {/* Icon with Animation */}
      <div className={`relative z-10 h-12 w-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${className}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <span className="text-sm font-medium text-slate-600 mb-1">
          {title}
        </span>
        <span className="text-3xl font-bold text-slate-900 font-mono">
          {value}
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;