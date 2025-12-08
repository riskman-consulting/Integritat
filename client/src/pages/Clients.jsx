import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, FolderOpen, X } from "lucide-react";
import { clientAPI, projectAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);

  const [formData, setFormData] = useState({
    clientCode: "",
    legalName: "",
    entityType: "",
    city: "",
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      if (response.success) {
        setClients(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  };

  const generateClientCode = () => {
    const maxCode = clients.reduce((max, client) => {
      const num = parseInt(client.client_code?.split('-')[1] || '0');
      return num > max ? num : max;
    }, 1000);
    return `CL-${maxCode + 1}`;
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const clientCode = generateClientCode();
      const response = await clientAPI.create({ ...formData, clientCode });
      if (response.success) {
        setIsAddModalOpen(false);
        setFormData({
          clientCode: "",
          legalName: "",
          entityType: "",
          city: "",
          contactName: "",
          contactEmail: "",
          contactPhone: ""
        });
        fetchClients();
        alert("Client added successfully!");
      }
    } catch (err) {
      alert("Failed to add client");
    }
  };

  const handleEditClient = async (e) => {
    e.preventDefault();
    try {
      const response = await clientAPI.update(selectedClient.id, {
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      });
      if (response.success) {
        setIsEditModalOpen(false);
        fetchClients();
        alert("Client updated successfully!");
      }
    } catch (err) {
      alert("Failed to update client");
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const response = await clientAPI.delete(clientId);
      if (response.success) {
        fetchClients();
        alert("Client deleted successfully!");
      }
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      const response = await clientAPI.update(clientId, { status: newStatus });
      if (response.success) {
        fetchClients();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleViewProjects = async (client) => {
    setSelectedClient(client);
    try {
      const response = await projectAPI.getAll();
      if (response.success) {
        const filtered = response.data.filter(p => p.client_id === client.id);
        setClientProjects(filtered);
        setIsProjectModalOpen(true);
      }
    } catch (err) {
      alert("Failed to fetch projects");
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      contactName: client.contact_name || "",
      contactEmail: client.contact_email || "",
      contactPhone: client.contact_phone || ""
    });
    setIsEditModalOpen(true);
  };

  const filtered = clients.filter(c =>
    c.client_code?.toLowerCase().includes(search.toLowerCase()) ||
    c.legal_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_name?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all your clients and their information.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-semibold"
        >
          <Plus size={16} />
          Add New Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID, Name, or Contact..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200">
            <tr>
              <th className="p-4">Client ID</th>
              <th className="p-4">Legal Name</th>
              <th className="p-4">Entity Type</th>
              <th className="p-4">City</th>
              <th className="p-4">Key Contact</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">No clients found</td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition duration-150">
                  <td className="p-4 font-mono text-xs font-bold text-blue-600">{client.client_code}</td>
                  <td className="p-4 font-semibold text-slate-800">{client.legal_name}</td>
                  <td className="p-4 text-slate-600">{client.entity_type}</td>
                  <td className="p-4 text-slate-600">{client.city || "N/A"}</td>
                  <td className="p-4 text-slate-600">{client.contact_name || "N/A"}</td>
                  <td className="p-4">
                    <select
                      value={client.status}
                      onChange={(e) => handleStatusChange(client.id, e.target.value)}
                      className={`text-xs font-semibold border rounded-lg px-2 py-1 ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          client.status === 'Inactive' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            'bg-amber-100 text-amber-700 border-amber-200'
                        }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On-Hold">On-Hold</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleViewProjects(client)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View Projects">
                        <FolderOpen size={16} />
                      </button>
                      <button onClick={() => openEditModal(client)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteClient(client.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
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

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add New Client</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Legal Name *</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.legalName} onChange={(e) => setFormData({ ...formData, legalName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Entity Type *</label>
                  <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.entityType} onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}>
                    <option value="">Select Type</option>
                    <option>Private Limited</option>
                    <option>Public Limited</option>
                    <option>LLP</option>
                    <option>Partnership</option>
                    <option>Sole Proprietorship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Edit Contact Info</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                <input type="tel" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Projects Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Projects - {selectedClient?.legal_name}</h2>
              <button onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {clientProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">No projects found for this client</p>
                  <button onClick={() => navigate('/admin/project')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Create First Project</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientProjects.map(project => (
                    <div key={project.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-800">{project.project_code}</p>
                          <p className="text-sm text-slate-600">{project.project_type}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>{project.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;