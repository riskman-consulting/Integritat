const DashboardCard = ({ title, value, color }) => {
  return (
    <div className={`p-6 rounded-xl shadow text-white ${color}`}>
      <p className="text-lg">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
};

export default DashboardCard;
