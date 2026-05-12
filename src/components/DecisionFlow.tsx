import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { DecisionStep } from '../types';
import { cn } from '../lib/utils';

interface DecisionFlowProps {
  steps: DecisionStep[];
}

export const DecisionFlow: React.FC<DecisionFlowProps> = ({ steps }) => {
  const firstFailure = steps.find(s => s.isFirstFailure);

  return (
    <div className="px-6 py-8">
      <h3 className="text-[15px] font-semibold mb-6 flex items-center gap-2">
        Priority Diagnostic Flow
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">(Northstar: CPA)</span>
      </h3>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 lg:gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex-1">
              <div className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-500 bg-white",
                step.status === 'fail' && step.isFirstFailure 
                  ? "border-red-200 bg-red-50/30 ring-4 ring-red-50 shadow-md" 
                  : step.status === 'pass'
                  ? "border-emerald-100 bg-emerald-50/10"
                  : "border-gray-100 opacity-60 grayscale"
              )}>
                <div className="flex flex-col mb-4">
                  <div className={cn(
                    "text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5",
                    step.status === 'fail' ? "text-red-600" : step.status === 'pass' ? "text-emerald-600" : "text-gray-400"
                  )}>
                    {step.status === 'fail' ? (
                      <AlertTriangle size={11} fill="currentColor" fillOpacity={0.2} />
                    ) : step.status === 'pass' ? (
                      <CheckCircle2 size={11} fill="currentColor" fillOpacity={0.2} />
                    ) : (
                      <Circle size={11} />
                    )}
                    Step {index + 1}
                  </div>
                  <h4 className="text-[13px] font-bold text-gray-900 leading-tight">
                    {step.label.includes('. ') ? step.label.split('. ')[1].split(' (')[0] : step.label}
                  </h4>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[20px] font-mono font-bold text-gray-900 leading-none">
                      {step.id === 'cpm' || step.id === 'cpc' || step.id === 'cpl' || step.id === 'cpa' ? '$' : ''}
                      {step.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1.5 uppercase tracking-wider">
                      Target: &lt; {step.id === 'cpm' || step.id === 'cpc' || step.id === 'cpl' || step.id === 'cpa' ? '$' : ''}{step.target.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex lg:hidden items-center justify-center -my-2 opacity-30">
                <div className="w-0.5 h-4 bg-gray-300" />
              </div>
            )}

            {index < steps.length - 1 && (
              <div className="hidden lg:flex items-center justify-center py-4">
                <ArrowRight size={20} className={cn(
                  "transition-colors",
                  steps[index].status === 'pass' ? "text-emerald-300" : "text-gray-100"
                )} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence>
        {firstFailure && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-5 bg-red-600 rounded-xl text-white shadow-xl shadow-red-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <AlertTriangle size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} fill="white" className="text-red-600" />
                <h4 className="font-bold text-[15px] uppercase tracking-wide">Critical Diagnostic Blocking: {firstFailure.id.toUpperCase()}</h4>
              </div>
              <p className="text-[15px] font-medium leading-relaxed">
                {firstFailure.alert}
              </p>
              <div className="mt-4 flex gap-4 text-[12px] font-bold uppercase tracking-widest text-red-100">
                <span>Priority: High</span>
                <span>Diagnosis: Blocking</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!firstFailure && steps.every(s => s.status === 'pass') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-5 bg-emerald-600 rounded-xl text-white shadow-xl shadow-emerald-100"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} fill="white" className="text-emerald-600" />
            <h4 className="font-bold text-[15px] uppercase tracking-wide">Flow Status: Optimized</h4>
          </div>
          <p className="mt-1 text-[15px] font-medium">All funnel layers passing benchmarks. Focus on scale and creative testing.</p>
        </motion.div>
      )}
    </div>
  );
};
