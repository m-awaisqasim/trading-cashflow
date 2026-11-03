import { useState } from 'react';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Building2,
  Globe,
  Landmark,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// --- Dummy Data ---
const summaryData = {
  totalNetWorth: 15450.0,
  lifetimeDeposited: 20000.0,
  lifetimeWithdrawn: 4550.0,
};

const accounts = [
  {
    id: 1,
    name: 'Binance Main',
    balance: 8250.42,
    currency: 'USDT',
    change: +12.4,
    icon: Globe,
    color: 'emerald',
  },
  {
    id: 2,
    name: 'Bybit Sub 1',
    balance: 4820.15,
    currency: 'USDT',
    change: -3.2,
    icon: Building2,
    color: 'red',
  },
  {
    id: 3,
    name: 'Personal Bank',
    balance: 2379.43,
    currency: 'USD',
    change: +0.8,
    icon: Landmark,
    color: 'yellow',
  },
];

const monthlyPnL = [
  { month: 'Jan', pnl: 1200 },
  { month: 'Feb', pnl: -800 },
  { month: 'Mar', pnl: 2100 },
  { month: 'Apr', pnl: -450 },
  { month: 'May', pnl: 1800 },
  { month: 'Jun', pnl: 3200 },
  { month: 'Jul', pnl: -1100 },
  { month: 'Aug', pnl: 950 },
];

// --- Helper ---
const formatCurrency = (value: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

// --- Components ---

function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  accentColor,
  glowColor,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  accentColor: string;
  glowColor: string;
}) {
  return (
    <GlassCard className="p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
      {/* Subtle glow effect */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${glowColor}`}
      />
      <div className="flex items-center justify-between mb-4">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
        <div
          className={`p-2 rounded-lg ${accentColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
        {value}
      </p>
    </GlassCard>
  );
}

function AccountRow({
  account,
}: {
  account: (typeof accounts)[0];
}) {
  const Icon = account.icon;
  const isPositive = account.change >= 0;

  return (
    <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white/5 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
          <Icon className="w-5 h-5 text-zinc-300" />
        </div>
        <div>
          <p className="text-white font-medium">{account.name}</p>
          <p className="text-zinc-500 text-sm">{account.currency}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold">
          {formatCurrency(account.balance, account.currency)}
        </p>
        <div
          className={`flex items-center justify-end gap-1 text-sm ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {account.change}%
          </span>
        </div>
      </div>
    </div>
  );
}

function PnLChart() {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPositive = value >= 0;
      return (
        <div className="bg-[#0f0f0f]/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-zinc-400 text-xs mb-1">{label}</p>
          <p
            className={`font-semibold ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlyPnL}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="pnl" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {monthlyPnL.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [fabHovered, setFabHovered] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Green orb - top left */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[120px]" />
        {/* Yellow orb - bottom right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-yellow-500/6 blur-[120px]" />
        {/* Purple orb - center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/4 blur-[150px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Cashflow & P&L Tracker
            </h1>
          </div>
          <p className="text-zinc-400 text-sm md:text-base ml-12">
            Monitor your trading portfolio performance
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <SummaryCard
            title="Total Net Worth"
            value={formatCurrency(summaryData.totalNetWorth)}
            icon={Wallet}
            accentColor="bg-emerald-500/10 text-emerald-400"
            glowColor="bg-emerald-500"
          />
          <SummaryCard
            title="Lifetime Deposited"
            value={formatCurrency(summaryData.lifetimeDeposited)}
            icon={ArrowDownLeft}
            accentColor="bg-emerald-500/10 text-emerald-400"
            glowColor="bg-emerald-500"
          />
          <SummaryCard
            title="Lifetime Withdrawn"
            value={formatCurrency(summaryData.lifetimeWithdrawn)}
            icon={ArrowUpRight}
            accentColor="bg-yellow-500/10 text-yellow-400"
            glowColor="bg-yellow-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Accounts List */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Accounts</h2>
              <span className="text-xs text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {accounts.length} accounts
              </span>
            </div>
            <div className="space-y-1">
              {accounts.map((account) => (
                <AccountRow key={account.id} account={account} />
              ))}
            </div>
            {/* Total */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between px-4">
              <span className="text-zinc-400 text-sm font-medium">
                Total Balance
              </span>
              <span className="text-white font-bold text-lg">
                {formatCurrency(
                  accounts.reduce((sum, a) => sum + a.balance, 0)
                )}
              </span>
            </div>
          </GlassCard>

          {/* P&L Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Monthly P&L</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-400">Profit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs text-zinc-400">Loss</span>
                </div>
              </div>
            </div>
            <PnLChart />
            {/* Summary below chart */}
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-zinc-500 text-xs mb-1">Best Month</p>
                <p className="text-emerald-400 font-semibold">
                  +{formatCurrency(3200)}
                </p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs mb-1">Worst Month</p>
                <p className="text-red-400 font-semibold">
                  {formatCurrency(-1100)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Transactions Preview */}
        <div className="mt-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                Recent Activity
              </h2>
              <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  type: 'deposit',
                  desc: 'Deposit to Binance Main',
                  amount: '+$5,000.00',
                  date: 'Today, 2:30 PM',
                  color: 'emerald',
                },
                {
                  type: 'trade',
                  desc: 'BTC/USDT Long Position',
                  amount: '+$342.50',
                  date: 'Today, 11:15 AM',
                  color: 'emerald',
                },
                {
                  type: 'withdrawal',
                  desc: 'Withdrawal to Bank',
                  amount: '-$1,200.00',
                  date: 'Yesterday, 5:45 PM',
                  color: 'yellow',
                },
                {
                  type: 'trade',
                  desc: 'ETH/USDT Short Position',
                  amount: '-$186.20',
                  date: 'Yesterday, 9:00 AM',
                  color: 'red',
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.color === 'emerald'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : tx.color === 'yellow'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {tx.type === 'deposit' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : tx.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {tx.desc}
                      </p>
                      <p className="text-zinc-500 text-xs">{tx.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold text-sm ${
                      tx.color === 'emerald'
                        ? 'text-emerald-400'
                        : tx.color === 'yellow'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onMouseEnter={() => setFabHovered(true)}
        onMouseLeave={() => setFabHovered(false)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-xl border border-emerald-500/50 transition-all duration-300 cursor-pointer z-50 ${
          fabHovered
            ? 'shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-110'
            : 'shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        }`}
      >
        <Plus
          className={`w-6 h-6 text-emerald-400 transition-transform duration-300 ${
            fabHovered ? 'rotate-90' : ''
          }`}
        />
      </button>
    </div>
  );
}
