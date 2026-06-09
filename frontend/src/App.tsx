import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Home } from '@/pages/Home';
import { Engine } from '@/pages/Engine';
import { Outcome } from '@/pages/Outcome';
import { useGameStore } from '@/store/gameStore';

function App() {
  const company = useGameStore((s) => s.company);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="flex">
        {company && <Sidebar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/engine" element={<Engine />} />
            <Route path="/outcome" element={<Outcome />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
