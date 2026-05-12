export type Severity = 'critical' | 'warning' | 'good' | 'info';

export interface Thresholds {
  good: number;
  avg: number;
  bad: number;
}

export interface BenchmarkSet {
  id: string;
  name: string;
  cpm: Thresholds;
  ctr: Thresholds;
  cpc: number; // Max target CPC
  cpl: Thresholds;
  cpa: number; // Max target CPA
  landingPageCvr: Thresholds;
  bounceRateMax: number;
  avgTimeMinSec: number;
  qualificationDropoffMin: number;
  qualificationDropoffMax: number;
  frictionDropoffMax: number;
  frictionHeavyDropoffMax: number;
  leadToQualifiedRate: Thresholds;
  qualifiedToSignRate: Thresholds;
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  verticalId: string;
  fieldPath: string;
  oldValue: number | string;
  newValue: number | string;
  reason: string;
  changedBy: string;
}

export interface CampaignData {
  date: string;
  campaign_name: string;
  impressions: number;
  clicks: number;
  spend: number;
  leads: number;
}

export interface LandingPageData {
  date: string;
  page_views: number;
  form_starts: number;
  form_submits: number;
  bounce_rate: number;
  avg_time_on_page_sec: number;
}

export interface FormQuestionData {
  step: number;
  question: string;
  type: 'qualification' | 'friction' | 'friction_heavy';
  started: number;
  completed: number;
}

export interface SalesData {
  total_leads: number;
  calls_connected: number;
  qualified_calls: number;
  cases_signed: number;
  sales_feedback?: string;
}

export interface Finding {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
}

export interface Recommendation {
  id: string;
  text: string;
  impact: string;
}

export interface DecisionStep {
  id: 'cpm' | 'cpc' | 'cpl' | 'cpa';
  label: string;
  value: number;
  target: number;
  status: 'pending' | 'fail' | 'pass';
  alert?: string;
  isFirstFailure?: boolean;
}

export interface DiagnosticResults {
  metrics: {
    totalSpend: number;
    avgCPM: number;
    avgCPC: number;
    avgCTR: number;
    avgCPL: number;
    avgCPA: number;
    overallCVR: number;
    leadSignRate: number;
    spendStatus: Severity;
    cplStatus: Severity;
    cvrStatus: Severity;
    signRateStatus: Severity;
  };
  decisionFlow: DecisionStep[];
  findings: Finding[];
  recommendations: Recommendation[];
  rootCauses: {
    title: string;
    severity: Severity;
    icon: string;
  }[];
}
