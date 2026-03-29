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
  const [workflows, setWorkflows] = useState([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);

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
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Activity} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          <SidebarItem 
            icon={Zap} 
            label="Workflows" 
            active={activeTab === 'workflows'} 
            onClick={() => setActiveTab('workflows')} 
          />
          <SidebarItem 
            icon={Database} 
            label="Data Pools" 
            active={activeTab === 'data'} 
            onClick={() => setActiveTab('data')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Integrations" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
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
            <h2 className="text-3xl font-bold">{activeTab === 'dashboard' ? 'Welcome back, Daniel' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-white/40 mt-1">AI-powered insights for your enterprise operations are ready.</p>
          </motion.div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="bg-card/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary/50 transition-all w-64"
              />
            </div>
            <button className="p-2.5 glass-card !rounded-xl relative">
              <Bell size={20} className="text-white/60" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
            </button>
            <button className="btn-primary flex items-center space-x-2" onClick={() => activeTab === 'dashboard' ? fetchDashboardData() : fetchWorkflows()}>
              {loading || loadingWorkflows ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              <span>{activeTab === 'dashboard' ? 'Refresh Data' : 'New ' + activeTab.slice(0, -1)}</span>
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
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* AI Insight Box */}
              <div className="mb-10 max-w-2xl">
                <AIInsightBox />
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
                {loading && !data ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="glass-card p-6 h-32 animate-pulse bg-white/5" />
                  ))
                ) : (
                  data?.metrics.map((metric) => (
                    <StatsCard 
                      key={metric.id}
                      title={metric.name} 
                      value={`${metric.value}${metric.unit === 'count' ? '' : metric.unit}`} 
                      change={metric.change} 
                      icon={iconMap[metric.name] || Cpu} 
                      color={colorMap[metric.name] || 'bg-primary'} 
                    />
                  ))
                )}
              </div>

              {/* Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                <div className="lg:col-span-2 glass-card p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">Resource Utilization</h3>
                    <select className="bg-transparent border-none outline-none text-white/40 text-sm cursor-pointer hover:text-white transition-colors">
                      <option>Last 30 Days</option>
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    {loading && !data ? (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl animate-pulse">
                        <Loader2 className="animate-spin text-white/20" size={40} />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.chart_data || []}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis 
                            dataKey="name" 
                            stroke="rgba(255,255,255,0.3)" 
                            axisLine={false} 
                            tickLine={false}
                            fontSize={12}
                            dy={10}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.3)" 
                            axisLine={false} 
                            tickLine={false}
                            fontSize={12}
                            dx={-10}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#6366f1" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="glass-card p-8 flex flex-col">
                  <h3 className="text-xl font-bold mb-6">Recent AI Actions</h3>
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {loading && !data ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                      ))
                    ) : (
                      data?.recent_actions.map((action, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Sparkles size={18} className="text-white/40 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{action.label}</p>
                              <p className="text-xs text-white/40">{action.type}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                            <span className="text-[10px] text-white/20 mt-1">{action.time}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                  <button className="w-full mt-6 py-3 text-sm font-bold text-white/40 hover:text-white transition-colors border-t border-white/5">
                    View All Logs
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'workflows' && (
            <motion.div
              key="workflows"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-8 relative z-10"
            >
              <h3 className="text-2xl font-bold mb-8">Active Workflows</h3>
              <div className="grid grid-cols-1 gap-6">
                {loadingWorkflows ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                  ))
                ) : (
                  workflows.map((wf) => (
                    <motion.div 
                      whileHover={{ x: 10 }}
                      key={wf.id} 
                      className="p-6 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${wf.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/20'}`}>
                          <Zap size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">{wf.name}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-white/40">
                            <span>Trigger: <span className="text-white/60">{wf.trigger}</span></span>
                            <span>Last Run: <span className="text-white/60">{wf.last_run}</span></span>
                            <span>Impact: <span className={`font-medium ${wf.impact === 'High' ? 'text-accent' : wf.impact === 'Critical' ? 'text-red-400' : 'text-green-400'}`}>{wf.impact}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <p className="text-xs text-white/40 mb-1">Automation Level</p>
                          <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${wf.automation_level}%` }} 
                              className="h-full bg-gradient-to-r from-primary to-secondary" 
                            />
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-white/5 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                          Configure
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
