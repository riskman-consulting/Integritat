import { useState } from "react";

const ProjectCode = () => {
  const teamList = ["Aisha Sharma", "Rahul Sen", "Kunal Roy", "Mira Desai", "Vikram Rao"];

  // 3. MAPPING DATA: Simulating a database for Client Code -> Legal Name mapping
  const CLIENT_DATABASE = {
    "C001": "Acme Corp Ltd.",
    "C002": "Globex Infinity S.A.",
    "C003": "Stark Industries",
    "C004": "Wayne Enterprises"
  };

  const [form, setForm] = useState({
    clientCode: "",
    clientLegalName: "",
    companyEmail: "", // 4. Added Email Field
    projectType: "",
    otherProjectType: "",
    period: "",
    completionDate: "",
    projectValue: "",
    collection: "",
    estCollection: "",
    teamLead: "",
    leadWorkPercent: "",
    teamMember: "",
    memberWorkPercent: ""
  });

  // 3. MAPPING LOGIC: Lookup name in DB, otherwise leave blank for manual entry
  const handleClientCode = (value) => {
    const foundName = CLIENT_DATABASE[value] || ""; // Lookup logic

    setForm({
      ...form,
      clientCode: value,
      clientLegalName: foundName // Auto-fill if found, else empty
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Client Data:", form);
    alert("Client Added Successfully ✔"); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-white/60 w-full max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">Create New Project</h1>
          <p className="text-slate-600 text-lg">Fill in the project details below to get started</p>
        </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        
        {/* Section 1: Client Information */}
        <div className="border-b border-slate-200 pb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
            Client Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Code */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Client Code *</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 placeholder:text-slate-400"
                value={form.clientCode}
                onChange={(e) => handleClientCode(e.target.value)}
                required
                placeholder="e.g., C001"
              />
              <p className="text-xs text-slate-500 mt-1">Try C001, C002, C003, C004</p>
            </div>
            
            {/* Client Legal Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Legal Name *</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-blue-50 placeholder:text-slate-400"
                value={form.clientLegalName}
                onChange={(e) => setForm({ ...form, clientLegalName: e.target.value })} 
                placeholder="Auto-populated from code"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Project Details */}
        <div className="border-b border-slate-200 pb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
            Project Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Company Email *</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 placeholder:text-slate-400"
                value={form.companyEmail}
                onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
                placeholder="contact@company.com"
                required
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Project Type *</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 cursor-pointer"
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
            required
          >
            {/* 1. Fix: Added 'disabled' and 'hidden' so label isn't selectable */}
            <option value="" disabled hidden>Select Type</option>
            <option>PCAOB Audit - Public Company</option>
            <option>PCAOB Audit - Non - Public Company</option>
            <option>IFRS Audit</option>
            <option>Quarterly Limited Review</option>
            <option>Others</option>
          </select>

          {/* 2. Fix: "Others" Input on next line */}
          {form.projectType === "Others" && (
            <div className="mt-2">
               <label className="text-sm text-gray-600">Please specify other type:</label>
               <input
                type="text"
                placeholder="Enter Project Type"
                className="border p-2 w-full rounded mt-1"
                value={form.otherProjectType}
                onChange={(e) => setForm({ ...form, otherProjectType: e.target.value })}
                required
              />
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Section 3: Team Assignment */}
        <div className="border-b border-slate-200 pb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</div>
            Team Assignment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Lead */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Team Lead *</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 cursor-pointer"
                value={form.teamLead}
                onChange={(e) => setForm({ ...form, teamLead: e.target.value })}
                required
              >
                <option value="" disabled hidden>Select Team Lead</option>
                {teamList.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Lead Work Percentage */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Work Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 50"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 placeholder:text-slate-400"
                value={form.leadWorkPercent}
                onChange={(e) => setForm({ ...form, leadWorkPercent: e.target.value })}
              />
            </div>

            {/* Team Member */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Team Member</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 cursor-pointer"
                value={form.teamMember}
                onChange={(e) => setForm({ ...form, teamMember: e.target.value })}
              >
                <option value="" disabled hidden>Select Team Member</option>
                {teamList.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Member Work Percentage */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Work Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="e.g., 30"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 placeholder:text-slate-400"
                value={form.memberWorkPercent}
                onChange={(e) => setForm({ ...form, memberWorkPercent: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95 text-lg">
            Create Project & Submit
          </button>
        </div>

      </form>
      </div>
    </div>
  );
};

export default ProjectCode;