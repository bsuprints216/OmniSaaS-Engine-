import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Settings, 
  Zap, 
  Database, 
  Bell, 
  User, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Sparkles,
  Search,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import AIInsightBox from './components/AIInsightBox';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`nav-link w-full text-left ${active ? 'active' : ''}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatsCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>
        {change > 0 ? '+' : ''}{change}%
      </span>
    </div>
    <p className="text-white/60 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value} {typeof value === 'number' && isNaN(value) ? '...' : ''}</h3>
  </motion.div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Discovery', message: 'New efficiency trend detected in SKU-402.', time: '2m ago', read: false },
    { id: 2, title: 'Workflow Alert', message: 'Inventory Optimization triggered automatically.', time: '15m ago', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const integrations = [
    { name: 'Slack', status: 'connected', category: 'Messaging', icon: LayoutDashboard },
    { name: 'Salesforce', status: 'disconnected', category: 'CRM', icon: Database },
    { name: 'AWS S3', status: 'connected', category: 'Storage', icon: Database },
    { name: 'Discord', status: 'connected', category: 'Messaging', icon: Activity },
    { name: 'Notion', status: 'disconnected', category: 'Productivity', icon: Settings },
    { name: 'Twilio', status: 'connected', category: 'Telecom', icon: Zap }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchWorkflows();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/analytics/dashboard`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to connect to OmniSaaS Engine API. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    try {
      setLoadingWorkflows(true);
      const response = await axios.get(`${API_URL}/api/v1/workflows`);
      setWorkflows(response.data);
    } catch (err) {
      console.error("Error fetching workflows:", err);
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const iconMap = {
    'AI Efficiency': Cpu,
    'Workflows Triggered': Zap,
    'Insights Discovered': TrendingUp,
    'Data Processed': Database
  };

  const colorMap = {
    'AI Efficiency': 'bg-primary',
    'Workflows Triggered': 'bg-secondary',
    'Insights Discovered': 'bg-accent',
    'Data Processed': 'bg-green-500'
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 glass-card rounded-none border-y-0 border-l-0 p-6 flex flex-col space-y-8 z-10">
        <div className="flex items-center space-x-3 px-4">
          <div className="w-10 h-10 bg-primary ring-4 ring-primary/20 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">OmniSaaS</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Activity} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={Zap} label="Workflows" active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')} />
          <SidebarItem icon={Settings} label="Integrations" active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <User size={20} className="text-white/60 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-bold truncate">Daniel Lopez</p>
              <p className="text-xs text-white/40 truncate">Enterprise Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none -ml-20 -mb-20"></div>

        {/* Header */}
        <header className="flex justify-between items-center mb-10 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-bold tracking-tight">
              {activeTab === 'dashboard' ? 'Neural Pulse' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-white/40 mt-1">Autonomous orchestration layer is active.</p>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-card/40 border border-white/5 backdrop-blur-xl rounded-2xl pl-12 pr-6 py-3 outline-none focus:border-primary/50 transition-all w-72 text-sm"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 glass-card !rounded-2xl relative ${showNotifications ? 'bg-white/10 border-white/20' : ''}`}
              >
                <Bell size={20} className="text-white/60" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 glass-card p-4 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h4 className="font-bold">Neural Alerts</h4>
                      <button className="text-[10px] text-primary font-bold uppercase hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                          <p className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{n.title}</p>
                          <p className="text-[11px] text-white/40 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-white/20 mt-2 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="btn-primary flex items-center space-x-2 px-6" onClick={() => setActiveTab('dashboard')}>
              <Plus size={20} />
              <span>Launch Alpha</span>
            </button>
          </div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="mb-10 max-w-2xl">
                <AIInsightBox />
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
                {loading && !data ? (
                  Array(4).fill(0).map((_, i) => <div key={i} className="glass-card p-6 h-32 animate-pulse bg-white/5" />)
                ) : (
                  data?.metrics.map((metric) => (
                    <StatsCard key={metric.id} title={metric.name} value={`${metric.value}${metric.unit === 'count' ? '' : metric.unit}`} change={metric.change} icon={iconMap[metric.name] || Cpu} color={colorMap[metric.name] || 'bg-primary'} />
                  ))
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-2 glass-card p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold">Inference Throughput</h3>
                      <p className="text-white/20 text-xs mt-1">Real-time neural token processing metrics.</p>
                    </div>
                    <div className="flex space-x-2">
                       {['H', 'D', 'W', 'M'].map(t => (
                         <button key={t} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${t === 'W' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/20 hover:text-white/40'}`}>{t}</button>
                       ))}
                    </div>
                  </div>
                  <div className="h-[320px] w-full">
                    {loading && !data ? (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl animate-pulse"><Loader2 className="animate-spin text-white/20" size={40} /></div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.chart_data || []}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6161ed" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6161ed" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} fontSize={10} dy={10} />
                          <YAxis stroke="rgba(255,255,255,0.2)" axisLine={false} tickLine={false} fontSize={10} dx={-10} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f0f12', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff' }} />
                          <Area type="monotone" dataKey="value" stroke="#6161ed" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="glass-card p-8 flex flex-col">
                  <h3 className="text-xl font-bold mb-6">Neural Activity</h3>
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {loading && !data ? (
                      Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
                    ) : (
                      data?.recent_actions.map((action, i) => (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Sparkles size={20} className="text-white/20 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                               <p className="text-sm font-bold tracking-tight">{action.label}</p>
                               <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{action.type}</span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-white/10 group-hover:text-white transition-colors" />
                        </motion.div>
                      ))
                    )}
                  </div>
                  <button className="w-full mt-6 py-4 text-xs font-bold text-white/20 hover:text-white transition-colors border-t border-white/5 tracking-[0.2em] uppercase">Audit Terminal</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
             <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="glass-card p-8">
                      <h4 className="font-bold text-xl mb-6">Cognitive Load Distribution</h4>
                      <div className="h-64 flex items-center justify-center italic text-white/20">
                         [Advanced D3.js Heatmap Projection Component]
                      </div>
                   </div>
                   <div className="glass-card p-8">
                      <h4 className="font-bold text-xl mb-6">Execution Latency</h4>
                      <div className="h-64 flex items-center justify-center italic text-white/20">
                         [Real-time Stream Cluster Chart]
                      </div>
                   </div>
                </div>
                <div className="glass-card p-8">
                   <h4 className="font-bold text-xl mb-6">Data Source Integrity</h4>
                   <div className="space-y-6">
                      {['PostgreSQL Cluster', 'Redis Mainframe', 'S3 Neural Store'].map(s => (
                        <div key={s} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                           <div className="flex items-center space-x-4">
                              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                              <span className="font-bold text-sm">{s}</span>
                           </div>
                           <span className="text-xs font-mono text-white/40">Healthy // 99.9% Uptime</span>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'workflows' && (
            <motion.div key="workflows" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card p-8 relative z-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold">Autonomous Workflows</h3>
                <button className="btn-primary flex items-center space-x-2">
                   <Zap size={18} />
                   <span>Orchestrate New</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {loadingWorkflows ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-3xl animate-pulse" />)
                ) : (
                  workflows.map((wf) => (
                    <motion.div whileHover={{ scale: 1.01, x: 5 }} key={wf.id} className="p-8 rounded-3xl border border-white/5 bg-white/5 flex items-center justify-between group transition-all hover:bg-white-[0.07]">
                      <div className="flex items-center space-x-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${wf.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/20'}`}>
                          <Zap size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold tracking-tight">{wf.name}</h4>
                          <div className="flex items-center space-x-6 mt-2 text-xs text-white/30 font-medium">
                            <span className="flex items-center space-x-2"><LayoutDashboard size={14} /> <span>{wf.trigger}</span></span>
                            <span className="flex items-center space-x-2"><Activity size={14} /> <span className={`uppercase font-bold ${wf.impact === 'High' ? 'text-accent' : wf.impact === 'Critical' ? 'text-red-500' : 'text-green-400'}`}>{wf.impact}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-12">
                        <div className="text-right">
                          <p className="text-[10px] text-white/20 mb-2 font-bold uppercase tracking-widest">Automation Depth</p>
                          <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${wf.automation_level}%` }} className="h-full bg-gradient-to-r from-primary via-secondary to-accent" />
                          </div>
                        </div>
                        <div className="flex space-x-3">
                           <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white"><Settings size={18} /></button>
                           <button className="px-6 py-3 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all">Optimize</button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
             <motion.div key="integrations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app, i) => (
                  <motion.div key={app.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 flex items-center space-x-4 group cursor-pointer hover:border-primary/30">
                     <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <app.icon size={26} className="text-white/40 group-hover:text-primary transition-colors" />
                     </div>
                     <div className="flex-1">
                        <h5 className="font-bold text-sm tracking-tight">{app.name}</h5>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-wider">{app.category}</p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${app.status === 'connected' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white/20'}`}>
                        {app.status}
                     </div>
                  </motion.div>
                ))}
                <div className="glass-card p-6 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center space-y-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                   <Plus size={32} className="text-white/20" />
                   <p className="text-xs font-bold tracking-widest uppercase">Request Connector</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
