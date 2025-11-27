import { useState } from "react";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Section ---------------------- */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" className="p-2 border rounded" />
          <input type="email" placeholder="Email Address" className="p-2 border rounded" />
          <input type="text" placeholder="Phone Number" className="p-2 border rounded" />
          <input type="password" placeholder="Change Password" className="p-2 border rounded" />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </div>

      {/* Appearance Section ---------------------- */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>

        <div className="flex gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded ${
              theme === "light" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Light Mode
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded ${
              theme === "dark" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Dark Mode
          </button>
        </div>
      </div>

      {/* Notifications Section ---------------------- */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>

        <div className="flex items-center justify-between mb-3">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={() => setEmailNotif(!emailNotif)}
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <span>SMS Notifications</span>
          <input
            type="checkbox"
            checked={smsNotif}
            onChange={() => setSmsNotif(!smsNotif)}
          />
        </div>
      </div>

      {/* Save Button */}
      <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
