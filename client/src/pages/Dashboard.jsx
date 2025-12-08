import { useState, useEffect } from "react";
import { Users, FileText, Clock, CheckCircle, AlertCircle, Search, Filter, Plus, X, Trash2 } from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import { dashboardAPI, projectAPI, authAPI } from "../utils/api";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  // Data states
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teamWorkload, setTeamWorkload] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);

  // Team member form
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "junior_auditor",
    department: "Audit"
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, projectsRes, teamRes, tasksRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getActivity(),
        dashboardAPI.getTeamWorkload(),
        dashboardAPI.getPendingTasks()
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (teamRes.success) setTeamWorkload(teamRes.data);
      if (tasksRes.success) setPendingTasks(tasksRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.register(newMember);
      if (response.success) {
        setShowAddTeamMember(false);
        setNewMember({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "junior_auditor",
          department: "Audit"
        });
        fetchDashboardData();
        alert("Team member added successfully!");
      } else {
        alert(response.message || "Failed to add team member");
      }
    } catch (err) {
      alert("Error adding team member");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await projectAPI.delete(projectId);
      if (response.success) {
        fetchDashboardData();
        alert("Project deleted successfully!");
      }
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter(
    (item) =>
      (item.client_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.project_code?.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === "All" || item.status === filterStatus)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, here is your audit management summary.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          value={summary?.totalProjects || "0"}
          icon={<Users size={24} />}
          className="bg-blue-100 text-blue-600"
        />
        <DashboardCard
          title="Pending Actions"
          value={summary?.pendingChecklists || "0"}
          icon={<FileText size={24} />}
          className="bg-orange-100 text-orange-600"
        />
        <DashboardCard
          title="Completed"
          value={summary?.projectsByStatus?.Completed || "0"}
          icon={<CheckCircle size={24} />}
          className="bg-emerald-100 text-emerald-600"
        />
        <DashboardCard
          title="In Progress"
          value={summary?.projectsByStatus?.["In Progress"] || "0"}
          icon={<AlertCircle size={24} />}
          className="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Alert Banner */}
      {pendingTasks.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg flex items-start gap-4">
          <div className="p-2 bg-orange-100 rounded-full text-orange-600 mt-1">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-orange-800">
              Action Required: {pendingTasks.length} Tasks Pending
            </h3>
            <p className="text-sm text-orange-600 mt-1">
              You have {pendingTasks.length} pending tasks that require your attention.
            </p>
          </div>
        </div>
      )}

      {/* Project Activity */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-lg text-slate-800">Project Activity</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search project..."
                className="w-full sm:w-48 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border bg-slate-50 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs font-semibold sticky top-0">
              <tr>
                <th className="px-6 py-3">Project Code</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Team Lead</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.project_code} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-slate-800">{project.project_code}</td>
                    <td className="px-6 py-4 text-slate-600">{project.client_name}</td>
                    <td className="px-6 py-4 text-slate-600">{project.team_lead || "Unassigned"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'Planning' ? 'bg-amber-100 text-amber-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${project.total_checklists > 0
                                ? (project.completed_checklists / project.total_checklists) * 100
                                : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">
                          {project.completed_checklists || 0}/{project.total_checklists || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Pending Tasks & Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">My Pending Tasks</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
              {pendingTasks.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {pendingTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No pending tasks</div>
            ) : (
              pendingTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50 transition">
                  <p className="text-sm font-medium text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{task.project_code}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Team Workload</h2>
            <button
              onClick={() => setShowAddTeamMember(true)}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Plus size={14} />
              Add Member
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {teamWorkload.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No team members</div>
            ) : (
              teamWorkload.map((member) => (
                <div key={member.user_id} className="p-4 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-xs text-slate-500">{member.role?.replace(/_/g, ' ')}</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{member.active_projects || 0} projects</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddTeamMember && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add Team Member</h2>
              <button onClick={() => setShowAddTeamMember(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTeamMember} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <input type="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newMember.password} onChange={(e) => setNewMember({ ...newMember, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
                  <option value="junior_auditor">Junior Auditor</option>
                  <option value="senior_auditor">Senior Auditor</option>
                  <option value="manager">Manager</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddTeamMember(false)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
