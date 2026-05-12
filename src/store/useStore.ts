import { create } from 'zustand';
import { 
  CampaignData, 
  LandingPageData, 
  FormQuestionData, 
  SalesData, 
  DiagnosticResults 
} from '../types';

interface AppState {
  campaignData: CampaignData[] | null;
  landingData: LandingPageData[] | null;
  formData: FormQuestionData[] | null;
  salesData: SalesData | null;
  
  isAnalyzing: boolean;
  results: DiagnosticResults | null;
  
  setCampaignData: (data: CampaignData[] | null) => void;
  setLandingData: (data: LandingPageData[] | null) => void;
  setFormData: (data: FormQuestionData[] | null) => void;
  setSalesData: (data: SalesData | null) => void;
  
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setResults: (results: DiagnosticResults | null) => void;
  
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  campaignData: null,
  landingData: null,
  formData: null,
  salesData: null,
  
  isAnalyzing: false,
  results: null,
  
  setCampaignData: (data) => set({ campaignData: data }),
  setLandingData: (data) => set({ landingData: data }),
  setFormData: (data) => set({ formData: data }),
  setSalesData: (data) => set({ salesData: data }),
  
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setResults: (results) => set({ results }),
  
  reset: () => set({ 
    campaignData: null, 
    landingData: null, 
    formData: null, 
    salesData: null, 
    results: null 
  }),
}));
