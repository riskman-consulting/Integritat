import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Globe 
} from "lucide-react";

const AddClient = () => {
  const [form, setForm] = useState({
    // 1. Identification
    legalName: "",
    entityType: "",
    
    // 3. Billing Address
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",    // NEW
    zipCode: "",    // NEW

    // 4 & 5. Business Details
    incDate: "",
    businessNature: "",

    // 6. Key Contact
    contactName: "",
    contactPhone: "",
    contactEmail: "",

    // 7. Regulatory
    taxId: "", 
    registrationDocs: "", 
    licenses: "", 
    priorAuditor: "", 

    // Attachments
    files: {}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm({
        ...form,
        files: { ...form.files, [name]: files[0].name }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client Data Submitted:", form);
    alert("Client Added Successfully");
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">New Client Onboarding</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details below to register a new client entity.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
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
                <option value="LLP">Limited Liability Partnership</option>
                <option value="Sole">Sole Proprietorship</option>
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

            {/* Country & Zip Code (NEW) */}
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
              <InputLabel label="Prior Auditor Communication" required />
              <textarea
                name="priorAuditor"
                className="form-input"
                rows="3"
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
            <FileUpload label="Cert. of Incorporation" name="certIncorporation" onChange={handleFileChange} filename={form.files.certIncorporation} />
            <FileUpload label="Tax IDs *" name="taxIds" onChange={handleFileChange} required filename={form.files.taxIds} />
            <FileUpload label="Bank Details *" name="bankDetails" onChange={handleFileChange} required filename={form.files.bankDetails} />
            <FileUpload label="AML/KYC Forms" name="amlKyc" onChange={handleFileChange} filename={form.files.amlKyc} />
            <FileUpload label="Prior Audit Reports" name="priorAuditReports" onChange={handleFileChange} filename={form.files.priorAuditReports} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95">
              Submit Registration
            </button>
        </div>

      </form>
      
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

/* --- UI COMPONENTS --- */

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

export default AddClient;