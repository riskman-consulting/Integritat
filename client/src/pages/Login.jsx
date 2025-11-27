import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const nav = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "admin@xyz.com" && password === "1234") {
      setError("");
      nav("/admin/dashboard"); // redirect to dashboard
    } else {
      setError("Invalid Credentials! Try again.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-xl shadow-xl w-96 text-center text-white">

        <h1 className="text-3xl font-bold mb-2">RiskMan Portal</h1>
        <p className="opacity-80 mb-6 text-sm">CPA Firm Control | Audit Tracking</p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-white/70" size={18}/>
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full bg-white/20 border border-white/30 pl-10 p-3 rounded outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-white/70" size={18}/>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full bg-white/20 border border-white/30 pl-10 p-3 rounded outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-sm"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-lg font-semibold">
            Login
          </button>
        </form>

        <p className="text-xs opacity-60 mt-6">© 2025 RiskMan | Secured Access</p>
      </div>
    </div>
  );
};

export default Login;
