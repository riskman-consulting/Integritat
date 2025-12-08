import { useState } from "react";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  MoreVertical,
  CheckSquare,
  Calendar
} from "lucide-react";

import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Updated Data: Project Activity
  const projectData = [
    {
      project: "Statutory Audit FY 23-24",
      company: "ZenTax Advisors",
      lead: "Rahul Sen",
      status: "In Progress",
      due: "10 Jan",
    },
    {
      project: "GST Filing Q3",
      company: "BrightFinance LLP",
      lead: "Mira Desai",
      status: "Pending Docs",
      due: "12 Jan",
    },
    {
      project: "Internal Financial Controls",
      company: "LedgerWorks",
      lead: "Kunal Roy",
      status: "Completed",
      due: "-",
    },
    {
      project: "Tax Audit",
      company: "AuditPro India",
      lead: "Aisha Sharma",
      status: "Under Review",
      due: "08 Jan",
    },
    {
      project: "Forensic Audit",
      company: "AuditMax LLP",
      lead: "Rohan Mehta",
      status: "In Progress",
      due: "15 Jan",
    },
    {
      project: "Stock Audit",
      company: "FinServe Ltd",
      lead: "Sana Kapoor",
      status: "Completed",
      due: "05 Jan",
    },
  ];

  const teamLeadData = [
    { lead: "Rahul Sen", projects: 3 },
    { lead: "Mira Desai", projects: 1 },
    { lead: "Kunal Roy", projects: 0 },
    { lead: "Aisha Sharma", projects: 2 },
    { lead: "Rohan Mehta", projects: 0 },
  ];

  // New Data: My Pending Tasks
  const myTasks = [
    { id: 1, title: "Review ZenTax Draft Report", due: "Today", priority: "High" },
    { id: 2, title: "Approve Timesheets for Wk 42", due: "Tomorrow", priority: "Medium" },
    { id: 3, title: "Client Meeting: AuditPro", due: "14 Jan", priority: "Medium" },
    { id: 4, title: "Update Internal Compliance Docs", due: "Next Week", priority: "Low" },
  ];

  const filteredProjects = projectData.filter(
    (item) =>
      (item.company.toLowerCase().includes(search.toLowerCase()) || 
       item.project.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === "All" || item.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 space-y-8 font-sans text-slate-800 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Welcome back, here is your audit management summary.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
          <Calendar size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</span>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value="42"
          icon={<Users size={24} />}
          className="bg-blue-50 text-blue-600"
        />

        <DashboardCard
          title="Pending Actions"
          value="9"
          icon={<FileText size={24} />}
          className="bg-orange-50 text-orange-600"
        />

        <DashboardCard
          title="Completed"
          value="33"
          icon={<CheckCircle size={24} />}
          className="bg-emerald-50 text-emerald-600"
        />

        <DashboardCard
          title="Critical Due"
          value="4"
          icon={<AlertCircle size={24} />}
          className="bg-red-50 text-red-600"
        />
      </div>

      {/* Alert Banner */}
      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-rose-100 rounded-full text-rose-600 mt-1">
          <Clock size={20} />
        </div>
        <div>
          <h3 className="font-bold text-rose-800">
            Action Required: 4 Deadlines Approaching
          </h3>
          <p className="text-sm text-rose-600 mt-1">
            Filings for AuditPro India and 3 others must be completed by 6 PM to
            avoid regulatory penalties.
          </p>
        </div>
        <button className="ml-auto text-sm font-semibold text-rose-700 hover:text-rose-900 underline">
          View Details
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
        {/* Left Column (2/3 width): Project Activity Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-fit">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-bold text-lg text-slate-800">
              Project Activity
            </h2>

            {/* Search & Filter Controls */}
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search project..."
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Docs">Pending Docs</option>
                  <option value="Completed">Completed</option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={12}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs text-center font-semibold">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Deadline</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((item, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.project}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.company}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar seed={item.lead} />
                        <span className="text-slate-600 text-xs">{item.lead}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-3 py-4 text-right font-mono text-slate-500">
                      {item.due}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 mx-auto">
              View All Projects <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width): Sidebar Widgets */}
        <div className="space-y-8 w-full grid grid-cols-2 gap-4">
            
            {/* NEW: My Pending Tasks Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-800">My Pending Tasks</h2>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">{myTasks.length}</span>
                </div>
                <div className="divide-y divide-slate-50">
                    {myTasks.map((task) => (
                        <div key={task.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-3">
                            <div className="mt-1 text-slate-400">
                                <CheckSquare size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800">{task.title}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold
                                        ${task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                                          task.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                          'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        {task.priority}
                                    </span>
                                    <span className="text-xs text-slate-400">{task.due}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-3 text-sm text-slate-500 hover:text-blue-600 border-t border-slate-100 transition">
                    + Add Personal Task
                </button>
            </div>

            {/* Team Lead Stats */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-5 border-b border-slate-100">
                <h2 className="font-bold text-lg text-slate-800">Team Workload</h2>
            </div>
            <div className="p-2">
                <table className="w-full text-sm">
                <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                    <tr>
                    <th className="px-4 py-3 text-left">Member</th>
                    <th className="px-4 py-3 text-center">Active</th>
                    <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {teamLeadData.map((lead, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div
                            className={`w-2 h-2 rounded-full ${
                                lead.projects > 0 ? "bg-green-500" : "bg-slate-300"
                            }`}
                            ></div>
                            <span className="font-medium text-slate-700 text-xs">
                            {lead.lead}
                            </span>
                        </div>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-600">
                        {lead.projects}
                        </td>
                        <td className="px-4 py-3 text-right">
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                            lead.projects === 0
                                ? "bg-slate-100 text-slate-500"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
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
      </div>
    </div>
  );
};

/* --- UI COMPONENTS --- */

const StatusBadge = ({ status }) => {
  let styles = "bg-slate-100 text-slate-600";
  if (status === "Completed")
    styles = "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (status === "In Progress")
    styles = "bg-blue-100 text-blue-700 border border-blue-200";
  if (status === "Pending Docs")
    styles = "bg-amber-100 text-amber-700 border border-amber-200";
  if (status === "Under Review")
    styles = "bg-purple-100 text-purple-700 border border-purple-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
};

// Generates a simple colored circle with initials
const Avatar = ({ seed }) => {
  const initials = seed
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
  return (
    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
      {initials}
    </div>
  );
};

export default Dashboard;