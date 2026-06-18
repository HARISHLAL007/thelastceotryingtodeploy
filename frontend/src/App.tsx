import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PanelLeftOpen } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Landing } from '@/pages/Landing';
import { Home } from '@/pages/Home';
import { Auth } from '@/pages/Auth';
import { Engine } from '@/pages/Engine';
import { Outcome } from '@/pages/Outcome';
import { Database } from '@/pages/Database';
import { Chatbot } from '@/components/Chatbot';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;
  // Sidebar belongs to the dashboard phase only — hidden on the landing page and the corporate game flow.
  const sidebarAvailable = path !== '/' && path !== '/enter' && path !== '/auth';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-[#040610] h-screen text-slate-100">
      {sidebarAvailable && sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
      {sidebarAvailable && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          title="Show sidebar"
          className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all backdrop-blur-md"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/enter" element={<Home />} />
          <Route path="/engine" element={<Engine />} />
          <Route path="/outcome" element={<Outcome />} />
          <Route path="/database" element={<Database />} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
