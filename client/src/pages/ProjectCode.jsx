import { useState, useEffect } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useToast } from "../components/Toast";
import { projectAPI, clientAPI, dashboardAPI } from "../utils/api";

const ProjectCode = () => {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    projectType: "",
    period: "",
    completionDate: "",
    projectValue: "",
    teamLead: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, clientsRes, teamRes] = await Promise.all([
        projectAPI.getAll(),
        clientAPI.getAll(),
        dashboardAPI.getTeamWorkload()
      ]);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (clientsRes.success) setClients(clientsRes.data);
      if (teamRes.success) setTeamMembers(teamRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const generateProjectCode = (clientCode, projectType) => {
    const typeCode = projectType === 'Statutory Audit' ? 'SA' :
      projectType === 'Tax Audit' ? 'TA' :
        projectType === 'Internal Audit' ? 'IA' : 'OT';
    const year = new Date().getFullYear().toString().slice(-2);
    const count = projects.filter(p => p.project_type === projectType).length + 1;
    return `${clientCode}-${typeCode}-${year}-${String(count).padStart(3, '0')}`;
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const selectedClient = clients.find(c => c.id === parseInt(formData.clientId));
      const projectCode = generateProjectCode(selectedClient.client_code, formData.projectType);

      const response = await projectAPI.create({
        projectCode,
        clientId: parseInt(formData.clientId),
        projectType: formData.projectType,
        period: formData.period,
        completionDate: formData.completionDate,
        projectValue: parseFloat(formData.projectValue) || 0,
        teamLeadId: formData.teamLead ? parseInt(formData.teamLead) : null
      });

      if (response.success) {
        setIsModalOpen(false);
        setFormData({
          clientId: "",
          projectType: "",
          period: "",
          completionDate: "",
          projectValue: "",
          teamLead: ""
        });
        fetchData();
        toast.success("Project created successfully!");
      }
    } catch (error) {
      console.error("Project creation error:", error);
      toast.error("Failed to create project: " + (error.message || "Unknown error"));
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await projectAPI.delete(projectId);
      if (response.success) {
        fetchData();
        toast.success("Project deleted successfully!");
      }
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const response = await projectAPI.updateStatus(projectId, newStatus);
      if (response.success) {
        fetchData();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = projects.filter(p =>
    p.project_code?.toLowerCase().includes(search.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(search.toLowerCase())
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your audit projects.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-semibold"
        >
          <Plus size={16} />
          Create New Project
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Project Code or Client..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200">
            <tr>
              <th className="p-4">Project Code</th>
              <th className="p-4">Client</th>
              <th className="p-4">Type</th>
              <th className="p-4">Period</th>
              <th className="p-4">Team Lead</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">No projects found</td>
              </tr>
            ) : (
              filtered.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="p-4 font-mono text-xs font-bold text-blue-600">{project.project_code}</td>
                  <td className="p-4 font-semibold text-slate-800">{project.client_name}</td>
                  <td className="p-4 text-slate-600">{project.project_type}</td>
                  <td className="p-4 text-slate-600">{project.period}</td>
                  <td className="p-4 text-slate-600">{project.team_lead || "Unassigned"}</td>
                  <td className="p-4">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project.id, e.target.value)}
                      className={`text-xs font-semibold border rounded-lg px-2 py-1 ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          project.status === 'Planning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-purple-100 text-purple-700 border-purple-200'
                        }`}
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center">
                      <button onClick={() => handleDeleteProject(project.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
                  <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}>
                    <option value="">Select Client</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.legal_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Type *</label>
                  <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}>
                    <option value="">Select Type</option>
                    <option>Statutory Audit</option>
                    <option>Tax Audit</option>
                    <option>Internal Audit</option>
                    <option>GST Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Period *</label>
                  <input type="text" required placeholder="FY 2023-24" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date *</label>
                  <input type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.completionDate} onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Value</label>
                  <input type="number" placeholder="100000" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.projectValue} onChange={(e) => setFormData({ ...formData, projectValue: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team Lead</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.teamLead} onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}>
                    <option value="">Select Team Lead</option>
                    {teamMembers.map(m => (
                      <option key={m.user_id} value={`${m.first_name} ${m.last_name}`}>{m.first_name} {m.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCode;