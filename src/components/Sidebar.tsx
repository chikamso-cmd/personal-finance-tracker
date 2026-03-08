import React from 'react';
import {
  LayoutDashboard,
  ArrowUpRight,
  Wallet,
  PieChart,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../pages/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  budgetOverview: { spent: number; limit: number };
  onNavigate?: () => void; // called after selecting a menu item (useful for closing mobile drawer)
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, budgetOverview, onNavigate }:SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
    { id: 'budgets', label: 'Budgets', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen rounded  bg-[#1E3A8A] text-white h-screen flex flex-col p-6 fixed left-0 top-0 z-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <Wallet className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">FinTrack</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (onNavigate) onNavigate();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === item.id 
                ? "bg-white/10 text-white font-medium" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">Budget Overview</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Spent</span>
              <span className="font-medium">₦{budgetOverview.spent.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  (budgetOverview.spent / budgetOverview.limit) > 1 ? "bg-red-500" : "bg-emerald-500"
                )}
                style={{ width: `${Math.min((budgetOverview.spent / budgetOverview.limit) * 100, 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-white/40">
              ₦{(budgetOverview.limit - budgetOverview.spent).toLocaleString()} {budgetOverview.limit >= budgetOverview.spent ? 'under' : 'over'} budget
            </div>
          </div>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors w-full">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
