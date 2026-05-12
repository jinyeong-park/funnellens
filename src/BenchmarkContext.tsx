import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { BenchmarkSet, ChangeLogEntry } from './types';
import { BENCHMARK_DEFAULTS } from './config/benchmarks';
import { useStore } from './store/useStore';
import { runDiagnostic } from './utils/diagnosticEngine';

interface BenchmarkContextType {
  activeVertical: string;
  setActiveVertical: (id: string) => void;
  activeBenchmarks: BenchmarkSet;
  overrides: Record<string, Partial<BenchmarkSet>>;
  updateThreshold: (fieldPath: string, newValue: number, reason: string) => void;
  resetToDefaults: () => void;
  changeHistory: ChangeLogEntry[];
  version: number;
}

const BenchmarkContext = createContext<BenchmarkContextType | undefined>(undefined);

export const BenchmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeVertical, setActiveVertical] = useState('legal-mva');
  const [overrides, setOverrides] = useState<Record<string, Partial<BenchmarkSet>>>({});
  const [changeHistory, setChangeHistory] = useState<ChangeLogEntry[]>([]);
  const [version, setVersion] = useState(1);

  const { campaignData, landingData, formData, salesData, setResults } = useStore();

  const activeBenchmarks = useMemo(() => {
    const defaults = BENCHMARK_DEFAULTS[activeVertical];
    const verticalOverrides = overrides[activeVertical] || {};
    
    // Deep merge for nested objects like thresholds
    const merged = { ...defaults };
    Object.entries(verticalOverrides).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        (merged as any)[key] = { ...(merged as any)[key], ...value };
      } else {
        (merged as any)[key] = value;
      }
    });
    
    return merged as BenchmarkSet;
  }, [activeVertical, overrides]);

  const updateThreshold = (fieldPath: string, newValue: number, reason: string) => {
    setOverrides(prev => {
      const verticalOverrides = prev[activeVertical] || {};
      const newOverrides = { ...prev };
      
      // Handle nested paths like 'cpm.good'
      if (fieldPath.includes('.')) {
        const [parent, child] = fieldPath.split('.');
        const parentObj = (verticalOverrides as any)[parent] || {};
        newOverrides[activeVertical] = {
          ...verticalOverrides,
          [parent]: {
            ...parentObj,
            [child]: newValue
          }
        };
      } else {
        newOverrides[activeVertical] = {
          ...verticalOverrides,
          [fieldPath]: newValue
        };
      }
      
      return newOverrides;
    });

    const oldValue = fieldPath.includes('.') 
      ? (activeBenchmarks as any)[fieldPath.split('.')[0]][fieldPath.split('.')[1]]
      : (activeBenchmarks as any)[fieldPath];

    const newEntry: ChangeLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      verticalId: activeVertical,
      fieldPath,
      oldValue,
      newValue,
      reason,
      changedBy: 'System User'
    };

    setChangeHistory(prev => [newEntry, ...prev]);
    setVersion(v => v + 1);
  };

  const resetToDefaults = () => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[activeVertical];
      return next;
    });

    const newEntry: ChangeLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      verticalId: activeVertical,
      fieldPath: 'all',
      oldValue: 'Custom',
      newValue: 'Default',
      reason: 'Reset to system defaults',
      changedBy: 'System User'
    };

    setChangeHistory(prev => [newEntry, ...prev]);
    setVersion(v => v + 1);
  };

  // Re-run diagnosis when vertical or benchmarks change
  useEffect(() => {
    if (campaignData || landingData || formData || salesData) {
      const results = runDiagnostic(campaignData, landingData, formData, salesData, activeBenchmarks);
      setResults(results);
    } else {
      setResults(null);
    }
  }, [activeBenchmarks, campaignData, landingData, formData, salesData, setResults]);

  return (
    <BenchmarkContext.Provider value={{
      activeVertical,
      setActiveVertical,
      activeBenchmarks,
      overrides,
      updateThreshold,
      resetToDefaults,
      changeHistory,
      version
    }}>
      {children}
    </BenchmarkContext.Provider>
  );
};

export const useBenchmarks = () => {
  const context = useContext(BenchmarkContext);
  if (!context) {
    throw new Error('useBenchmarks must be used within a BenchmarkProvider');
  }
  return context;
};
