
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Crown, BookOpen, Calculator } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Navigation = ({ currentView, setCurrentView }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Hem', icon: Home },
    { id: 'toplists', label: 'Topplistor', icon: Crown },
    { id: 'methods', label: 'Mätmetoder', icon: BookOpen },
    { id: 'calculator', label: 'Beräkning', icon: Calculator },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentView === id ? "default" : "ghost"}
                onClick={() => setCurrentView(id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
          
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Riksdagsspråk.se</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
