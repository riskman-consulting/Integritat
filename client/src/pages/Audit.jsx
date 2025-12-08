import React, { useState, useMemo, useEffect } from 'react';
import { 
  Check, ChevronDown, ChevronRight, 
  Search, Ban, ShieldCheck, Loader
} from 'lucide-react';
import { checklistAPI } from '../utils/api';

const Audit = () => {
  // --- STATE MANAGEMENT ---
  const [checklists, setChecklists] = useState([]);
  const [signOffs, setSignOffs] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    "10-series": true,
    "20-series": true,
    "30-series": true
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const projectId = new URLSearchParams(window.location.search).get('projectId') || localStorage.getItem('currentProjectId');

  // Fetch checklists from API
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        if (!projectId) {
          setError("No project selected. Please select a project first.");
          setLoading(false);
          return;
        }
        
        const response = await checklistAPI.getByProject(projectId);
        if (response.success) {
          setChecklists(response.data || []);
          // Initialize sign-offs from existing data
          const signOffsMap = {};
          response.data?.forEach(item => {
            if (item.senior_staff_review) signOffsMap[`${item.id}-senior`] = true;
            if (item.eqr_review) signOffsMap[`${item.id}-eqr`] = true;
            if (item.partner_review) signOffsMap[`${item.id}-partner`] = true;
            if (item.not_applicable) signOffsMap[`${item.id}-na`] = true;
          });
          setSignOffs(signOffsMap);
        } else {
          setChecklists([]);
        }
      } catch (err) {
        console.error("Error fetching checklists:", err);
        setError("Failed to load checklists");
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, [projectId]);

  // --- HANDLERS ---
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleSignOff = async (checklistId, column) => {
    const key = `${checklistId}-${column}`;
    const newValue = !signOffs[key];
    
    // Optimistic update
    setSignOffs(prev => ({
      ...prev,
      [key]: newValue
    }));

    // Send to backend
    try {
      const updateData = {
        [column === 'senior' ? 'senior_staff_review' : column === 'eqr' ? 'eqr_review' : column === 'partner' ? 'partner_review' : 'not_applicable']: newValue
      };
      
      await checklistAPI.updateStatus(checklistId, updateData);
    } catch (err) {
      console.error("Error updating checklist:", err);
      // Revert on error
      setSignOffs(prev => ({
        ...prev,
        [key]: !newValue
      }));
    }
  };

  // --- CATEGORIZE CHECKLISTS INTO SECTIONS ---
  const groupedChecklists = useMemo(() => {
    const groups = {
      "10-series": { title: "Partner Checklists (10-Series)", color: "blue", items: [] },
      "20-series": { title: "Planning (20-Series)", color: "indigo", items: [] },
      "30-series": { title: "Financial Statements & Completion (30-Series)", color: "emerald", items: [] }
    };

    checklists.forEach(checklist => {
      const code = checklist.code || checklist.item_code || "";
      const firstPart = code.substring(0, 2);
      
      if (firstPart === "10") groups["10-series"].items.push(checklist);
      else if (firstPart === "20") groups["20-series"].items.push(checklist);
      else if (firstPart === "30") groups["30-series"].items.push(checklist);
    });

    return groups;
  }, [checklists]);

  // --- CALCULATIONS FOR PROGRESS BARS ---
  const calculateProgress = (items) => {
    if (items.length === 0) return 0;
    let totalPossibleChecks = items.length * 3;
    let currentChecks = 0;
    
    items.forEach(item => {
      if (signOffs[`${item.id}-na`]) {
        currentChecks += 3;
      } else {
        if (signOffs[`${item.id}-senior`]) currentChecks++;
        if (signOffs[`${item.id}-eqr`]) currentChecks++;
        if (signOffs[`${item.id}-partner`]) currentChecks++;
      }
    });

    return Math.round((currentChecks / totalPossibleChecks) * 100) || 0;
  };

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    if (!searchQuery) return groupedChecklists;
    
    const filtered = {};
    Object.entries(groupedChecklists).forEach(([key, section]) => {
      filtered[key] = {
        ...section,
        items: section.items.filter(item => 
          (item.task || item.item_name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
          (item.code || item.item_code || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
    });
    return filtered;
  }, [searchQuery, groupedChecklists]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* 1. TOP NAVBAR */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-30">
        <div className="flex items-center gap-2">
           <ShieldCheck className="text-blue-600" size={24} />
           <h1 className="text-lg font-bold text-slate-800 tracking-tight">Audit Docket Manager</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search docket..." 
              className="pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        
        {/* ERROR / LOADING STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 m-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <>
        {/* AUDIT LEVEL MULTIPLIERS SUMMARY */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200 grid grid-cols-3 gap-4 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-blue-700 text-sm">10X - Partner Checklists</h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">Multiplier: 10x</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">Partner-level compliance and governance items</p>
            <div className="text-2xl font-bold text-blue-600">{groupedChecklists["10-series"]?.items?.length || 0}</div>
            <p className="text-xs text-slate-500">Items in series</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-indigo-700 text-sm">20X - Planning</h3>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Multiplier: 20x</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">Planning and scoping audit procedures</p>
            <div className="text-2xl font-bold text-indigo-600">{groupedChecklists["20-series"]?.items?.length || 0}</div>
            <p className="text-xs text-slate-500">Items in series</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-emerald-700 text-sm">30X - Completion</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Multiplier: 30x</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">Financial statements and final completion</p>
            <div className="text-2xl font-bold text-emerald-600">{groupedChecklists["30-series"]?.items?.length || 0}</div>
            <p className="text-xs text-slate-500">Items in series</p>
          </div>
        </div>

        {/* PROGRESS OVERVIEW */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex gap-6 overflow-x-auto flex-shrink-0">
          {Object.entries(filteredData).map(([key, section]) => {
             const progress = calculateProgress(section.items);
             return (
              <div key={key} className="flex flex-col min-w-[200px]">
                <div className="flex justify-between text-xs font-semibold mb-1 uppercase tracking-wide text-slate-500">
                  <span>{section.title.split(" ")[0]}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out bg-${section.color}-500`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
             );
          })}
        </div>

        {/* 3. GRID HEADER (Sticky) */}
        {/* Adjusted Grid Cols: 1 (Ref) + 6 (Task) + 1 (N/A) + 4 (Reviews) = 12 */}
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0">
          <div className="col-span-1 px-4 py-3 border-r border-slate-200">Ref</div>
          <div className="col-span-6 px-4 py-3 border-r border-slate-200">Task / Procedure</div>
          <div className="col-span-1 px-4 py-3 border-r border-slate-200 text-center bg-slate-100/50">Not Applicable</div>
          <div className="col-span-4 grid grid-cols-3 text-center">
            <div className="py-3 border-r border-slate-200 bg-blue-50/30 text-blue-800">Senior Staff Review</div>
            <div className="py-3 border-r border-slate-200 bg-blue-50/30 text-blue-800">EQR Review</div>
            <div className="py-3 bg-blue-50/30 text-blue-800">Partner Review</div>
          </div>
        </div>

        {/* 4. SCROLLABLE GRID LIST */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-20">
          
          {Object.entries(filteredData).map(([key, section]) => (
            <div key={key} className="mb-4 bg-white shadow-sm border-b border-slate-200">
              
              {/* SECTION HEADER */}
              <button 
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-100/50 hover:bg-slate-100 transition-colors border-y border-slate-200"
              >
                <div className="flex items-center gap-2">
                  {expandedSections[key] ? 
                    <ChevronDown size={18} className="text-slate-500" /> : 
                    <ChevronRight size={18} className="text-slate-500" />
                  }
                  <span className="font-bold text-sm text-slate-800">{section.title}</span>
                  <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {section.items.length} Items
                  </span>
                </div>
              </button>

              {/* ITEMS ROWS */}
              {expandedSections[key] && (
                <div>
                  {section.items.map((item, idx) => {
                    // Check if N/A is selected for this row
                    const isNA = signOffs[`${item.id}-na`];

                    return (
                    <div 
                      key={item.id} 
                      className={`grid grid-cols-12 text-sm border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-white'
                      }`}
                    >
                      
                      {/* REF COLUMN */}
                      <div className="col-span-1 px-4 py-3 border-r border-slate-100 font-mono text-slate-500 font-medium flex items-center bg-slate-50/30">
                        {item.code || item.item_code}
                      </div>

                      {/* TASK COLUMN */}
                      <div className="col-span-6 px-4 py-3 border-r border-slate-100 flex flex-col justify-center">
                        <p className={`font-medium text-slate-800 leading-snug ${isNA ? "text-slate-400 line-through decoration-slate-300" : ""}`}>
                            {item.task || item.item_name}
                        </p>
                        {(item.ref || item.reference) && (
                          <div className={`mt-1.5 flex items-center gap-2 ${isNA ? "opacity-50" : ""}`}>
                             <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-medium">
                              Ref: {item.ref || item.reference}
                             </span>
                          </div>
                        )}
                      </div>

                      {/* N/A COLUMN */}
                      <div className="col-span-1 border-r border-slate-100 bg-slate-50/30">
                         <SignOffCell 
                          checked={isNA} 
                          onClick={() => toggleSignOff(item.id, 'na')}
                          type="na"
                        />
                      </div>

                      {/* REVIEW COLUMNS */}
                      <div className={`col-span-4 grid grid-cols-3 transition-opacity duration-200 ${isNA ? "opacity-30 pointer-events-none bg-slate-100" : ""}`}>
                        <SignOffCell 
                          checked={signOffs[`${item.id}-senior`]} 
                          onClick={() => toggleSignOff(item.id, 'senior')} 
                        />
                        <SignOffCell 
                          checked={signOffs[`${item.id}-eqr`]} 
                          onClick={() => toggleSignOff(item.id, 'eqr')} 
                        />
                        <SignOffCell 
                          checked={signOffs[`${item.id}-partner`]} 
                          onClick={() => toggleSignOff(item.id, 'partner')} 
                        />
                      </div>

                    </div>
                  )})}
                </div>
              )}
            </div>
          ))}

          {/* EMPTY STATE IF SEARCH FAILS */}
          {checklists.length === 0 && !loading && (
             <div className="p-12 text-center text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No audit items found. Start by creating a project with checklists.</p>
             </div>
          )}

        </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: INTERACTIVE SIGN-OFF CELL ---
const SignOffCell = ({ checked, onClick, type = "verify" }) => {
  const isNA = type === "na";
  
  return (
    <div 
      onClick={onClick}
      className="border-r border-slate-100 last:border-0 h-full flex items-center justify-center cursor-pointer relative group hover:bg-slate-100 transition-all active:bg-slate-200"
      title={checked ? (isNA ? "Marked Not Applicable" : "Verified") : (isNA ? "Mark N/A" : "Unverified")}
    >
      <div 
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border ${
          checked 
            ? isNA 
                ? "bg-slate-600 border-slate-600 text-white shadow-sm" 
                : "bg-emerald-500 border-emerald-500 text-white shadow-sm"
            : "bg-white border-slate-200 text-transparent group-hover:border-slate-300"
        }`}
      >
        {isNA ? (
            <Ban size={16} className={checked ? "opacity-100" : "opacity-0 text-slate-400 group-hover:opacity-50"} />
        ) : (
            <Check size={18} strokeWidth={3} className={checked ? "opacity-100" : "opacity-0"} />
        )}
      </div>
      
      {/* Label for Unverified state on hover (Optional UX enhancement) */}
      {!checked && !isNA && (
        <span className="absolute text-[10px] font-medium text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity bottom-2">
            Verify
        </span>
      )}
    </div>
  );
};

export default Audit;