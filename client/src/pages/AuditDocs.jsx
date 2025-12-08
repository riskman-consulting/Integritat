import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, CheckCircle2, X, 
  Search, ChevronRight, ChevronDown, 
  Trash2, File, FolderOpen, MoreVertical,
  PieChart
} from 'lucide-react';

// --- DATA: CLEAN SLATE (No pre-uploaded files) ---
const AUDIT_REQUIREMENTS = [
  {
    id: "10-series",
    title: "10-Series: Partner Checklists",
    color: "blue",
    items: [
      { id: "10-1", code: "10-1", task: "Engagement Acceptance and Continuance" },
      { id: "10-2", code: "10-2", task: "Supervision, review and final approval" },
      { id: "10-3", code: "10-3", task: "Partner rotation documentation form" },
      { id: "10-4", code: "10-4", task: "Engagement letter" },
      { id: "10-5", code: "10-5", task: "MWRKS Document Completion Date Calculator" },
    ]
  },
  {
    id: "20-series",
    title: "20-Series: Planning Phase",
    color: "indigo",
    items: [
      { id: "20-1", code: "20-1", task: "Understanding the company and identifying risk" },
      { id: "20-2", code: "20-2", task: "Organizational chart" },
      { id: "20-3", code: "20-3", task: "Flowchart of consolidated group" },
      { id: "20-4", code: "20-4", task: "Engagement independence & compliance form" },
      { id: "20-4a", code: "20-4a", task: "Engagement independence letter" },
      { id: "20-4b", code: "20-4b", task: "Engagement independence Sign off Sheet" },
      { id: "20-5", code: "20-5", task: "Understanding Internal Control (Design & Implementation)" },
      { id: "20-6a", code: "20-6a", task: "Risk assessment summary form" },
      { id: "20-7", code: "20-7", task: "Materiality worksheet" },
      { id: "20-8", code: "20-8", task: "Engagement team discussion" },
      { id: "20-9", code: "20-9", task: "Planning Memorandum" },
      { id: "20-10", code: "20-10", task: "Time summary and engagement status report" },
      { id: "20-11", code: "20-11", task: "Confirmation control" },
      { id: "20-12", code: "20-12", task: "Preliminary Analytics (Consolidated)" },
      { id: "20-13", code: "20-13", task: "Tests of transactions and journal entry testing" },
      { id: "20-14", code: "20-14", task: "Press release and board of director's minutes" },
      { id: "20-15", code: "20-15", task: "Communication with governance at planning" },
      { id: "20-16", code: "20-16", task: "Fraud risk inquiry forms" },
      { id: "20-18a", code: "20-18a", task: "General Planning Procedures" },
      { id: "20-18b", code: "20-18b", task: "Other Planning Procedures" },
    ]
  },
  {
    id: "30-series",
    title: "30-Series: Completion & Financials",
    color: "emerald",
    items: [
      { id: "30-1", code: "30-1", task: "Final Analytics (Consolidated Level Only)" },
      { id: "30-2", code: "30-2", task: "Audited financial statements" },
      { id: "30-3", code: "30-3", task: "Disclosure Checklist" },
      { id: "30-4", code: "30-4", task: "Going concern checklist and support" },
      { id: "30-5", code: "30-5", task: "Concentration Checklist" },
      { id: "30-6", code: "30-6", task: "Significant Estimates Checklist" },
      { id: "30-7", code: "30-7", task: "Commitment and contingencies" },
      { id: "30-8", code: "30-8", task: "Related parties Form" },
      { id: "30-9", code: "30-9", task: "Subsequent Events" },
      { id: "30-10", code: "30-10", task: "Audit Adjustment Form" },
      { id: "30-11", code: "30-11", task: "Audit Difference Evaluation Form" },
      { id: "30-12", code: "30-12", task: "Engagement Completion Memo" },
      { id: "30-13", code: "30-13", task: "Client (Management's) Representation Letter" },
      { id: "30-14", code: "30-14", task: "Audit Internal Control Communication Letter" },
      { id: "30-15", code: "30-15", task: "General Auditing and Completion Procedures" },
      { id: "30-16", code: "30-16", task: "Other general Auditing and Completion Procedures" },
      { id: "30-17", code: "30-17", task: "Communication with governance at audit conclusion" },
    ]
  }
];

const AuditDocs = () => {
  // --- STATE ---
  const [uploads, setUploads] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    "10-series": true, "20-series": true, "30-series": true
  });

  // --- HANDLERS ---
  const handleFileSelect = (e, itemId) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploads(prev => ({
        ...prev,
        [itemId]: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          timestamp: new Date().toLocaleDateString()
        }
      }));
    }
  };

  const removeFile = (itemId) => {
    setUploads(prev => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({...prev, [id]: !prev[id]}));
  };

  // --- CALCULATIONS ---
  const filteredSections = useMemo(() => {
    if (!searchTerm) return AUDIT_REQUIREMENTS;
    
    return AUDIT_REQUIREMENTS.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.task.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.items.length > 0);
  }, [searchTerm]);

  const totalDocs = AUDIT_REQUIREMENTS.reduce((acc, section) => acc + section.items.length, 0);
  const uploadedCount = Object.keys(uploads).length;
  const progress = Math.round((uploadedCount / totalDocs) * 100);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* 1. MINIMALIST TOP BAR */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo / Title Area */}
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <FolderOpen className="text-white" size={20} />
             </div>
             <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Audit Documentation</h1>
             </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
             <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase">Completion</p>
                <p className="text-sm font-bold text-gray-900">{uploadedCount} / {totalDocs}</p>
             </div>
             <div className="relative w-10 h-10">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
                   <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={100} strokeDashoffset={100 - progress} className="text-blue-600 transition-all duration-500" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">{progress}%</span>
             </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {filteredSections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
              
              {/* Section Header */}
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors`}>
                    {expandedSections[section.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <h2 className="text-base font-bold text-gray-800">{section.title}</h2>
                </div>
                <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200 text-xs font-semibold text-gray-500">
                  {section.items.length} Files
                </div>
              </button>

              {/* Items List */}
              {expandedSections[section.id] && (
                <div className="border-t border-gray-100">
                  {section.items.map((item, idx) => {
                    const fileData = uploads[item.id];
                    const isUploaded = !!fileData;

                    return (
                      <div 
                        key={item.id} 
                        className={`flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4 hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0`}
                      >
                        {/* Left: Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <span className="mt-0.5 px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-mono font-bold tracking-tight">
                            {item.code}
                          </span>
                          <div>
                            <p className={`text-sm font-medium ${isUploaded ? 'text-gray-900' : 'text-gray-700'}`}>
                              {item.task}
                            </p>
                            {isUploaded && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Uploaded
                                    </span>
                                    <span className="text-[10px] text-gray-400">• {fileData.timestamp}</span>
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto pl-12 sm:pl-0">
                          {isUploaded ? (
                            <div className="flex items-center gap-3 w-full sm:w-auto bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                               <div className="flex items-center gap-3 flex-1">
                                  <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                                     <FileText size={16} />
                                  </div>
                                  <div className="flex flex-col min-w-[100px] max-w-[140px]">
                                     <span className="text-xs font-medium text-gray-700 truncate">{fileData.name}</span>
                                     <span className="text-[10px] text-gray-400">{fileData.size}</span>
                                  </div>
                               </div>
                               <div className="h-6 w-px bg-gray-200"></div>
                               <button 
                                  onClick={() => removeFile(item.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                  title="Delete file"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer group relative flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 transition-all w-full sm:w-auto justify-center">
                              <Upload size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                              <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Upload</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleFileSelect(e, item.id)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-center">
               <div className="p-4 bg-gray-50 rounded-full mb-3">
                  <Search className="text-gray-400" size={24} />
               </div>
               <h3 className="text-gray-900 font-medium">No documents found</h3>
               <p className="text-gray-500 text-sm mt-1">Try searching for a different task name or code.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuditDocs;