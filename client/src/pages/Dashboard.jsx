import { useState } from "react";
import {
  FiUsers,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Dummy recent clients data
  const clientsData = [
    { company: "ZenTax Advisors", lead: "Rahul Sen", status: "In Progress", due: "10 Jan" },
    { company: "BrightFinance LLP", lead: "Mira Desai", status: "Pending Docs", due: "12 Jan" },
    { company: "LedgerWorks", lead: "Kunal Roy", status: "Completed", due: "-" },
    { company: "AuditPro India", lead: "Aisha Sharma", status: "Under Review", due: "08 Jan" },
    { company: "AuditMax LLP", lead: "Rohan Mehta", status: "In Progress", due: "15 Jan" },
    { company: "FinServe Ltd", lead: "Sana Kapoor", status: "Completed", due: "05 Jan" },
    { company: "TaxSecure", lead: "Vikram Rao", status: "Pending Docs", due: "20 Jan" },
  ];

  // Dummy team lead project overview
  const teamLeadData = [
    { lead: "Rahul Sen", projects: 3 },
    { lead: "Mira Desai", projects: 1 },
    { lead: "Kunal Roy", projects: 0 },
    { lead: "Aisha Sharma", projects: 2 },
    { lead: "Rohan Mehta", projects: 0 },
    { lead: "Sana Kapoor", projects: 2 },
    { lead: "Vikram Rao", projects: 1 },
  ];

  // Filtered clients based on search and status
  const filteredClients = clientsData.filter(
    (client) =>
      client.company.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "All" || client.status === filterStatus)
  );

  return (
    <div className="space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Clients" value="42" icon={<FiUsers size={26} />} color="bg-blue-600" />
        <Card title="Pending Audits" value="9" icon={<FiFileText size={26} />} color="bg-orange-500" />
        <Card title="Completed Audits" value="33" icon={<FiCheckCircle size={26} />} color="bg-green-600" />
        <Card title="Deadlines Today" value="4" icon={<FiAlertCircle size={26} />} color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <div className="bg-white shadow rounded-xl p-5 col-span-2">
          <h2 className="font-semibold text-lg mb-4">Recent Clients</h2>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Search company..."
              className="border p-2 rounded w-full sm:w-1/2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border p-2 rounded w-full sm:w-1/4"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Docs">Pending Docs</option>
              <option value="Completed">Completed</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Scrollable Table */}
          <div className="overflow-auto max-h-96 border rounded">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr className="border-b text-gray-600 font-medium">
                  <th className="py-2 text-left px-3">Company</th>
                  <th className="py-2 text-left px-3">Team Lead / Project Lead</th>
                  <th className="py-2 text-left px-3">Status</th>
                  <th className="py-2 text-right px-3">Next Deadline</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="py-2 px-3">{client.company}</td>
                    <td className="px-3">{client.lead}</td>
                    <td className="px-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        client.status === "Completed" ? "bg-green-200 text-green-800" :
                        client.status === "In Progress" ? "bg-blue-200 text-blue-800" :
                        client.status === "Pending Docs" ? "bg-orange-200 text-orange-800" :
                        client.status === "Under Review" ? "bg-purple-200 text-purple-800" :
                        "bg-gray-200 text-gray-700"
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="text-right px-3">{client.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Lead Project Overview */}
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="font-semibold text-lg mb-4">Team Lead Project Overview</h2>

          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr className="border-b text-gray-600 font-medium">
                  <th className="py-2 text-left px-3">Team Lead</th>
                  <th className="py-2 text-left px-3">Active Projects</th>
                  <th className="py-2 text-left px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {teamLeadData.map((lead, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="py-2 px-3">{lead.lead}</td>
                    <td className="px-3">{lead.projects}</td>
                    <td className="px-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        lead.projects === 0 ? "bg-red-200 text-red-800" :
                        "bg-green-200 text-green-800"
                      }`}>
                        {lead.projects === 0 ? "Idle" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deadline Alert Section */}
      <div className="bg-red-50 border border-red-300 p-5 rounded-xl flex items-center gap-4">
        <FiClock size={30} className="text-red-600" />
        <div>
          <p className="font-bold text-red-700">⚠ 4 Audits require attention today</p>
          <p className="text-sm text-red-600">Complete filing before 6 PM to avoid penalties.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/* Small UI Components */

const Card = ({ title, value, icon, color }) => (
  <div className={`${color} text-white rounded-xl p-5 shadow flex items-center justify-between`}>
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div>{icon}</div>
  </div>
);
