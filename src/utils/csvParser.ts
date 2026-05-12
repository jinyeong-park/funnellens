import Papa from 'papaparse';
import { 
  CampaignData, 
  LandingPageData, 
  FormQuestionData, 
  SalesData 
} from '../types';

export const parseCampaignCSV = (file: File): Promise<CampaignData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const required = ['date', 'campaign_name', 'impressions', 'clicks', 'spend', 'leads'];
        const headers = results.meta.fields || [];
        const missing = required.filter(col => !headers.includes(col));
        
        if (missing.length > 0) {
          reject(new Error(`Missing column: ${missing.join(', ')}`));
          return;
        }
        resolve(results.data as CampaignData[]);
      },
      error: (error) => reject(error)
    });
  });
};

export const parseLandingCSV = (file: File): Promise<LandingPageData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const required = ['date', 'page_views', 'form_starts', 'form_submits', 'bounce_rate', 'avg_time_on_page_sec'];
        const headers = results.meta.fields || [];
        const missing = required.filter(col => !headers.includes(col));
        
        if (missing.length > 0) {
          reject(new Error(`Missing column: ${missing.join(', ')}`));
          return;
        }
        resolve(results.data as LandingPageData[]);
      },
      error: (error) => reject(error)
    });
  });
};

export const parseFormCSV = (file: File): Promise<FormQuestionData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const required = ['step', 'question', 'type', 'started', 'completed'];
        const headers = results.meta.fields || [];
        const missing = required.filter(col => !headers.includes(col));
        
        if (missing.length > 0) {
          reject(new Error(`Missing column: ${missing.join(', ')}`));
          return;
        }
        resolve(results.data as FormQuestionData[]);
      },
      error: (error) => reject(error)
    });
  });
};

export const parseSalesCSV = (file: File): Promise<SalesData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const required = ['total_leads', 'calls_connected', 'qualified_calls', 'cases_signed'];
        const headers = results.meta.fields || [];
        const missing = required.filter(col => !headers.includes(col));
        
        if (missing.length > 0) {
          reject(new Error(`Missing column: ${missing.join(', ')}`));
          return;
        }
        // Take the first row for Sales Data MVP
        const data = results.data[0] as SalesData;
        resolve(data);
      },
      error: (error) => reject(error)
    });
  });
};
