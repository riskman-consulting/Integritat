import { useState } from "react";

const Clients = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const teamLeads = ["Rohan Mehta", "Sneha Kapoor", "Arjun Patel", "Kavya Nair", "Vikas Rao"];

  const [data, setData] = useState([
    { name: "ABC Corp Pvt Ltd", lead: "Rohan Mehta", email: "abc@corp.com", audits: 3, status: "Active" },
    { name: "XYZ Business Solutions", lead: "Sneha Kapoor", email: "xyz@corp.com", audits: 5, status: "Pending" },
    { name: "Delta Finance Group", lead: "Arjun Patel", email: "delta@corp.com", audits: 2, status: "Inactive" },
    { name: "Nova Retail International", lead: "Kavya Nair", email: "nova@corp.com", audits: 6, status: "Active" },
  ]);

  const [form, setForm] = useState({
    name: "",
    lead: "",
    email: "",
  });

  const addClient = (e) => {
    e.preventDefault();
    setData([...data, { ...form, audits: 0, status: "Pending" }]);
    setForm({ name: "", lead: "", email: "" });
    setOpen(false);
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...data];
    updated[index].status = newStatus;
    setData(updated);
  };

  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lead.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => {
    if (status === "Active") return "bg-green-200 text-green-700";
    if (status === "Pending") return "bg-yellow-200 text-yellow-700";
    return "bg-red-200 text-red-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>

      {/* Search + Add */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search client or team lead..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Client
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Company Name</th>
              <th className="p-3 text-left">Team Lead</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Audits</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.lead}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.audits}</td>

                {/* Dynamic status color */}
                <td className="p-3">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(index, e.target.value)}
                    className={`px-2 py-1 rounded text-sm border ${statusColor(c.status)}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-bold mb-3">Add New Client</h2>

            <form onSubmit={addClient}>
              <input
                type="text"
                placeholder="Company Name"
                className="border p-2 rounded w-full mb-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <select
                className="border p-2 rounded w-full mb-3"
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
                required
              >
                <option value="">Assign Team Lead</option>
                {teamLeads.map((lead, i) => (
                  <option key={i} value={lead}>{lead}</option>
                ))}
              </select>

              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded w-full mb-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 bg-gray-300 rounded">
                  Cancel
                </button>

                <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
