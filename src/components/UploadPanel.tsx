import React, { useRef, useState } from 'react';
import { BarChart3, Monitor, ClipboardList, Users, Upload, CheckCircle2, Loader2, Info, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { 
  parseCampaignCSV, 
  parseLandingCSV, 
  parseFormCSV, 
  parseSalesCSV 
} from '../utils/csvParser';
import { cn } from '../lib/utils';
import { Toast } from './Toast';

interface UploadRowProps {
  id: string;
  title: string;
  tags: string[];
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  isUploaded: boolean;
  fileName?: string;
  onFileSelect: (file: File) => void;
}

const UploadRow = ({ 
  title, 
  tags, 
  icon, 
  iconBg, 
  iconColor, 
  isUploaded, 
  fileName, 
  onFileSelect 
}: UploadRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-0">
      <div className={cn("w-9 h-9 rounded-md flex items-center justify-center mr-4 shrink-0", iconBg, iconColor)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="text-[14px] font-medium text-gray-900 truncate">{title}</h3>
        <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5 tracking-tight capitalize">
          {tags.join(', ')}
        </p>
      </div>
      
      <div className="shrink-0">
        {isUploaded ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={18} className="text-[#10B981]" fill="currentColor" fillOpacity={0.1} />
            <span className="text-[10px] text-gray-400 truncate max-w-[80px]">Success</span>
          </div>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Upload
          </button>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept=".csv"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

export const UploadPanel = () => {
  const { 
    campaignData, setCampaignData,
    landingData, setLandingData,
    formData, setFormData,
    salesData, setSalesData,
    isAnalyzing, setIsAnalyzing,
    setResults
  } = useStore();

  const [error, setError] = useState<string | null>(null);

  const canRun = !!(campaignData || landingData || formData || salesData);

  const handleRunDiagnosis = async () => {
    if (!canRun) return;
    
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Diagnostic is now reactive in BenchmarkContext via useEffect
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col shadow-sm">
        <div className="mb-6">
          <h2 className="text-gray-900 text-[15px] font-semibold tracking-tight">Data Sources</h2>
          <p className="text-gray-400 text-[13px] mt-0.5">Upload at least one CSV file to begin diagnosis</p>
        </div>

        <div className="flex flex-col">
          <UploadRow 
            id="campaign"
            title="Campaign Performance"
            tags={['date', 'campaign_name', 'spend', 'leads']}
            icon={<BarChart3 size={20} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
            isUploaded={!!campaignData}
            fileName="campaigns.csv"
            onFileSelect={async (file) => {
              try {
                const data = await parseCampaignCSV(file);
                setCampaignData(data);
              } catch (err: any) {
                setError(err.message);
              }
            }}
          />
          <UploadRow 
            id="landing"
            title="Landing Page Analytics"
            tags={['views', 'form_starts', 'bounce_rate']}
            icon={<Monitor size={20} />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-500"
            isUploaded={!!landingData}
            fileName="landing.csv"
            onFileSelect={async (file) => {
              try {
                const data = await parseLandingCSV(file);
                setLandingData(data);
              } catch (err: any) {
                setError(err.message);
              }
            }}
          />
          <UploadRow 
            id="form"
            title="Form Funnel Data"
            tags={['step', 'question', 'type', 'dropped']}
            icon={<ClipboardList size={20} />}
            iconBg="bg-violet-50"
            iconColor="text-violet-500"
            isUploaded={!!formData}
            fileName="form.csv"
            onFileSelect={async (file) => {
              try {
                const data = await parseFormCSV(file);
                setFormData(data);
              } catch (err: any) {
                setError(err.message);
              }
            }}
          />
          <UploadRow 
            id="sales"
            title="Sales CRM Feedback"
            tags={['qualified', 'signed', 'feedback']}
            icon={<Users size={20} />}
            iconBg="bg-teal-50"
            iconColor="text-teal-500"
            isUploaded={!!salesData}
            fileName="sales.csv"
            onFileSelect={async (file) => {
              try {
                const data = await parseSalesCSV(file);
                setSalesData(data);
              } catch (err: any) {
                setError(err.message);
              }
            }}
          />
        </div>

        <button 
          onClick={handleRunDiagnosis}
          disabled={!canRun || isAnalyzing}
          className={cn(
            "mt-8 w-full h-[48px] rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm text-[15px]",
            canRun && !isAnalyzing 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing funnel...</span>
            </>
          ) : (
            <span>Run Diagnosis</span>
          )}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-gray-900 text-[14px] font-semibold mb-4 flex items-center gap-2">
          <Zap size={16} className="text-emerald-500" />
          Quick Start Guide
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">Select Vertical</p>
              <p className="text-[11px] text-gray-500 mt-1">Pick your industry in the header to load specific benchmarks.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">Load Simulation</p>
              <p className="text-[11px] text-gray-500 mt-1">Use "Test Scenarios" dropdown (blue button in header) for instant demo data.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">Review Bottleneck</p>
              <p className="text-[11px] text-gray-500 mt-1">Our agent flags the most upstream issue that needs fixing first.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-[12px] text-blue-700 leading-normal flex">
          <Info size={16} className="mr-2 mt-0.5 shrink-0" />
          Diagnostic engine utilizes a multi-vertical benchmark system with configurable thresholds.
        </p>
      </div>

      <Toast message={error} onClose={() => setError(null)} />
    </div>
  );
};
