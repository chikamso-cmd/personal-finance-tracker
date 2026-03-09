import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../pages/lib/utils';

interface StatCardProps {
  title: string;
  amount: number;
  change?: string;
  type?: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, change, type, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col justify-between">
    
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        <Icon size={20} className="text-white" />
      </div>
      {change && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          type === 'positive' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {type === 'positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      )}
    </div>
    <div>
      <h3 className="md:text-sm text-[16px] text-gray-500 font-medium mb-1">{title}</h3>
      <p className="md:text-2xl text-[16px] font-bold text-gray-900">₦{amount.toLocaleString()}</p>
    </div>
  </div>
);

export default StatCard;
