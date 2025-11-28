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
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Client</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Client Code */}
        <div>
          <label className="font-medium">Client Code * <span className="text-xs text-gray-500 font-normal">(Try C001, C002)</span></label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={form.clientCode}
            onChange={(e) => handleClientCode(e.target.value)}
            required
            placeholder="Enter Code..."
          />
        </div>

        {/* Client Legal Name (Auto-Mapped but Editable) */}
        <div>
          <label className="font-medium">Client Legal Name *</label>
          <input
            type="text"
            className="border p-2 w-full rounded bg-gray-50"
            value={form.clientLegalName}
            // Allow manual edit if mapping fails
            onChange={(e) => setForm({ ...form, clientLegalName: e.target.value })} 
            placeholder="Auto-populated or type manually"
            required
          />
        </div>

        {/* 4. Company Email ID Field */}
        <div>
          <label className="font-medium">Company Mail ID *</label>
          <input
            type="email"
            className="border p-2 w-full rounded"
            value={form.companyEmail}
            onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
            placeholder="contact@company.com"
            required
          />
        </div>

        {/* Project Type */}
        <div>
          <label className="font-medium">Type of Project *</label>
          <select
            className="border p-2 w-full rounded"
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

        {/* Audit Period */}
        <div>
          <label className="font-medium">Period of Audit / Review *</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            required
          />
        </div>

        {/* Completion Date */}
        <div>
          <label className="font-medium">Estimated Date of Completion *</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={form.completionDate}
            onChange={(e) => setForm({ ...form, completionDate: e.target.value })}
            required
          />
        </div>

        {/* Partner-Level Fields */}
        <div className="border p-3 rounded bg-yellow-50">
          <p className="font-semibold mb-2 text-yellow-700">🔐 Partner Level Fields (Restricted)</p>

          <input
            type="number"
            placeholder="Project Value"
            className="border p-2 w-full rounded mb-2"
            value={form.projectValue}
            onChange={(e) => setForm({ ...form, projectValue: e.target.value })}
          />

          <input
            type="number"
            placeholder="Collection Amount"
            className="border p-2 w-full rounded mb-2"
            value={form.collection}
            onChange={(e) => setForm({ ...form, collection: e.target.value })}
          />

          <input
            type="number"
            placeholder="Estimated Collection Eventually (B9-B10)"
            className="border p-2 w-full rounded"
            value={form.estCollection}
            onChange={(e) => setForm({ ...form, estCollection: e.target.value })}
          />
        </div>

        {/* Team Assignments */}
        <div>
          <label className="font-medium">Team Lead Assigned *</label>
          <select
            className="border p-2 w-full rounded"
            value={form.teamLead}
            onChange={(e) => setForm({ ...form, teamLead: e.target.value })}
            required
          >
            {/* 1. Fix: Dropdown label hidden from options */}
            <option value="" disabled hidden>Select Team Lead</option>
            {teamList.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>

          <input
            type="number"
            placeholder="% Work by Team Lead"
            className="border p-2 w-full rounded mt-2"
            value={form.leadWorkPercent}
            onChange={(e) => setForm({ ...form, leadWorkPercent: e.target.value })}
          />
        </div>

        {/* Team Member */}
        <div>
          <label className="font-medium">Team Member Assigned</label>
          <select
            className="border p-2 w-full rounded"
            value={form.teamMember}
            onChange={(e) => setForm({ ...form, teamMember: e.target.value })}
          >
            {/* 1. Fix: Dropdown label hidden from options */}
            <option value="" disabled hidden>Select Team Member</option>
            {teamList.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>

          <input
            type="number"
            placeholder="% Work by Team Member"
            className="border p-2 w-full rounded mt-2"
            value={form.memberWorkPercent}
            onChange={(e) => setForm({ ...form, memberWorkPercent: e.target.value })}
          />
        </div>

        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-800 transition">
          Submit & Add Client
        </button>

      </form>
    </div>
  );
};

export default ProjectCode;