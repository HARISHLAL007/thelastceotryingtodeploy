import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/engine', icon: BarChart3, label: 'Dashboard' },
    { path: '/outcome', icon: Trophy, label: 'Results' },
  ];

  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="p-4">
        <h2 className="mb-4 font-semibold text-sm text-muted-foreground">
          Navigation
        </h2>
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 mt-8 border-t">
        <h2 className="mb-4 font-semibold text-sm text-muted-foreground">
          Quick Stats
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Employees</span>
            <span className="font-semibold">10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Industry</span>
            <span className="font-semibold">Tech</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
