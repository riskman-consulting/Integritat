import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Globe,
  Plus,
  Search,
  Filter,
  X,
  Eye,
  Trash2,
  FolderOpen
} from "lucide-react";

const Clients = () => {
  const [search, setSearch] = useState("");
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // State to track which client is selected for "View Projects"
  const [selectedClient, setSelectedClient] = useState(null);

  // 1. Updated Dummy Data with Client Code and Projects Array
  const [data, setData] = useState([
    {
      clientCode: "CL-1001",
      legalName: "ABC Corp Pvt Ltd",
      entityType: "Public",
      city: "Mumbai",
      contactName: "Rohan Mehta",
      contactEmail: "rohan@abc.com",
      status: "Active",
      projects: [
        { id: "P-01", name: "Statutory Audit FY 23-24", dueDate: "2024-03-31", status: "In Progress" },
        { id: "P-02", name: "GST Filing Q3", dueDate: "2024-01-15", status: "Completed" }
      ]
    },
    {
      clientCode: "CL-1002",
      legalName: "XYZ Business Solutions",
      entityType: "Non-Public",
      city: "Delhi",
      contactName: "Sneha Kapoor",
      contactEmail: "sneha@xyz.com",
      status: "Inactive",
      projects: [] // No active projects
    },
    {
      clientCode: "CL-1003",
      legalName: "Delta Finance Group",
      entityType: "Public",
      city: "Bangalore",
      contactName: "Arjun Patel",
      contactEmail: "arjun@delta.com",
      status: "Active",
      projects: [
        { id: "P-05", name: "Internal Audit H1", dueDate: "2024-02-20", status: "Pending Docs" }
      ]
    },
  ]);

  // 2. Complex Form State
  const initialFormState = {
    legalName: "",
    entityType: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    incDate: "",
    businessNature: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    taxId: "",
    registrationDocs: "",
    licenses: "",
    priorAuditor: "",
    files: {}, 
  };

  const [form, setForm] = useState(initialFormState);

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle File Inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm({
        ...form,
        files: { ...form.files, [name]: files[0].name }
      });
    }
  };

  const addClient = (e) => {
    e.preventDefault();
    
    // Auto-generate a Client Code (Simple logic for demo)
    const newClientCode = `CL-${1000 + data.length + 1}`;

    const newClient = {
      ...form,
      clientCode: newClientCode,
      status: "Active", // Default to Active
      projects: [] // Initialize with empty projects
    };

    setData([...data, newClient]); 
    setForm(initialFormState); 
    setIsAddModalOpen(false); 
    alert(`Client ${newClientCode} Added Successfully`);
  };

  const deleteClient = (clientCode) => {
    if(window.confirm("Are you sure you want to delete this client?")) {
      setData(data.filter(c => c.clientCode !== clientCode));
    }
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...data];
    updated[index].status = newStatus;
    setData(updated);
  };

  const handleViewProjects = (client) => {
    setSelectedClient(client);
    setIsProjectModalOpen(true);
  };

  const filtered = data.filter(
    (c) =>
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.clientCode.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "Active") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-500 border-slate-200"; // Inactive style
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage client entities, status, and associated projects.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-semibold active:scale-95"
          >
            <Plus size={18} />
            Add New Client
          </button>
        </div>

        {/* TOP BAR: Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input
                type="text"
                placeholder="Search by ID, Name or Contact..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-100 transition">
              <Filter size={16} />
              <span>Filter</span>
           </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Client ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">City</th>
                <th className="p-4">Key Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.map((c, index) => (
                <tr key={index} className="hover:bg-slate-50 transition duration-150 group">
                  <td className="p-4 font-mono text-xs font-bold text-blue-600 bg-blue-50/50 w-24">
                    {c.clientCode}
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{c.legalName}</td>
                  <td className="p-4 text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{c.entityType}</span>
                  </td>
                  <td className="p-4 text-slate-600">{c.city}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium">{c.contactName}</span>
                      {c.contactEmail && <span className="text-xs text-slate-400">{c.contactEmail}</span>}
                    </div>
                  </td>

                  {/* Status Dropdown (Active/Inactive only) */}
                  <td className="p-4">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(index, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer outline-none appearance-none ${statusColor(c.status)}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                        {/* View Projects Button */}
                        <button 
                            onClick={() => handleViewProjects(c)}
                            title="View Projects"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                            <Eye size={14} />
                            View Projects
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                            onClick={() => deleteClient(c.clientCode)}
                            title="Delete Client"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                        <FileText size={32} className="text-slate-300" />
                        <p>No clients found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD CLIENT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">New Client Onboarding</h2>
                <p className="text-xs text-slate-500 mt-1">Client ID will be auto-generated upon creation.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-2 bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form className="space-y-8" onSubmit={addClient}>
                
                {/* SECTION 1: Client Identification */}
                <SectionWrapper title="Client Identification" icon={<Building2 size={20} />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <InputLabel label="Legal Name" required />
                      <input
                        type="text"
                        name="legalName"
                        className="form-input"
                        placeholder="e.g. Acme Corporation Ltd."
                        value={form.legalName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputLabel label="Entity Type" required />
                      <select
                        name="entityType"
                        className="form-select"
                        value={form.entityType}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled hidden>Select Entity Type...</option>
                        <option value="Public">Public Company</option>
                        <option value="Non-Public">Non-Public Company</option>
                      </select>
                    </div>
                  </div>
                </SectionWrapper>

                {/* SECTION 2: Billing Address */}
                <SectionWrapper title="Billing Address" icon={<MapPin size={20} />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <InputLabel label="Address Line 1" required />
                      <input
                        type="text"
                        name="addressLine1"
                        className="form-input"
                        value={form.addressLine1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputLabel label="Address Line 2" />
                      <input
                        type="text"
                        name="addressLine2"
                        className="form-input"
                        value={form.addressLine2}
                        onChange={handleChange}
                      />
                    </div>
                    
                    {/* City & State */}
                    <div>
                      <InputLabel label="City" required />
                      <input
                        type="text"
                        name="city"
                        className="form-input"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <InputLabel label="State / Province" required />
                      <input
                        type="text"
                        name="state"
                        className="form-input"
                        value={form.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Country & Zip Code */}
                    <div>
                      <InputLabel label="Country" required />
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                        <input
                            type="text"
                            name="country"
                            className="form-input pl-10"
                            placeholder="e.g. United States"
                            value={form.country}
                            onChange={handleChange}
                            required
                        />
                      </div>
                    </div>
                    <div>
                      <InputLabel label="Zip / Postal Code" required />
                      <input
                        type="text"
                        name="zipCode"
                        className="form-input"
                        placeholder="e.g. 10001"
                        value={form.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </SectionWrapper>

                {/* SECTION 3: Business & Contact */}
                <SectionWrapper title="Business & Contact" icon={<Briefcase size={20} />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel label="Date of Incorporation" />
                      <input
                        type="date"
                        name="incDate"
                        className="form-input"
                        value={form.incDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <InputLabel label="Nature of Business" />
                      <input
                        type="text"
                        name="businessNature"
                        className="form-input"
                        placeholder="e.g. SaaS, Manufacturing"
                        value={form.businessNature}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Contact Card */}
                    <div className="md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                         Key Contact Person
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                           <InputLabel label="Full Name" required />
                           <input type="text" name="contactName" className="form-input bg-white" value={form.contactName} onChange={handleChange} required />
                        </div>
                        <div>
                           <InputLabel label="Phone Number" required />
                           <input type="tel" name="contactPhone" className="form-input bg-white" value={form.contactPhone} onChange={handleChange} required />
                        </div>
                        <div>
                           <InputLabel label="Email Address" required />
                           <input type="email" name="contactEmail" className="form-input bg-white" value={form.contactEmail} onChange={handleChange} required />
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionWrapper>

                {/* SECTION 4: Regulatory */}
                <SectionWrapper title="Regulatory Compliance" icon={<FileText size={20} />}>
                  <div className="space-y-6">
                    <div>
                      <InputLabel label="Tax ID (TIN / EIN / VAT)" required />
                      <input
                        type="text"
                        name="taxId"
                        className="form-input font-mono text-slate-700"
                        value={form.taxId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <InputLabel label="Prior Auditor Communication" required/>
                      <textarea
                        name="priorAuditor"
                        className="form-input"
                        rows="1"
                        placeholder="Details of previous auditor..."
                        value={form.priorAuditor}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </SectionWrapper>

                {/* SECTION 5: Attachments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><UploadCloud size={20} /></span>
                    <h3 className="text-lg font-bold text-slate-800">Documents</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FileUpload label="Engagement Letter" name="engagementLetter" onChange={handleFileChange} filename={form.files.engagementLetter} />
                    <FileUpload label="Certificate of Incorporation" name="certIncorporation" onChange={handleFileChange} filename={form.files.certIncorporation} />
                    <FileUpload label="Tax IDs" name="taxIds" onChange={handleFileChange} required filename={form.files.taxIds} />
                    <FileUpload label="Bank Details" name="bankDetails" onChange={handleFileChange} required filename={form.files.bankDetails} />
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)} 
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={addClient}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Create Client
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* --- VIEW PROJECTS MODAL --- */}
      {isProjectModalOpen && selectedClient && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg">
                        <FolderOpen className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{selectedClient.legalName}</h2>
                        <p className="text-xs text-slate-500 font-mono">ID: {selectedClient.clientCode}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsProjectModalOpen(false)} 
                    className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-0 max-h-[60vh] overflow-y-auto">
                {selectedClient.projects && selectedClient.projects.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-500 uppercase font-semibold text-xs border-b border-slate-100 sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Project ID</th>
                                <th className="px-6 py-4">Project Name</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {selectedClient.projects.map((p, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{p.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                                              p.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                              'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                        <FolderOpen size={48} className="text-slate-200" />
                        <h3 className="text-slate-800 font-semibold">No Projects Found</h3>
                        <p className="text-slate-500 text-sm">This client currently has no active projects.</p>
                        <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                            + Create First Project
                        </button>
                    </div>
                )}
            </div>
            
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
                <button 
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Close
                </button>
            </div>
          </div>
         </div>
      )}

      {/* CSS Injection for custom form classes */}
      <style>{`
        .form-input, .form-select {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 0.875rem;
          transition: all 0.2s;
          outline: none;
        }
        .form-input:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
};

/* --- UI HELPER COMPONENTS --- */

const SectionWrapper = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
      <span className="p-2 bg-slate-100 text-slate-600 rounded-lg">{icon}</span>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);

const InputLabel = ({ label, required }) => (
  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

const FileUpload = ({ label, name, onChange, required, filename }) => (
  <div className="group">
    <InputLabel label={label} required={required} />
    <label className={`
      flex items-center justify-between w-full p-3 rounded-lg border border-dashed cursor-pointer transition-colors
      ${filename ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400'}
    `}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-md ${filename ? 'bg-white text-blue-600' : 'bg-white text-slate-400'}`}>
           {filename ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
        </div>
        <span className={`text-sm truncate ${filename ? 'text-blue-700 font-medium' : 'text-slate-500'}`}>
          {filename || "Choose file..."}
        </span>
      </div>
      <input type="file" name={name} onChange={onChange} className="hidden" required={required} />
    </label>
  </div>
);

export default Clients;