import React from 'react';
import { Activity, Zap, Monitor, Filter, Phone, CheckCircle2, AlertTriangle, AlertCircle, Info, Download, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useBenchmarks } from '../BenchmarkContext';
import { cn } from '../lib/utils';
import { Severity } from '../types';
import { DecisionFlow } from './DecisionFlow';

const MetricCard = ({ label, value, status, hasBorder = true }: { label: string, value: string, status: Severity, hasBorder?: boolean }) => {
  const dotColor = {
    good: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    critical: 'bg-[#EF4444]',
    info: 'bg-[#6366F1]'
  };

  return (
    <div className={cn("p-5 flex-1 bg-gray-50/50", hasBorder && "border-r border-gray-100")}>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-[24px] font-semibold tracking-tight text-gray-900 leading-none">{value}</span>
        <div className={cn("w-2 h-2 rounded-full", dotColor[status])} />
      </div>
    </div>
  );
};

const FindingRow = ({ title, detail, severity }: { title: string, detail: string, severity: Severity, key?: string }) => {
  const statusColor = {
    critical: 'bg-red-500 border-red-100',
    warning: 'bg-amber-500 border-amber-100',
    info: 'bg-blue-500 border-blue-100',
    good: 'bg-emerald-500 border-emerald-100'
  };

  return (
    <div className="flex items-center py-3 px-2 border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <span className={cn("w-4 h-4 rounded-full mr-3 border-4", statusColor[severity])}></span>
      <span className="text-[14px] flex-1 font-medium text-gray-800">{title}</span>
      <span className="text-[13px] text-gray-500">{detail}</span>
    </div>
  );
};

const RootCauseCard = ({ title, severity, icon }: { title: string, severity: Severity, icon: string, key?: React.Key }) => {
  const IconMap: Record<string, React.ReactNode> = {
    zap: <Zap size={14} />,
    monitor: <Monitor size={14} />,
    filter: <Filter size={14} />,
    phone: <Phone size={14} />,
    tag: <Tag size={14} />
  };

  const styleMap = {
    critical: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    info: "bg-blue-50 text-blue-700 border-blue-200"
  };

  const dotColor = {
    critical: 'text-red-500',
    warning: 'text-amber-500',
    good: 'text-emerald-500',
    info: 'text-blue-500'
  };

  return (
    <div className={cn("flex items-center px-4 py-2 border rounded-lg", styleMap[severity])}>
      <span className={cn("mr-2 text-[10px]", dotColor[severity])}>●</span>
      <span className="text-[13px] font-medium">{title}</span>
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

        <div className="mt-12 flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
          <Info size={14} className="text-blue-600" />
          <span className="text-[12px] font-medium text-blue-700">Currently testing for: {activeBenchmarks.name} vertical</span>
        </div>
      </section>
    );
  }

  const firstFailureId = results.decisionFlow.find(s => s.isFirstFailure)?.id;

  return (
    <section className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* 0. Header with Vertical Name */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/30">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Diagnostic Results — {activeBenchmarks.name}</p>
      </div>

      {/* 1. Decision Flow */}
      <div className="border-b border-gray-100">
        <DecisionFlow steps={results.decisionFlow} />
      </div>

      {/* 2. Summary Metrics */}
      <div className={cn("grid grid-cols-4 border-b border-gray-100 bg-gray-50/20", firstFailureId && firstFailureId !== 'cpa' && "opacity-40 grayscale pointer-events-none")}>
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
          label="CPA (Northstar)" 
          value={`$${results.metrics.avgCPA.toFixed(0)}`} 
          status={results.metrics.signRateStatus} 
          hasBorder={false}
        />
      </div>

      <div className={cn("flex-1 flex flex-col", firstFailureId && firstFailureId !== 'cpa' && "opacity-40 grayscale pointer-events-none")}>
        {/* 3. Root Causes */}
        <div className="px-6 pt-5">
          <h3 className="text-[15px] font-semibold mb-3">Secondary Level Findings</h3>
          <div className="flex flex-wrap gap-3">
            {results.rootCauses.map((rc, i) => (
              <RootCauseCard key={i} title={rc.title} severity={rc.severity} icon={rc.icon} />
            ))}
            {results.rootCauses.length === 0 && (
              <span className="text-sm text-gray-400 italic">No specific root cause patterns identified.</span>
            )}
          </div>
        </div>

        {/* 3. Findings List */}
        <div className="px-6 mt-8">
          <h3 className="text-[15px] font-semibold mb-2">Findings</h3>
          <div className="border-t border-gray-100">
            {results.findings.length > 0 ? (
              results.findings.map((f) => (
                <FindingRow key={f.id} title={f.title} detail={f.detail} severity={f.severity} />
              ))
            ) : (
              <div className="py-4 px-2 text-sm text-[#10B981] font-medium">
                No critical issues detected in campaign funnel.
              </div>
            )}
          </div>
        </div>

        {/* 4. Recommendations */}
        <div className="px-6 mt-8 pb-6">
          <h3 className="text-[15px] font-semibold mb-3">Recommendations</h3>
          <div className="space-y-2">
            {results.recommendations.map((r, i) => (
              <div key={r.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:border-blue-100 transition-colors">
                <div className="w-5 h-5 bg-blue-100 text-[#2563EB] text-[11px] font-bold flex items-center justify-center rounded-full mr-4">
                  {i + 1}
                </div>
                <span className="text-[14px] flex-1 font-normal text-gray-800">{r.text}</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                  {r.impact} Impact
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Actions */}
      <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
        <button className="px-4 py-2 border border-gray-200 text-[13px] text-gray-500 font-medium rounded-lg hover:bg-gray-50 flex items-center transition-colors shadow-sm">
          <Download size={14} className="mr-2" />
          Export Diagnosis Report
        </button>
      </div>
    </section>
  );
};
