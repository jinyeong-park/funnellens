import { useStore } from '../store/useStore';
import { useBenchmarks } from '../BenchmarkContext';
import { BENCHMARK_DEFAULTS } from '../config/benchmarks';
import { 
  CampaignData, 
  LandingPageData, 
  FormQuestionData, 
  SalesData 
} from '../types';
import { ChevronDown, Zap, Activity } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Toast } from './Toast';

export const Header = () => {
  const { setCampaignData, setLandingData, setFormData, setSalesData, campaignData, setResults } = useStore();
  const { activeVertical, setActiveVertical, activeBenchmarks } = useBenchmarks();
  const [showVerticalToast, setShowVerticalToast] = useState(false);

  const isDataEmpty = !campaignData;

  const loadScenario = (type: 'cpm' | 'cpc' | 'cpl' | 'cpa' | 'healthy') => {
    let spend = 10000;
    let impressions = 500000;
    let clicks = 2000;
    let leads = 100;
    let cases = 5;

    switch (type) {
      case 'cpm':
        impressions = 200000; // CPM = $50 (High)
        break;
      case 'cpc':
        clicks = 400; // CPC = $25 (High)
        break;
      case 'cpl':
        leads = 10; // CPL = $1000 (High)
        break;
      case 'cpa':
        cases = 1; // CPA = $10000 (High)
        break;
      case 'healthy':
        // Default values are good
        break;
    }

    const sampleCampaigns: CampaignData[] = [
      { date: '2024-05-01', campaign_name: 'Diagnostic_Test', impressions, clicks, spend, leads }
    ];

    const sampleLanding: LandingPageData[] = [
      { date: '2024-05-01', page_views: clicks, form_starts: Math.floor(clicks * 0.2), form_submits: leads, bounce_rate: 0.42, avg_time_on_page_sec: 65 }
    ];

    const sampleForm: FormQuestionData[] = [
      { step: 1, question: 'Full Name', type: 'friction', started: 100, completed: 90 },
      { step: 2, question: 'Qualification', type: 'qualification', started: 90, completed: 80 }
    ];

    const sampleSales: SalesData = {
      total_leads: leads,
      calls_connected: Math.floor(leads * 0.8),
      qualified_calls: Math.floor(leads * 0.3),
      cases_signed: cases,
      sales_feedback: type === 'cpa' ? 'Leads are low intent' : 'Funnel test diagnostic'
    };

    setCampaignData(sampleCampaigns);
    setLandingData(sampleLanding);
    setFormData(sampleForm);
    setSalesData(sampleSales);
  };

  const handleVerticalChange = (id: string) => {
    const { campaignData } = useStore.getState();
    if (campaignData) {
      setShowVerticalToast(true);
    }
    setActiveVertical(id);
  };

  const downloadTemplates = () => {
    const templates = [
      {
        name: 'campaign_performance.csv',
        content: 'date,campaign_name,impressions,clicks,spend,leads\n2024-05-01,Campaign_A_GA_Only,35000,350,4200,18\n2024-05-01,Campaign_B_MultiState,70000,2800,8400,70'
      },
      {
        name: 'landing_page_analytics.csv',
        content: 'date,page_views,form_starts,form_submits,bounce_rate,avg_time_on_page_sec\n2024-05-01,5200,680,88,0.42,65'
      },
      {
        name: 'form_funnel_data.csv',
        content: 'step,question,type,started,completed\n1,Full Name,friction,680,666\n2,Phone,friction,666,626\n3,Email,friction,626,601\n4,Were you injured?,qualification,601,541\n5,Do you have a lawyer?,qualification,541,460\n6,Describe injury,friction_heavy,460,322'
      },
      {
        name: 'sales_crm_feedback.csv',
        content: 'total_leads,calls_connected,qualified_calls,cases_signed,sales_feedback\n88,70,14,3,High volume of "already have lawyer" leads'
      }
    ];

    templates.forEach(t => {
      const blob = new Blob([t.content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', t.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-12 sticky top-0 z-40">
      <div className="flex items-center gap-12">
        <button 
          onClick={() => {
            setCampaignData(null);
            setLandingData(null);
            setFormData(null);
            setSalesData(null);
            setResults(null);
          }}
          className="flex items-center gap-4 hover:opacity-90 transition-opacity text-left cursor-pointer group"
        >
          <motion.div 
            initial={{ rotate: -5, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-40" />
              
              <div className="relative z-10 font-black flex items-baseline select-none">
                <span className="text-white text-[20px] leading-none tracking-tighter">F</span>
                <span className="text-blue-200 text-[16px] leading-none tracking-tighter -ml-1 shadow-sm">L</span>
              </div>
              
              {/* Glass flare effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              
              {/* Animated scanning line */}
              <motion.div 
                animate={{ 
                  top: ['-100%', '200%'],
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-x-0 h-1/3 bg-white/20 blur-lg pointer-events-none"
              />
            </div>
            {/* Outer lens ring */}
            <div className="absolute -inset-1.5 border border-blue-100 rounded-2xl opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
          </motion.div>

          <div className="flex flex-col">
            <h1 className="text-[22px] font-black tracking-tight leading-none text-gray-900 bg-clip-text">
              FunnelLens
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                Diagnostic Agent
              </span>
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </button>

        <div className="relative group">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Vertical</p>
          <div className="relative">
            <select 
              value={activeVertical}
              onChange={(e) => handleVerticalChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer min-w-[220px]"
            >
              {Object.values(BENCHMARK_DEFAULTS).map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-end">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Test Scenarios</p>
          <div className="relative">
            <select 
              onChange={(e) => loadScenario(e.target.value as any)}
              className={`appearance-none border rounded-md px-3 py-1.5 text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[140px] ${
                isDataEmpty 
                  ? 'bg-blue-600 border-blue-700 text-white animate-pulse shadow-lg ring-4 ring-blue-500/20' 
                  : 'bg-blue-50/50 border-blue-100 text-blue-600'
              }`}
              defaultValue=""
            >
              <option value="" disabled className="text-gray-900">Load Scenario...</option>
              <option value="healthy" className="text-gray-900">Case: Healthy Funnel</option>
              <option value="cpm" className="text-gray-900">Case 1: High Ad Costs (CPM)</option>
              <option value="cpc" className="text-gray-900">Case 2: Poor Ad Interest (CPC)</option>
              <option value="cpl" className="text-gray-900">Case 3: Landing Page Leaks (CPL)</option>
              <option value="cpa" className="text-gray-900">Case 4: Sales Closing Issues (CPA)</option>
            </select>
          </div>
        </div>
        <button 
          onClick={downloadTemplates}
          className="px-3 py-1.5 text-[13px] text-gray-600 font-medium hover:bg-gray-50 rounded transition-colors whitespace-nowrap"
        >
          Download Templates
        </button>
      </div>
      <Toast 
        message={showVerticalToast ? `Diagnosis updated for ${activeBenchmarks.name}` : null} 
        onClose={() => setShowVerticalToast(false)} 
      />
    </header>
  );
};
