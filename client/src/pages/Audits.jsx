import { useState } from "react";

const Audits = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const data = [
    { audit: "Document-1 Compliance Audit", client: "ABC Pvt Ltd", deadline: "2025-12-12", priority: "High", status: "In Progress" },
    { audit: "XYZ Data Risk Review", client: "XYZ Global Corp", deadline: "2025-12-18", priority: "Medium", status: "Pending" },
    { audit: "Annual Financial Report Audit", client: "Delta Holdings", deadline: "2025-12-05", priority: "High", status: "Completed" },
    { audit: "Internal Process & Safety Audit", client: "Nova Enterprises", deadline: "2025-12-21", priority: "Low", status: "Pending" },
    { audit: "Document-2 Quality Assurance Audit", client: "Prime Systems", deadline: "2025-12-14", priority: "Medium", status: "In Progress" },
  ];

  const filtered = data.filter(audit =>
    (audit.audit.toLowerCase().includes(search.toLowerCase()) ||
     audit.client.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === "All" || audit.status === filterStatus)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Files</h1>

      {/* Filters/Search */}
      <div className="flex justify-between mb-4">
        
        <div className="flex gap-3">
          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <input
            type="text"
            placeholder="Search Audit or Client..."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Audit
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Audit Name</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-3">{a.audit}</td>
                <td className="p-3">{a.client}</td>
                <td className="p-3">{a.deadline}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm 
                    ${a.priority === "High" ? "bg-red-200 text-red-700" :
                    a.priority === "Medium" ? "bg-yellow-200 text-yellow-700" :
                    "bg-green-200 text-green-700"}`}>
                    {a.priority}
                  </span>
                </td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm 
                    ${a.status === "Completed" ? "bg-green-200 text-green-800" :
                    a.status === "In Progress" ? "bg-blue-200 text-blue-800" :
                    "bg-orange-200 text-orange-700"}`}>
                    {a.status}
                  </span>
                </td>

                <td className="p-3">
                  <button className="text-blue-600 hover:underline mr-3">View</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Audits;
