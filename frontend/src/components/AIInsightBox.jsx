import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AIInsightBox = () => {
  const [insight, setInsight] = useState("Generate an AI-powered insight for your business operations.");
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/ai/insight?context=dashboard`);
      setInsight(response.data.insight);
    } catch (err) {
      console.error("AI Error:", err);
      setInsight("Failed to generate AI insight. Is the engine online?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-primary">
          <Sparkles size={20} />
          <h4 className="font-bold text-lg">OmniAI Discovery</h4>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <div className="relative min-h-[80px] flex items-center">
        {loading ? (
          <div className="flex items-center space-x-3 text-white/40 italic">
            <Loader2 className="animate-spin" size={18} />
            <span>Engaging OmniSaaS Neural Engine...</span>
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-white/80 leading-relaxed italic"
          >
            "{insight}"
          </motion.p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/20 uppercase tracking-widest">
        <span>Powered by OmniSaaS Core v1.0</span>
        <span className="text-primary/40">Context: Enterprise Ops</span>
      </div>
    </div>
  );
};

export default AIInsightBox;
