import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import DocUpload from "./pages/DocumentUpload";
import ProjectCode from "./pages/ProjectCode";
import Audit from "./pages/Audit";
import AuditDocs from "./pages/AuditDocs";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Layout />}>
          <Route path="upload" element={<DocUpload />} />
          <Route path="project" element={<ProjectCode />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="settings" element={<Settings />} />
          <Route path="audit" element={<Audit />} />
          <Route path="auditdoc" element={<AuditDocs />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
