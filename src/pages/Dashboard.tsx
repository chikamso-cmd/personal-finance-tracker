import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Plus,
  Bell,
  ChevronDown,
  TrendingUp,
  Calendar,
  Menu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  Legend,
} from "recharts";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subMonths,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";
import type { Transaction, Budget } from "../components/types";
import { CATEGORIES, CATEGORY_COLORS, INITIAL_TRANSACTIONS } from "./constants";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TransactionModal from "../components/TransactionModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("fintrack_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [budgets, _setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem("fintrack_budgets");
    return saved
      ? JSON.parse(saved)
      : CATEGORIES.map((cat) => ({ category: cat, limit: 50000 }));
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("fintrack_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fintrack_budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (newT: Omit<Transaction, "id">) => {
    const transaction: Transaction = {
      ...newT,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([transaction, ...transactions]);
  };

  // Calculations
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // whether any transactions exist (regardless of current month)
  const hasTransactions = transactions.length > 0;

  const currentMonthTransactions = transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: monthStart, end: monthEnd });
  });

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.limit, 0);

  // Chart Data: Income vs Expenses (Last 6 months)
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(currentMonth, 5 - i);
    const mStart = startOfMonth(date);
    const mEnd = endOfMonth(date);
    const mTransactions = transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start: mStart, end: mEnd });
    });

    return {
      name: format(date, "MMM"),
      income: mTransactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0),
      expenses: mTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0),
    };
  });

  // Category Data
  const categoryData = CATEGORIES.map((cat) => {
    const amount = currentMonthTransactions
      .filter((t) => t.category === cat && t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    return { name: cat, value: amount, fill: CATEGORY_COLORS[cat] };
  }).filter((d) => d.value > 0);

  return (
    <>
      {/* mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed top-0 left-0 w-64 h-screen z-30"
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              budgetOverview={{ spent: totalExpenses, limit: totalBudgetLimit }}
              onNavigate={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen bg-[#F8FAFC] flex">
        {/* desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            budgetOverview={{ spent: totalExpenses, limit: totalBudgetLimit }}
          />
        </div>

        <main className="flex-1 ml-0 md:ml-64 md:p-8 p-3 overflow-hidden">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mt-0 gap-5">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              <button
                className="md:hidden p-5 rounded-md"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-[12px] sm:text-[16px] font-bold text-gray-900">
                  Welcome back, John!
                </h1>
                <p className="text-gray-500 text-[10px] sm:text-[12px]">
                  Here's what's happening with your money today.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
              <div className="relative lg:block">
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  title="add a transaction to start"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-[10px] md:text-xs"
                >
                  <Plus size={18} />
                  Add Transaction
                </button>
              </div>
              <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="md:flex items-center gap-3 pl-6 border-l border-gray-200 hidden">
                <img
                  src="https://picsum.photos/seed/user/100/100"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hidden sm:block"
                  referrerPolicy="no-referrer"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 text-[12px] md:text-[16px]">
                    John Doe
                  </p>
                  <p className="text-gray-500 text-xs">Premium Plan</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          {!hasTransactions && (
            <p className="w-full text-center text-[13px] md:text-sm py-3 text-gray-600 bg-yellow-50 rounded-md">
              You need to add a transaction before you can continue and see the
              metrics.
            </p>
          )}

          {hasTransactions && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Monthly Income"
                  amount={totalIncome}
                  change="20%"
                  type="positive"
                  icon={ArrowUpRight}
                  colorClass="bg-emerald-500"
                />
                <StatCard
                  title="Monthly Expenses"
                  amount={totalExpenses}
                  change="15%"
                  type="negative"
                  icon={ArrowDownLeft}
                  colorClass="bg-rose-500"
                />
                <StatCard
                  title="Total Budget"
                  amount={totalBudgetLimit}
                  icon={Wallet}
                  colorClass="bg-indigo-500"
                />
                <StatCard
                  title="Current Balance"
                  amount={balance}
                  icon={TrendingUp}
                  colorClass="bg-violet-500"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-black/5">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="md:text-lg text-[12px] font-bold text-gray-900">
                      Income vs Expenses
                    </h3>
                    <div className="flex gap-4 md:text-sm text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-gray-500">Income</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                        <span className="text-gray-500">Expenses</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#F1F5F9"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94A3B8", fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94A3B8", fontSize: 12 }}
                          tickFormatter={(value) => `₦${value / 1000}k`}
                        />
                        <Tooltip
                          cursor={{ fill: "#F8FAFC" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="income"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                        <Bar
                          dataKey="expenses"
                          fill="#FB7185"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5">
                  <h3 className="md:text-lg text-[12px] font-bold text-gray-900 mb-8">
                    Spending By Category
                  </h3>
                  <div className="h-[300px] w-full md:text-sm text-[12px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          formatter={(value) => (
                            <span className="md:text-xs text-[12px] text-gray-500 font-medium">
                              {value}
                            </span>
                          )}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-[12px] md:text-xl font-bold text-gray-900">
                    Recent Transactions
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 md:text-sm text-[10px] font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[10px]">
                      {transactions.slice(0, 5).map((t) => (
                        <tr
                          key={t.id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4 text-[10px] md:text-sm">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: `${CATEGORY_COLORS[t.category]}20`,
                                  color: CATEGORY_COLORS[t.category],
                                }}
                              >
                                {t.type === "income" ? (
                                  <ArrowUpRight size={16} />
                                ) : (
                                  <ArrowDownLeft size={16} />
                                )}
                              </div>
                              <span className="font-medium text-gray-900">
                                {t.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-[10px] md:text-sm">
                            {t.description}
                          </td>
                          <td
                            className={cn(
                              "px-6 py-4 font-semibold md:text-sm text-[10px]",
                              t.type === "income"
                                ? "text-emerald-600"
                                : "text-rose-600",
                            )}
                          >
                            {t.type === "income" ? "+" : "-"}₦
                            {t.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-sm">
                              <Calendar size={14} />
                              {format(parseISO(t.date), "MMM d, yyyy")}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addTransaction}
        />
      </div>
    </>
  );
}
