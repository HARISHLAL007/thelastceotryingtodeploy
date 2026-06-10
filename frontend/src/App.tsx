import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Landing } from '@/pages/Landing';
import { Home } from '@/pages/Home';
import { Engine } from '@/pages/Engine';
import { Outcome } from '@/pages/Outcome';
import { Database } from '@/pages/Database';

const Layout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="flex bg-[#040610] min-h-screen text-slate-100">
      {!isLanding && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/enter" element={<Home />} />
          <Route path="/engine" element={<Engine />} />
          <Route path="/outcome" element={<Outcome />} />
          <Route path="/database" element={<Database />} />
        </Routes>
      </main>
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
