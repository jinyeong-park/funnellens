import { 
  CampaignData, 
  LandingPageData, 
  FormQuestionData, 
  SalesData, 
  DiagnosticResults,
  Finding,
  Recommendation,
  Severity,
  BenchmarkSet
} from '../types';

export const runDiagnostic = (
  campaigns: CampaignData[] | null,
  landing: LandingPageData[] | null,
  form: FormQuestionData[] | null,
  sales: SalesData | null,
  benchmarks: BenchmarkSet
): DiagnosticResults => {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  const rootCauses: { title: string; severity: Severity; icon: string }[] = [];

  // 1. Campaign Metrics
  const safeCampaigns = campaigns || [];
  const totalSpend = safeCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalClicks = safeCampaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalImpressions = safeCampaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalLeads = safeCampaigns.reduce((acc, c) => acc + c.leads, 0);

  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPM = totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0;
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const avgCPA = (sales && sales.cases_signed > 0) ? totalSpend / sales.cases_signed : 0;

  // 2. Landing Page Metrics
  const safeLanding = landing || [];
  const totalViews = safeLanding.reduce((acc, l) => acc + l.page_views, 0);
  const totalStarts = safeLanding.reduce((acc, l) => acc + l.form_starts, 0);
  const totalSubmits = safeLanding.reduce((acc, l) => acc + l.form_submits, 0);
  const avgBounce = safeLanding.length > 0 ? safeLanding.reduce((acc, l) => acc + l.bounce_rate, 0) / safeLanding.length : 0;
  const avgTime = safeLanding.length > 0 ? safeLanding.reduce((acc, l) => acc + l.avg_time_on_page_sec, 0) / safeLanding.length : 0;

  const overallCVR = totalViews > 0 ? (totalSubmits / totalViews) * 100 : 0;

  // 3. Sales Metrics
  const qualRate = (sales && sales.total_leads > 0) ? (sales.qualified_calls / sales.total_leads) * 100 : 0;
  const signRate = (sales && sales.qualified_calls > 0) ? (sales.cases_signed / sales.qualified_calls) * 100 : 0;
  const leadSignRate = (sales && sales.total_leads > 0) ? (sales.cases_signed / sales.total_leads) * 100 : 0;

  // 4. Decision Flow (Enforced Priority Order)
  const decisionFlow: DiagnosticResults['decisionFlow'] = [
    { 
      id: 'cpm', 
      label: '1. Targeting (CPM)', 
      value: avgCPM, 
      target: benchmarks.cpm.good,
      status: 'pending' 
    },
    { 
      id: 'cpc', 
      label: '2. Ad Creative (CPC)', 
      value: avgCPC, 
      target: benchmarks.cpc, 
      status: 'pending' 
    },
    { 
      id: 'cpl', 
      label: '3. Conversion (CPL)', 
      value: avgCPL, 
      target: benchmarks.cpl.good, 
      status: 'pending' 
    },
    { 
      id: 'cpa', 
      label: '4. Sales (CPA)', 
      value: avgCPA, 
      target: benchmarks.cpa, 
      status: 'pending' 
    },
  ];

  let firstFailureIdx = -1;

  // Primary Check Trigger (Requires Campaign Data for Step 1-3)
  if (campaigns && campaigns.length > 0) {
    // CPM Check (Step 1)
    if (avgCPM > (benchmarks.cpm.good || 30)) {
      decisionFlow[0].status = 'fail';
      decisionFlow[0].alert = "CPM is high. Fix targeting first. You are bidding on the wrong audience or an audience that costs too much. Change audience before looking at anything else.";
      firstFailureIdx = 0;
    } else {
      decisionFlow[0].status = 'pass';
      
      // CPC Check (Step 2)
      if (avgCPC > (benchmarks.cpc || 10)) {
        decisionFlow[1].status = 'fail';
        decisionFlow[1].alert = "CPC is high. Fix ad creative/targeting match. Ads may be burning out. Kill ads and test new creatives.";
        firstFailureIdx = 1;
      } else {
        decisionFlow[1].status = 'pass';

        // CPL Check (Step 3) - User mentioned $40, but benchmarks are higher.
        if (avgCPL > (benchmarks.cpl.avg || 40)) {
          decisionFlow[2].status = 'fail';
          decisionFlow[2].alert = "CPL is high. Landing page or offer is wrong. People click but don't convert. Fix form, offer, or page experience.";
          firstFailureIdx = 2;
        } else {
          decisionFlow[2].status = 'pass';

          // CPA Check (Step 4) - Requires Sales Data
          if (sales) {
            if (avgCPA > (benchmarks.cpa || 2250)) {
              decisionFlow[3].status = 'fail';
              decisionFlow[3].alert = "CPA is high. Funnel or sales team issue. Leads are coming in but not signing cases.";
              firstFailureIdx = 3;
            } else if (avgCPA > 0) {
              decisionFlow[3].status = 'pass';
            }
          }
        }
      }
    }
  }

  if (firstFailureIdx !== -1) {
    decisionFlow[firstFailureIdx].isFirstFailure = true;
  }

  // --- DIAGNOSIS LOGIC ---
  // Only add findings for the first failing step or overall health if all pass

  // Campaign Diagnosis
  if (avgCTR < benchmarks.ctr.bad) {
    findings.push({
      id: 'campaign-ctr-low',
      title: 'Very Low CTR',
      detail: `${avgCTR.toFixed(2)}% vs ${benchmarks.ctr.good}% benchmark`,
      severity: 'critical'
    });
    recommendations.push({
      id: 'rec-creative',
      text: 'Test new ad hooks and creative formats to improve click-through rate',
      impact: 'High'
    });
  } else if (avgCTR < benchmarks.ctr.avg) {
    findings.push({
      id: 'campaign-ctr-avg',
      title: 'Below Average CTR',
      detail: `${avgCTR.toFixed(2)}% click rate`,
      severity: 'warning'
    });
  }

  if (avgCPM > benchmarks.cpm.bad) {
    findings.push({
      id: 'campaign-cpm-high',
      title: 'Very High CPM Costs',
      detail: `$${avgCPM.toFixed(2)} cost per 1k impressions`,
      severity: 'critical'
    });
  } else if (avgCPM > benchmarks.cpm.avg) {
    findings.push({
      id: 'campaign-cpm-avg',
      title: 'High CPM Costs',
      detail: `$${avgCPM.toFixed(2)} cost per 1k impressions`,
      severity: 'warning'
    });
  }

  // Landing Page Diagnosis
  if (overallCVR < benchmarks.landingPageCvr.bad) {
    findings.push({
      id: 'lp-cvr-critical',
      title: 'Critical Landing Page CVR',
      detail: `${overallCVR.toFixed(2)}% conversion rate`,
      severity: 'critical'
    });
    recommendations.push({
      id: 'rec-lp-ui',
      text: 'Audit landing page for mobile UX issues and headline clarity',
      impact: 'High'
    });
  } else if (overallCVR < benchmarks.landingPageCvr.avg) {
    findings.push({
      id: 'lp-cvr-avg',
      title: 'Low Landing Page CVR',
      detail: `${overallCVR.toFixed(2)}% vs ${benchmarks.landingPageCvr.good}% benchmark`,
      severity: 'warning'
    });
  }

  if (avgBounce > benchmarks.bounceRateMax) {
    findings.push({
      id: 'lp-bounce-high',
      title: 'High Bounce Rate',
      detail: `${(avgBounce * 100).toFixed(0)}% of users leave immediately`,
      severity: 'warning'
    });
  }

  if (avgTime < benchmarks.avgTimeMinSec) {
    findings.push({
      id: 'lp-time-low',
      title: 'Very Low Time on Page',
      detail: `${avgTime.toFixed(0)}s average session`,
      severity: 'warning'
    });
  }

  // Form Diagnosis
  const safeForm = form || [];
  safeForm.forEach((q) => {
    const dropoff = ((q.started - q.completed) / q.started) * 100;
    if (q.type === 'friction_heavy' && dropoff > benchmarks.frictionHeavyDropoffMax) {
      findings.push({
        id: `form-friction-${q.step}`,
        title: `Heavy Friction: ${q.question}`,
        detail: `${dropoff.toFixed(1)}% drop-off on friction step`,
        severity: 'critical'
      });
    } else if (q.type === 'friction' && dropoff > benchmarks.frictionDropoffMax) {
      findings.push({
        id: `form-friction-${q.step}`,
        title: `High Friction: ${q.question}`,
        detail: `${dropoff.toFixed(1)}% drop-off`,
        severity: 'warning'
      });
    } else if (q.type === 'qualification') {
      if (dropoff < benchmarks.qualificationDropoffMin) {
        findings.push({
          id: `form-qual-weak-${q.step}`,
          title: `Weak Qualifier: ${q.question}`,
          detail: `Only ${dropoff.toFixed(1)}% filtered out`,
          severity: 'info'
        });
      } else if (dropoff > benchmarks.qualificationDropoffMax) {
        findings.push({
          id: `form-qual-high-${q.step}`,
          title: `High Qualification Drop-off: ${q.question}`,
          detail: `${dropoff.toFixed(1)}% dropped`,
          severity: 'warning'
        });
      }
    }
  });

  // Sales/Lead Quality Diagnosis
  if (qualRate < benchmarks.leadToQualifiedRate.bad) {
    findings.push({
      id: 'sales-qual-low',
      title: 'Critical Lead Quality',
      detail: `${qualRate.toFixed(1)}% qualification rate`,
      severity: 'critical'
    });
    recommendations.push({
      id: 'rec-form-qual',
      text: 'Add custom qualification questions to the form to filter irrelevant leads',
      impact: 'Medium'
    });
  } else if (qualRate < benchmarks.leadToQualifiedRate.avg) {
    findings.push({
      id: 'sales-qual-avg',
      title: 'Low Lead Qualification',
      detail: `${qualRate.toFixed(1)}% qualified`,
      severity: 'warning'
    });
  }

  if (signRate < benchmarks.qualifiedToSignRate.bad) {
    findings.push({
      id: 'sales-sign-low',
      title: 'Critical Cases Signed Rate',
      detail: `${signRate.toFixed(1)}% sign rate from qualified calls`,
      severity: 'critical'
    });
  } else if (signRate < benchmarks.qualifiedToSignRate.avg) {
    findings.push({
      id: 'sales-sign-avg',
      title: 'Low Cases Signed Rate',
      detail: `${signRate.toFixed(1)}% sign rate from qualified calls`,
      severity: 'warning'
    });
  }

  // Root Cause Logic
  if (avgCTR < benchmarks.ctr.bad || avgCPM > benchmarks.cpm.bad) {
    rootCauses.push({ title: 'CREATIVE: Ad hook not resonating', severity: 'critical', icon: 'zap' });
  }
  if (overallCVR < benchmarks.landingPageCvr.bad) {
    rootCauses.push({ title: 'LANDING PAGE: Page not converting', severity: 'critical', icon: 'monitor' });
  } else if (overallCVR < benchmarks.landingPageCvr.avg) {
    rootCauses.push({ title: 'OFFER: Value prop mismatch', severity: 'warning', icon: 'tag' });
  }
  if (qualRate < benchmarks.leadToQualifiedRate.bad) {
    rootCauses.push({ title: 'QUALIFICATION: Weak form filtering', severity: 'critical', icon: 'filter' });
  }
  if (totalLeads > 0 && leadSignRate < 5) {
    rootCauses.push({ title: 'SALES: Follow-up speed or script friction', severity: 'warning', icon: 'phone' });
  }

  // Summary Metrics Status
  const getStatus = (val: number, type: 'spend' | 'cpl' | 'cvr' | 'sign'): Severity => {
    if (type === 'cpl') {
      if (val > benchmarks.cpl.bad) return 'critical';
      if (val > benchmarks.cpl.avg) return 'warning';
      return 'good';
    }
    if (type === 'cvr') {
      if (val < benchmarks.landingPageCvr.bad) return 'critical';
      if (val < benchmarks.landingPageCvr.avg) return 'warning';
      return 'good';
    }
    if (type === 'sign') {
      if (val < 5) return 'critical';
      if (val < 10) return 'warning';
      return 'good';
    }
    return 'good';
  };

  return {
    metrics: {
      totalSpend,
      avgCPM,
      avgCPC,
      avgCTR,
      avgCPL,
      avgCPA,
      overallCVR,
      leadSignRate,
      spendStatus: 'good',
      cplStatus: getStatus(avgCPL, 'cpl'),
      cvrStatus: getStatus(overallCVR, 'cvr'),
      signRateStatus: getStatus(leadSignRate, 'sign'),
    },
    decisionFlow,
    findings: findings.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2, good: 3 };
      return order[a.severity] - order[b.severity];
    }),
    recommendations,
    rootCauses
  };
};

