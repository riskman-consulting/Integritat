import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    // 1. Outer Container: Locked to screen height, no body scroll
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* 2. Sidebar: Fixed height, does not scroll with content */}
      <aside className="hidden md:block h-full flex-shrink-0 z-20 shadow-xl bg-white">
        <Sidebar />
      </aside>

      {/* 3. Right Side: Flex column for Header + Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Header: Stays at the top */}
        <header className="flex-shrink-0 sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
          <Navbar />
        </header>

        {/* 4. Main Content: Independent scroll area */}
        {/* overflow-y-auto puts the scrollbar here, keeping sidebar fixed */}
        <main className="flex-1 p-4 md:p-8 scroll-smooth relative z-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;