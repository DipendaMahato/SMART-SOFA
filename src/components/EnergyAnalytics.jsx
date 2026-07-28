import React from 'react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart as ReLineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Zap, 
  Download, 
  Share2, 
  TrendingUp, 
  PieChartIcon, 
  BarChart3 
} from 'lucide-react';

const DAILY_DATA = [
  { day: 'Mon', kWh: 2.1 },
  { day: 'Tue', kWh: 3.4 },
  { day: 'Wed', kWh: 1.8 },
  { day: 'Thu', kWh: 4.2 },
  { day: 'Fri', kWh: 2.9 },
  { day: 'Sat', kWh: 5.1 },
  { day: 'Sun', kWh: 3.4 }
];

const WEEKLY_TREND = [
  { week: 'W1', kWh: 22.4 },
  { week: 'W2', kWh: 28.1 },
  { week: 'W3', kWh: 24.8 },
  { week: 'W4', kWh: 31.2 }
];

const DEVICE_BREAKDOWN = [
  { name: 'Ventilation Fan', value: 45, color: '#06B6D4' },
  { name: 'Seat Heating', value: 30, color: '#F59E0B' },
  { name: 'RGB Lighting', value: 15, color: '#3B82F6' },
  { name: 'Recliner Motors', value: 10, color: '#8B5CF6' }
];

export default function EnergyAnalytics({ electricalInfo }) {
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Day,kWh\nMon,2.1\nTue,3.4\nWed,1.8\nThu,4.2\nFri,2.9\nSat,5.1\nSun,3.4";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smartsofa_energy_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Export */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Energy Analytics & Power Consumption
          </h2>
          <p className="text-xs text-slate-400 mt-1">Detailed breakdown of electricity usage, daily patterns and load distribution.</p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export CSV Report
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Consumption Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Daily Consumption (kWh)
            </h3>
            <span className="text-xs font-semibold text-blue-400">Past 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={DAILY_DATA}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} 
                />
                <Bar dataKey="kWh" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Weekly Usage Trend (kWh)
            </h3>
            <span className="text-xs font-semibold text-emerald-400">Monthly View</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={WEEKLY_TREND}>
                <XAxis dataKey="week" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} 
                />
                <Line type="monotone" dataKey="kWh" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Power Breakdown Pie Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-cyan-400" />
              Component Load Allocation (%)
            </h3>
            <span className="text-xs font-semibold text-slate-400">Hardware Subsystems</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={DEVICE_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {DEVICE_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} 
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              {DEVICE_BREAKDOWN.map((item) => (
                <div key={item.name} className="flex items-center space-x-3 p-3 rounded-2xl glass-card border border-slate-800">
                  <div className="w-4 h-4 rounded-md" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="text-xs font-bold text-white block">{item.name}</span>
                    <span className="text-xs text-slate-400 font-medium">{item.value}% Power</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
