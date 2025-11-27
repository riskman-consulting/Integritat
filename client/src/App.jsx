import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Audits from "./pages/Audits";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import DocUpload from "./pages/DocumentUpload"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/upload" element={<DocUpload />}/>
      <Route path="/admin" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="audits" element={<Audits />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
