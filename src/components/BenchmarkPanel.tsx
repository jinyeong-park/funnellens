import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, History, RotateCcw, X, Clock } from 'lucide-react';
import { useBenchmarks } from '../BenchmarkContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const BenchmarkPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { activeBenchmarks, resetToDefaults, activeVertical, version, changeHistory } = useBenchmarks();

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all">
        {/* Collapsible Header */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-transparent data-[expanded=true]:border-gray-100"
          data-expanded={isExpanded}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-[14px] font-semibold text-gray-800">Benchmark Configuration</h3>
            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              v{version}.0
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="text-[12px] font-medium">{activeBenchmarks.name}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-0">
                <table className="w-full text-[13px]">
                  <tbody>
                    <BenchmarkRow label="CPM Threshold (Bad)" value={`$${activeBenchmarks.cpm.bad}`} />
                    <BenchmarkRow label="CTR Threshold (Bad)" value={`${activeBenchmarks.ctr.bad}%`} isGray />
                    <BenchmarkRow label="CPL Threshold (Bad)" value={`$${activeBenchmarks.cpl.bad}`} />
                    <BenchmarkRow label="Landing CVR (Bad)" value={`${activeBenchmarks.landingPageCvr.bad}%`} isGray />
                    <BenchmarkRow label="Max Bounce Rate" value={`${(activeBenchmarks.bounceRateMax * 100).toFixed(0)}%`} />
                    <BenchmarkRow label="Min Time on Page" value={`${activeBenchmarks.avgTimeMinSec}s`} isGray />
                    <BenchmarkRow label="Qual Drop-off (Max)" value={`${activeBenchmarks.qualificationDropoffMax}%`} />
                    <BenchmarkRow label="Friction (Max)" value={`${activeBenchmarks.frictionDropoffMax}%`} isGray />
                  </tbody>
                </table>

                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] font-medium">
                    <Clock size={12} />
                    Last updated {changeHistory.length > 0 ? new Date(changeHistory[0].timestamp).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsHistoryOpen(true)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                      title="View Change History"
                    >
                      <History size={16} />
                    </button>
                    <button 
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-blue-600 hover:bg-blue-50 rounded transition-all"
                    >
                      <Edit3 size={14} />
                      Edit Thresholds
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EditThresholdsModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      
      <HistorySideSheet 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>
  );
};

const BenchmarkRow = ({ label, value, isGray = false }: { label: string, value: string, isGray?: boolean }) => (
  <tr className={cn("h-9 border-b border-gray-50 last:border-0", isGray && "bg-gray-50/50")}>
    <td className="px-6 text-gray-500 font-medium">{label}</td>
    <td className="px-6 text-right font-mono font-medium text-gray-800">{value}</td>
  </tr>
);

const EditThresholdsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { activeBenchmarks, updateThreshold, resetToDefaults } = useBenchmarks();
  const [reason, setReason] = useState('');
  const [values, setValues] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const handleSave = () => {
    if (!reason) return;
    Object.entries(values).forEach(([path, val]) => {
      updateThreshold(path, val, reason);
    });
    setReason('');
    setValues({});
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore all defaults for this vertical?')) {
      resetToDefaults();
      onClose();
    }
  };

  const updateVal = (path: string, val: string) => {
    setValues(prev => ({ ...prev, [path]: parseFloat(val) }));
  };

  const getVal = (path: string) => {
    if (values[path] !== undefined) return values[path];
    const parts = path.split('.');
    if (parts.length === 2) return (activeBenchmarks as any)[parts[0]][parts[1]];
    return (activeBenchmarks as any)[path];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[560px] flex flex-col max-h-[80vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Edit Benchmarks — {activeBenchmarks.name}</h2>
            <p className="text-[13px] text-gray-400 mt-0.5">Changes are logged. Defaults can be restored anytime.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-500">Metric Name</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-500">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <EditRow label="CPM Good" path="cpm.good" value={getVal('cpm.good')} onChange={updateVal} />
              <EditRow label="CPM Average" path="cpm.avg" value={getVal('cpm.avg')} onChange={updateVal} />
              <EditRow label="CPM Bad" path="cpm.bad" value={getVal('cpm.bad')} onChange={updateVal} />
              <EditRow label="CTR Good %" path="ctr.good" value={getVal('ctr.good')} onChange={updateVal} />
              <EditRow label="CTR Bad %" path="ctr.bad" value={getVal('ctr.bad')} onChange={updateVal} />
              <EditRow label="CPL Bad $" path="cpl.bad" value={getVal('cpl.bad')} onChange={updateVal} />
              <EditRow label="Landing CVR Bad %" path="landingPageCvr.bad" value={getVal('landingPageCvr.bad')} onChange={updateVal} />
              <EditRow label="Max Bounce Rate" path="bounceRateMax" value={getVal('bounceRateMax')} onChange={updateVal} isRatio />
              <EditRow label="Min Time (Sec)" path="avgTimeMinSec" value={getVal('avgTimeMinSec')} onChange={updateVal} />
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-semibold text-gray-500 mb-1.5 block">Reason for change <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              placeholder="e.g., Client specific Q2 goals"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button 
              onClick={handleReset}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-[13px] font-medium px-2 py-1 transition-all"
            >
              <RotateCcw size={14} />
              Reset to Defaults
            </button>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!reason}
                className="px-5 py-2.5 text-[13px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EditRow = ({ label, path, value, onChange, isRatio = false }: { label: string, path: string, value: number, onChange: (p: string, v: string) => void, isRatio?: boolean }) => (
  <tr className="group">
    <td className="px-6 py-3 text-gray-600 font-medium">{label}</td>
    <td className="px-6 py-3">
      <input 
        type="number" 
        value={value} 
        step={isRatio ? "0.01" : "1"}
        onChange={(e) => onChange(path, e.target.value)}
        className="w-full text-right bg-transparent hover:bg-gray-50 border-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded p-1 font-mono font-medium text-gray-900 appearance-none focus:outline-none"
      />
    </td>
  </tr>
);

const HistorySideSheet = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { changeHistory } = useBenchmarks();

  return (
    <div className={cn("fixed inset-0 z-[60] flex justify-end invisible pointer-events-none", isOpen && "visible pointer-events-auto")}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/20" 
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={20} className="text-gray-400" />
            <h2 className="text-[16px] font-semibold text-gray-800">Benchmark Change History</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {changeHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <History size={48} className="text-gray-100 mb-4" />
              <p className="text-gray-400 text-sm">No manual changes yet — using system defaults</p>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
              {changeHistory.map((entry) => (
                <div key={entry.id} className="relative pl-8">
                  <div className={cn(
                    "absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-2 ring-transparent",
                    entry.fieldPath === 'all' ? "bg-blue-600" : "bg-blue-400"
                  )} />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-gray-800 leading-tight">
                      {entry.fieldPath === 'all' 
                        ? 'Reset all thresholds to defaults' 
                        : `Changed ${entry.fieldPath} from ${entry.oldValue} to ${entry.newValue}`}
                    </span>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap ml-4">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 italic mb-1">"{entry.reason}"</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                    {new Date(entry.timestamp).toLocaleDateString()} • {entry.changedBy}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
