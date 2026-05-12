import React from 'react';
import { Activity, Zap, Monitor, Filter, Phone, CheckCircle2, AlertTriangle, AlertCircle, Info, Download, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useBenchmarks } from '../BenchmarkContext';
import { cn } from '../lib/utils';
import { Severity } from '../types';
import { DecisionFlow } from './DecisionFlow';

const MetricCard = ({ label, value, status, hasBorder = true }: { label: string, value: string, status: Severity, hasBorder?: boolean }) => {
  const dotColor = {
    good: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    info: 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]'
  };

  return (
    <div className={cn(
      "p-6 flex-1 bg-white relative group transition-all duration-300", 
      hasBorder && "sm:border-r border-gray-100 border-b sm:border-b-0"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-2">{label}</p>
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] sm:text-[26px] font-black tracking-tight text-slate-900 leading-none">{value}</span>
          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor[status])} />
        </div>
      </div>
    </div>
  );
};

const FindingRow = ({ title, detail, severity }: { title: string, detail: string, severity: Severity }) => {
  const styles = {
    critical: 'bg-red-50 text-red-700 border-red-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    good: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  return (
    <div className="flex items-center gap-4 py-3.5 px-4 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all duration-200">
      <div className={cn("w-2 h-2 rounded-full shrink-0", 
        severity === 'critical' ? 'bg-red-500' : 
        severity === 'warning' ? 'bg-amber-500' : 
        severity === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
      )} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-slate-800 leading-tight mb-0.5">{title}</p>
        <p className="text-[12px] text-slate-400 truncate font-medium">{detail}</p>
      </div>
      <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border", styles[severity])}>
        {severity}
      </span>
    </div>
  );
};

const RootCauseCard = ({ title, severity }: { title: string, severity: Severity, icon: string }) => {
  const styleMap = {
    critical: "bg-white text-red-600 border-red-100 shadow-sm",
    warning: "bg-white text-amber-600 border-amber-100 shadow-sm",
    good: "bg-white text-emerald-600 border-emerald-100 shadow-sm",
    info: "bg-white text-blue-600 border-blue-100 shadow-sm"
  };

  return (
    <div className={cn("flex items-center px-3.5 py-1.5 border rounded-full transition-all hover:scale-105 cursor-default", styleMap[severity])}>
      <span className="w-1.5 h-1.5 rounded-full mr-2 bg-current" />
      <span className="text-[12px] font-black tracking-tight">{title}</span>
    </div>
  );
};

export const ResultsPanel = () => {
  const { results, isAnalyzing } = useStore();
  const { activeBenchmarks } = useBenchmarks();

  if (isAnalyzing) {
    return (
      <section className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg min-h-[600px] items-center justify-center text-center p-12">
        <Activity size={48} className="text-blue-100 animate-pulse mb-4" />
        <h3 className="text-gray-800 text-lg font-medium">Analyzing Funnel Performance</h3>
        <p className="text-gray-400 mt-1 max-w-[320px] text-[14px]">
          Our diagnostic engine is triangulating data across all sources to identify bottleneck root causes for {activeBenchmarks.name}.
        </p>
      </section>
    );
  }

  if (!results) {
    return (
      <section className="flex-1 flex flex-col bg-white border border-gray-200 border-dashed rounded-xl min-h-[600px] items-center justify-center text-center p-12 shadow-sm">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-sm border border-blue-100">
          <Activity size={40} className="text-blue-500 -rotate-3" />
        </div>
        <h3 className="text-gray-900 text-[24px] font-bold tracking-tight mb-3">Welcome to FunnelLens Diagnostic</h3>
        <p className="text-gray-500 text-[15px] leading-relaxed max-w-[380px] mb-10">
          The expert agent that triangulates your ad spend, landing page, and CRM data to find hidden bottlenecks.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[500px]">
          <div className="p-6 border border-gray-100 bg-gray-50/50 rounded-xl text-left hover:border-blue-200 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              <Download size={16} className="text-blue-500" />
            </div>
            <h4 className="font-bold text-[14px] text-gray-900 mb-1">Upload Your Data</h4>
            <p className="text-[12px] text-gray-500 leading-normal">
              Drop 4 CSV files into the left panel to run a full diagnostic scan.
            </p>
          </div>
          
          <div className="p-6 border border-gray-100 bg-gray-50/50 rounded-xl text-left hover:border-emerald-200 transition-all group border-dashed">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              <Zap size={16} className="text-emerald-500" />
            </div>
            <h4 className="font-bold text-[14px] text-gray-900 mb-1">Try a Demo</h4>
            <p className="text-[12px] text-gray-500 leading-normal">
              Use the "Test Scenarios" dropdown in the header to instantly load sample data.
            </p>
          </div>
        </div>

        <div className="mt-12 w-full max-w-[600px] border-t border-gray-100 pt-8">
          <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6">Simple Terms Guide</h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-left">
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-1">CPM (Ad Visibility)</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Cost to be seen. High CPM means your target audience is expensive or hard to reach.</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-1">CPC (Interest Cost)</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Cost per click. High CPC usually means your ad creative isn't catching people's attention.</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-1">CPL (Lead Cost)</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Cost to get a contact. High CPL means your landing page or form is scaring people away.</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-800 mb-1">CPA (Client Cost)</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Cost to sign a client. This is the ultimate 'Northstar' metric for your business.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
          <Info size={14} className="text-blue-600" />
          <span className="text-[12px] font-medium text-blue-700">Currently testing for: {activeBenchmarks.name} vertical</span>
        </div>
      </section>
    );
  }

  const firstFailureId = results.decisionFlow.find(s => s.isFirstFailure)?.id;

  return (
    <section className="flex-1 flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 blur-3xl -mr-16 -mt-16 rounded-full" />
      
      {/* 0. Header with Vertical Name */}
      <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
          <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Diagnostic Report</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-full">
           <span className="text-[10px] text-white font-bold tracking-tight">{activeBenchmarks.name} Analysis</span>
        </div>
      </div>

      {/* 1. Decision Flow */}
      <div className="border-b border-gray-100 bg-white shadow-sm relative z-10">
        <DecisionFlow steps={results.decisionFlow} />
      </div>

      {/* 2. Summary Metrics */}
      <div className={cn(
        "grid grid-cols-2 lg:grid-cols-4 border-b border-gray-100", 
        firstFailureId && firstFailureId !== 'cpa' && "opacity-40 grayscale pointer-events-none"
      )}>
        <MetricCard 
          label="Total Spend" 
          value={`$${(results.metrics.totalSpend / 1000).toFixed(1)}k`} 
          status={results.metrics.spendStatus} 
        />
        <MetricCard 
          label="Avg CPL" 
          value={`$${results.metrics.avgCPL.toFixed(0)}`} 
          status={results.metrics.cplStatus} 
        />
        <MetricCard 
          label="Overall CVR" 
          value={`${results.metrics.overallCVR.toFixed(1)}%`} 
          status={results.metrics.cvrStatus} 
        />
        <MetricCard 
          label="Avg CPA" 
          value={`$${results.metrics.avgCPA.toFixed(0)}`} 
          status={results.metrics.signRateStatus} 
          hasBorder={false}
        />
      </div>

      <div className={cn("flex-1 flex flex-col relative z-0", firstFailureId && firstFailureId !== 'cpa' && "opacity-40 grayscale pointer-events-none")}>
        {/* 3. Root Causes */}
        <div className="px-8 pt-8">
          <div className="flex items-center gap-4 mb-5">
            <h3 className="text-[15px] font-black tracking-tight text-slate-900 shrink-0">Root Cause Chips</h3>
            <div className="h-px bg-slate-100 flex-1" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {results.rootCauses.map((rc, i) => (
              <RootCauseCard key={i} title={rc.title} severity={rc.severity} icon={rc.icon} />
            ))}
            {results.rootCauses.length === 0 && (
              <span className="text-[13px] text-slate-400 italic">Universal funnel health detected. No specific root cause identified.</span>
            )}
          </div>
        </div>

        {/* 3. Findings List */}
        <div className="px-8 mt-10">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-[15px] font-black tracking-tight text-slate-900 shrink-0">Key Findings</h3>
            <div className="h-px bg-slate-100 flex-1" />
          </div>
          <div className="space-y-1">
            {results.findings.length > 0 ? (
              results.findings.map((f) => (
                <FindingRow key={f.id} title={f.title} detail={f.detail} severity={f.severity} />
              ))
            ) : (
              <div className="py-6 px-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-[13px] text-emerald-700 font-bold flex items-center gap-3">
                <CheckCircle2 size={16} />
                Your funnel metrics are currently within high-performance benchmarks.
              </div>
            )}
          </div>
        </div>

        {/* 4. Recommendations */}
        <div className="px-8 mt-10 pb-10">
          <div className="flex items-center gap-4 mb-5">
            <h3 className="text-[15px] font-black tracking-tight text-slate-900 shrink-0">Strategy Roadmap</h3>
            <div className="h-px bg-slate-100 flex-1" />
          </div>
          <div className="grid gap-3">
            {results.recommendations.map((r, i) => (
              <div key={r.id} className="group flex flex-col sm:flex-row sm:items-center p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-7 h-7 bg-slate-900 text-white text-[11px] font-black flex items-center justify-center rounded-lg rotate-3 group-hover:rotate-0 transition-transform shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                      {r.text}
                    </span>
                    <p className="text-[11px] text-slate-400 font-medium">Implementation priority: Highly Recommended</p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-end">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border",
                    r.impact === 'High' ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-50 text-slate-500 border-slate-100'
                  )}>
                    {r.impact} Impact Scale
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Actions */}
      <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Agent Live Audit</span>
        </div>
        <button className="px-6 py-2.5 bg-slate-950 text-white text-[12px] font-black rounded-xl hover:bg-slate-800 flex items-center transition-all shadow-lg active:scale-95">
          <Download size={14} className="mr-2" />
          Export Intelligence Brief
        </button>
      </div>
    </section>
  );
};
