import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Terminal,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Copy,
  Check,
  Sun,
  Moon,
  Filter,
  Layers,
  Code2,
  BarChart3,
  Cpu,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  FileText,
  X,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  GitBranch,
  Sparkles,
  RefreshCw,
  Search,
  Building2,
  TrendingUp,
  Boxes
} from 'lucide-react';

// --- DATA DEFINITIONS ---

const CLIENT_PEDIGREE = [
  {
    id: 'dell',
    name: 'Dell Technologies',
    sector: 'Enterprise Hardware & IT',
    sites: 18,
    auditScore: '100%',
    focus: 'Multi-site workforce KYC & shift telemetry reconciliation',
    schemaNote: 'Automated daily attendance & statutory compliance feed across Maharashtra IT corridors.'
  },
  {
    id: 'ebay',
    name: 'eBay',
    sector: 'Global E-Commerce',
    sites: 9,
    auditScore: '100%',
    focus: 'Zero-defect vendor compliance & operational SLA tracking',
    schemaNote: 'Standardized vendor audit logs and automated monthly executive scorecards in Power BI.'
  },
  {
    id: 'philips',
    name: 'Philips',
    sector: 'HealthTech & Electronics',
    sites: 14,
    auditScore: '99.9%',
    focus: 'Facility operations telemetry & EHS compliance datasets',
    schemaNote: 'Governed employee verification records and site-level feedback KPIs with DAX measures.'
  },
  {
    id: 'techm',
    name: 'Tech Mahindra',
    sector: 'IT Services & Consulting',
    sites: 24,
    auditScore: '100%',
    focus: 'High-volume campus workforce master data governance',
    schemaNote: 'Eliminated duplicate onboarding entries across 20+ campus hubs via CARE ERP validation rules.'
  },
  {
    id: 'wns',
    name: 'WNS Global Services',
    sector: 'BPM & Analytics',
    sites: 16,
    auditScore: '99.9%',
    focus: '24/7 roster reconciliation & payroll input pipelines',
    schemaNote: 'Reduced monthly payroll reconciliation turnaround by 28% using Power Query ETL templates.'
  },
  {
    id: 'colgate',
    name: 'Colgate-Palmolive',
    sector: 'FMCG & Manufacturing',
    sites: 11,
    auditScore: '100%',
    focus: 'Plant & corporate hygiene SLA audit datasets',
    schemaNote: 'Structured audit-ready statutory registers and live site-performance trackers.'
  },
  {
    id: 'voltas',
    name: 'Voltas (Tata Enterprise)',
    sector: 'Engineering & Industrial',
    sites: 12,
    auditScore: '99.9%',
    focus: 'Regional field workforce KYC & deployment tracking',
    schemaNote: 'Mapped regional technician deployment and compliance status across West India.'
  }
];

const RAW_EXCEL_ROWS = [
  { rowId: 'R-1042', empId: 'EHK_8821', name: 'R. Sharma', site: 'Dell_Powai_02', kyc: 'VERIFIED', date: '12/08/2026', hours: '208', status: 'OK', issue: null },
  { rowId: 'R-1043', empId: '8821-EHK', name: 'Rajesh Sharma ', site: 'DELL POWAI', kyc: 'Pending??', date: '2026-08-12', hours: '#N/A', status: 'ERR: DUP_ID', issue: 'Unstandardized EMP_ID & broken VLOOKUP' },
  { rowId: 'R-1044', empId: 'EHK_9104', name: 'S. Kulkarni', site: 'TechM_Thane', kyc: 'AADHAAR_OK', date: '13-Aug-26', hours: '196', status: 'WARN: DATE_FMT', issue: 'Mixed date locale breaks monthly aggregation' },
  { rowId: 'R-1045', empId: 'EHK_9410', name: 'A. Deshmukh', site: 'WNS_Vikhroli', kyc: 'NULL', date: '13/08/2026', hours: '212', status: 'ERR: KYC_MISSING', issue: 'Missing mandatory statutory KYC token' },
  { rowId: 'R-1046', empId: 'EHK_9502', name: 'M. Ansari', site: 'Philips_MIDC', kyc: 'VERIFIED', date: '14/08/2026', hours: '204', status: 'OK', issue: null },
  { rowId: 'R-1047', empId: 'EHK_9502', name: 'M. Ansari', site: 'Colgate_BKC', kyc: 'VERIFIED', date: '14.08.2026', hours: '410', status: 'ERR: OVERLAP', issue: 'Dual site allocation & outlier hours (>300)' }
];

const BI_REGIONAL_DATA = {
  ALL: {
    label: 'All West India Regions',
    records: '7,140',
    accuracy: '99.92%',
    turnaroundDelta: '-25.4%',
    activeSites: 104,
    kycVerified: '99.9%',
    slaScore: 98.7,
    monthlyTrend: [
      { month: 'May', manualHrs: 44, biHrs: 33, sla: 96.2 },
      { month: 'Jun', manualHrs: 42, biHrs: 31, sla: 97.4 },
      { month: 'Jul', manualHrs: 45, biHrs: 32, sla: 98.1 },
      { month: 'Aug', manualHrs: 41, biHrs: 30, sla: 98.9 },
      { month: 'Sep', manualHrs: 40, biHrs: 29, sla: 99.4 },
      { month: 'Oct', manualHrs: 39, biHrs: 28, sla: 99.9 }
    ],
    clientFeedback: '4.91 / 5.0'
  },
  MUMBAI: {
    label: 'Mumbai Metro Cluster',
    records: '3,420',
    accuracy: '99.95%',
    turnaroundDelta: '-27.1%',
    activeSites: 48,
    kycVerified: '100%',
    slaScore: 99.2,
    monthlyTrend: [
      { month: 'May', manualHrs: 22, biHrs: 16, sla: 97.0 },
      { month: 'Jun', manualHrs: 21, biHrs: 15, sla: 97.9 },
      { month: 'Jul', manualHrs: 22, biHrs: 15, sla: 98.5 },
      { month: 'Aug', manualHrs: 20, biHrs: 14, sla: 99.1 },
      { month: 'Sep', manualHrs: 20, biHrs: 14, sla: 99.6 },
      { month: 'Oct', manualHrs: 19, biHrs: 13, sla: 99.9 }
    ],
    clientFeedback: '4.94 / 5.0'
  },
  THANE: {
    label: 'Thane & Central Corridor',
    records: '1,890',
    accuracy: '99.91%',
    turnaroundDelta: '-24.8%',
    activeSites: 29,
    kycVerified: '99.9%',
    slaScore: 98.8,
    monthlyTrend: [
      { month: 'May', manualHrs: 12, biHrs: 9, sla: 96.1 },
      { month: 'Jun', manualHrs: 11, biHrs: 8, sla: 97.2 },
      { month: 'Jul', manualHrs: 12, biHrs: 8, sla: 98.0 },
      { month: 'Aug', manualHrs: 11, biHrs: 8, sla: 98.7 },
      { month: 'Sep', manualHrs: 10, biHrs: 7, sla: 99.3 },
      { month: 'Oct', manualHrs: 10, biHrs: 7, sla: 99.9 }
    ],
    clientFeedback: '4.89 / 5.0'
  },
  NAVI_MUMBAI: {
    label: 'Navi Mumbai & MIDC Belt',
    records: '1,120',
    accuracy: '99.89%',
    turnaroundDelta: '-23.5%',
    activeSites: 16,
    kycVerified: '99.8%',
    slaScore: 98.4,
    monthlyTrend: [
      { month: 'May', manualHrs: 6, biHrs: 5, sla: 95.8 },
      { month: 'Jun', manualHrs: 6, biHrs: 5, sla: 96.9 },
      { month: 'Jul', manualHrs: 7, biHrs: 5, sla: 97.7 },
      { month: 'Aug', manualHrs: 6, biHrs: 4, sla: 98.4 },
      { month: 'Sep', manualHrs: 6, biHrs: 4, sla: 99.0 },
      { month: 'Oct', manualHrs: 6, biHrs: 4, sla: 99.8 }
    ],
    clientFeedback: '4.88 / 5.0'
  },
  PUNE: {
    label: 'Pune IT & Industrial Zone',
    records: '710',
    accuracy: '99.90%',
    turnaroundDelta: '-24.2%',
    activeSites: 11,
    kycVerified: '99.9%',
    slaScore: 98.5,
    monthlyTrend: [
      { month: 'May', manualHrs: 4, biHrs: 3, sla: 96.0 },
      { month: 'Jun', manualHrs: 4, biHrs: 3, sla: 97.1 },
      { month: 'Jul', manualHrs: 4, biHrs: 3, sla: 97.9 },
      { month: 'Aug', manualHrs: 4, biHrs: 3, sla: 98.6 },
      { month: 'Sep', manualHrs: 4, biHrs: 3, sla: 99.2 },
      { month: 'Oct', manualHrs: 4, biHrs: 3, sla: 99.9 }
    ],
    clientFeedback: '4.90 / 5.0'
  }
};

const EXPERIENCE_LOGS = [
  {
    id: 'LOG-01',
    pillar: 'BI & Reporting Automation',
    tag: 'POWER BI • DAX • KPI TELEMETRY',
    metric: '~25% Faster Turnaround',
    summary:
      'Spearheaded the migration from legacy manual Excel tracking to live, interactive Power BI dashboards—automating data ingestion, cleaning, and KPI visualization (including monthly client feedback and site performance metrics) for executive decision-making and ~25% faster reporting turnaround.',
    beforeState: 'Fragmented multi-tab Excel workbooks manually emailed every week; prone to broken VLOOKUPs and static views.',
    afterState: 'Centralized Power BI semantic model with automated Power Query ingestion and drill-through client telemetry.',
    artifacts: ['Executive SLA Scorecard', 'Client Feedback Sentiment Matrix', 'Regional Turnaround Tracker']
  },
  {
    id: 'LOG-02',
    pillar: 'Enterprise Data Engineering',
    tag: '100+ CLIENT ENVIRONMENTS • ZERO-DEFECT',
    metric: '100% Audit-Ready Datasets',
    summary:
      'Engineered and delivered zero-defect, 100% audit-ready operational and compliance datasets across 100+ client environments for global industry leaders including Dell, eBay, Philips, Tech Mahindra, WNS, Colgate-Palmolive, and Voltas.',
    beforeState: 'Inconsistent schema definitions across client sites causing pre-audit reconciliation delays.',
    afterState: 'Standardized validation pipelines guaranteeing 100% statutory & enterprise audit readiness across all 100+ sites.',
    artifacts: ['Cross-Client Compliance Schema', 'Statutory Audit Pack Generator', 'Site SLA Variance Log']
  },
  {
    id: 'LOG-03',
    pillar: 'Database Administration & ETL',
    tag: '7,000+ RECORDS • CARE ERP • EXCEL',
    metric: '99.9% Master DB Accuracy',
    summary:
      'Governed master database schemas and KYC verification records for 7,000+ active employees across the West India region at 99.9% accuracy via the CARE enterprise portal and Advanced Excel, implementing automated validation rules to eliminate manual reconciliation bottlenecks.',
    beforeState: 'Duplicate onboarding profiles, unverified KYC fields, and manual cross-checking across regional branches.',
    afterState: 'Strict primary-key governance and automated discrepancy flags across 7,000+ active workforce records.',
    artifacts: ['CARE ERP Master Schema', 'Automated KYC Validator', 'Reconciliation Exception Report']
  },
  {
    id: 'LOG-04',
    pillar: 'Technical & Operational Leadership',
    tag: 'STRATEGY • CLIENT COMM • MUMBAI OPS',
    metric: 'Regional Ops Continuity',
    summary:
      'Aligned backend database administration, payroll, and statutory compliance workflows with executive business strategy—managing direct client communications and stepping in to lead regional operations across Mumbai during leadership transitions.',
    beforeState: 'Siloed communication between backend data teams, payroll processing, and on-site client stakeholders.',
    afterState: 'Unified operational cadence connecting database integrity directly to billing accuracy and client retention.',
    artifacts: ['Mumbai Ops Handover Protocol', 'Payroll-to-DB Reconciliation SOP', 'Executive Client Briefings']
  }
];

// Strict 16-Skill 4x4 Grid (Exact sequence from resume)
const SKILLS_16_GRID = [
  // Row 1
  {
    pos: '01 / R1C1',
    name: 'Power BI & DAX',
    domain: 'BI & Telemetry',
    productionUse: 'Architected interactive executive dashboards tracking SLA compliance, client feedback scores, and regional workforce allocation across 100+ enterprise sites.',
    snippetTitle: 'DAX // Dynamic SLA Compliance & Turnaround Measure',
    snippet: `SLA_Compliance_Rate = 
VAR ValidatedSites = 
    CALCULATE(COUNTROWS('SiteTelemetry'), 'SiteTelemetry'[AuditStatus] = "PASS")
VAR TotalActiveSites = 
    COUNTROWS('SiteTelemetry')
RETURN
    DIVIDE(ValidatedSites, TotalActiveSites, 0)`
  },
  {
    pos: '02 / R1C2',
    name: 'SQL & MySQL',
    domain: 'Database Querying',
    productionUse: 'Used for querying relational tables, isolating duplicate KYC entries, and extracting behavioral customer cohorts for churn modeling.',
    snippetTitle: 'SQL // Master Workforce Deduplication & KYC Audit',
    snippet: `SELECT emp_id, site_code, kyc_status, COUNT(*) AS record_count
FROM enterprise_workforce_master
WHERE region = 'WEST_INDIA'
GROUP BY emp_id, site_code, kyc_status
HAVING COUNT(*) > 1 OR kyc_status IS NULL;`
  },
  {
    pos: '03 / R1C3',
    name: 'Python (Pandas/NumPy)',
    domain: 'Data Science Core',
    productionUse: 'Vectorized data cleaning, feature engineering on customer transaction logs, and automated anomaly detection across multi-thousand-row datasets.',
    snippetTitle: 'Python // Automated Schema & Outlier Sanitization',
    snippet: `import pandas as pd
import numpy as np

df['emp_id'] = df['emp_id'].str.extract(r'(\\d{4})').apply(lambda x: f"EHK_{x}")
df['hours_worked'] = pd.to_numeric(df['hours_worked'], errors='coerce')
df = df.drop_duplicates(subset=['emp_id', 'billing_month'], keep='first')`
  },
  {
    pos: '04 / R1C4',
    name: 'Machine Learning',
    domain: 'Predictive Modeling',
    productionUse: 'Designed supervised classification and regression workflows to predict retail customer churn and regional inventory demand shifts.',
    snippetTitle: 'ML Architecture // End-to-End Classification Flow',
    snippet: `Feature Matrix [RFM + Support Telemetry]
  └── Stratified K-Fold Split (80/20)
        └── Gradient Boosted / Random Forest Classifier
              └── Threshold Tuning (ROC-AUC: 0.89) ➔ Retention Action`
  },
  // Row 2
  {
    pos: '05 / R2C1',
    name: 'Power Query',
    domain: 'Data Transformation',
    productionUse: 'Automated multi-folder Excel & CSV ingestion pipelines using M-code, eliminating ~25% of manual monthly reporting preparation time.',
    snippetTitle: 'Power Query (M) // Standardized Date & Null Governance',
    snippet: `let
  Source = Excel.CurrentWorkbook(){[Name="RawSiteFeed"]}[Content],
  TrimmedText = Table.TransformColumns(Source, {{"SiteName", Text.Trim}}),
  FilteredNulls = Table.SelectRows(TrimmedText, each [KYC_ID] <> null and [KYC_ID] <> "")
in
  FilteredNulls`
  },
  {
    pos: '06 / R2C2',
    name: 'ETL Pipelines',
    domain: 'Data Engineering',
    productionUse: 'Built repeatable Extract-Transform-Load workflows bridging raw ERP exports, statutory registers, and live Power BI semantic layers.',
    snippetTitle: 'ETL Pipeline // Care ERP to Executive BI Lake',
    snippet: `[CARE ERP Exports] + [Site Excel Logs]
   ➔ Stage 1: Schema Validation & Regex ID Normalization
   ➔ Stage 2: Referential Integrity Check against Client Master
   ➔ Stage 3: Incremental Refresh into Power BI Star Schema`
  },
  {
    pos: '07 / R2C3',
    name: 'Data Modeling',
    domain: 'Schema Architecture',
    productionUse: 'Designed normalized Star Schemas separating Fact tables (Attendance, Churn Telemetry, Inventory Movement) from Dimension tables (Clients, Regions, Dates).',
    snippetTitle: 'Star Schema // Enterprise Operations Data Model',
    snippet: `DIM_Calendar (1) ───► (*) FACT_Workforce_Telemetry (*) ◄─── (1) DIM_Client_Sites
                                    │
                                   (1)
                            DIM_Employee_KYC`
  },
  {
    pos: '08 / R2C4',
    name: 'Scikit-Learn',
    domain: 'ML Implementation',
    productionUse: 'Implemented ColumnTransformer pipelines, RandomForestClassifier, and hyperparameter tuning for retail customer churn risk scoring.',
    snippetTitle: 'Python // Scikit-Learn Production Pipeline',
    snippet: `from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

clf_pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('rf', RandomForestClassifier(n_estimators=250, max_depth=8, class_weight='balanced'))
])`
  },
  // Row 3
  {
    pos: '09 / R3C1',
    name: 'KPI Telemetry',
    domain: 'Executive Analytics',
    productionUse: 'Translated raw operational logs into live executive telemetry: SLA adherence %, KYC completion velocity, and site-level satisfaction indices.',
    snippetTitle: 'Telemetry Spec // Executive North-Star Metrics',
    snippet: `• Primary Integrity KPI  : 99.9% Verified Master Records
• Turnaround Efficiency  : -25.0% Reporting Cycle Compression
• Audit Readiness Index  : 100% Zero-Defect Client Submissions`
  },
  {
    pos: '10 / R3C2',
    name: 'Database Admin',
    domain: 'System Governance',
    productionUse: 'Administered 7,000+ active employee lifecycles across West India via CARE ERP and relational tables with strict access and update controls.',
    snippetTitle: 'DBA Protocol // Master Record Integrity Constraint',
    snippet: `ALTER TABLE employee_master
ADD CONSTRAINT chk_kyc_verified 
CHECK (kyc_status IN ('VERIFIED', 'PROVISIONAL_HOLD') AND aadhaar_hash IS NOT NULL);`
  },
  {
    pos: '11 / R3C3',
    name: 'Exploratory Data Analysis',
    domain: 'Statistical Discovery',
    productionUse: 'Conducted deep univariate and multivariate profiling to uncover churn drivers, seasonal inventory bottlenecks, and shift overtime anomalies.',
    snippetTitle: 'Python // Cohort Churn Correlation Profiling',
    snippet: `corr_matrix = df[['recency_days', 'order_freq', 'support_tickets', 'churned']].corr()
high_risk_cohort = df.query("recency_days > 45 and support_tickets >= 3")
print(f"Cohort Churn Rate: {high_risk_cohort['churned'].mean():.2%}")`
  },
  {
    pos: '12 / R3C4',
    name: 'TensorFlow & NLP',
    domain: 'Deep Learning & Text',
    productionUse: 'Applied neural network architectures and NLP text classification to categorize unstructured client feedback and operational incident notes.',
    snippetTitle: 'NLP // Client Feedback Sentiment & Topic Extraction',
    snippet: `import tensorflow as tf
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, 64),
    tf.keras.layers.GlobalAveragePooling1D(),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])`
  },
  // Row 4
  {
    pos: '13 / R4C1',
    name: 'Data Governance',
    domain: 'Audit & Compliance',
    productionUse: 'Enforced zero-defect data hygiene standards across 100+ enterprise sites (Dell, eBay, Philips, WNS, Tech Mahindra) for statutory compliance.',
    snippetTitle: 'Governance Rulebook // 3-Tier Validation Gate',
    snippet: `Gate 01: Automated Format & Regex Check (Pre-Ingestion)
Gate 02: Cross-Table Referential Audit (ERP vs Payroll)
Gate 03: Sign-off Checksum prior to Client Dashboard Publish`
  },
  {
    pos: '14 / R4C2',
    name: 'Business & ROI Analysis',
    domain: 'Commercial Strategy',
    productionUse: 'Bridged technical model outputs with BMS commercial strategy—quantifying revenue at risk in churn cohorts and working-capital savings in inventory.',
    snippetTitle: 'ROI Matrix // Retention Intervention Economics',
    snippet: `Net_Retention_ROI = 
  (Saved_High_LTV_Customers * Avg_Annual_Margin) 
  - (Targeted_Retention_Campaign_Cost)`
  },
  {
    pos: '15 / R4C3',
    name: 'Predictive Statistics',
    domain: 'Quantitative Methods',
    productionUse: 'Applied hypothesis testing, confidence intervals, and time-series decomposition to separate operational noise from true demand signals.',
    snippetTitle: 'Stats // Demand Variance & Safety Stock Calculation',
    snippet: `Z_Score_99 = 2.33
Safety_Stock = Z_Score_99 * np.sqrt(Avg_Lead_Time) * Demand_Std_Dev
Reorder_Point = (Daily_Demand * Avg_Lead_Time) + Safety_Stock`
  },
  {
    pos: '16 / R4C4',
    name: 'Generative AI',
    domain: 'LLM & Automation',
    productionUse: 'Leveraged structured prompt engineering and LLM workflows to accelerate SQL/DAX query synthesis, documentation, and executive summary generation.',
    snippetTitle: 'GenAI Workflow // Automated Executive Narrative Prompt',
    snippet: `SYSTEM: Act as Principal BI Analyst.
INPUT : JSON telemetry delta (Region: Mumbai, SLA: 99.9%, Turnaround: -25%).
OUTPUT: 3-bullet audit summary highlighting root-cause efficiency gains.`
  }
];

const SUPPLY_CHAIN_HUBS = {
  BHIWANDI: {
    name: 'Bhiwandi Mega Fulfillment Hub (MMR)',
    skuCount: '1,420 SKUs',
    forecastAccuracy: '94.8%',
    leadTimeDays: '2.4 Days',
    stockoutRisk: 'LOW (1.8%)',
    bottleneckNote: 'Automated safety-stock triggers reduced fast-moving FMCG stockouts by 31%.',
    quarters: [
      { q: 'Q1', actual: 820, forecast: 805, safety: 120 },
      { q: 'Q2', actual: 910, forecast: 895, safety: 135 },
      { q: 'Q3', actual: 1080, forecast: 1060, safety: 160 },
      { q: 'Q4', actual: 1240, forecast: 1225, safety: 180 }
    ]
  },
  PUNE_CHAKAN: {
    name: 'Pune-Chakan Industrial Depot',
    skuCount: '980 SKUs',
    forecastAccuracy: '92.4%',
    leadTimeDays: '3.1 Days',
    stockoutRisk: 'MODERATE (4.2%)',
    bottleneckNote: 'Identified vendor transit lag on Tier-2 components; adjusted reorder points in Power BI.',
    quarters: [
      { q: 'Q1', actual: 540, forecast: 560, safety: 90 },
      { q: 'Q2', actual: 610, forecast: 590, safety: 95 },
      { q: 'Q3', actual: 690, forecast: 710, safety: 110 },
      { q: 'Q4', actual: 780, forecast: 765, safety: 125 }
    ]
  },
  NAVI_MUMBAI_JNPT: {
    name: 'Navi Mumbai Port Corridor Hub',
    skuCount: '1,150 SKUs',
    forecastAccuracy: '95.6%',
    leadTimeDays: '1.9 Days',
    stockoutRisk: 'MINIMAL (1.1%)',
    bottleneckNote: 'Direct ETL pipeline from port customs clearance logs improved inbound dock scheduling.',
    quarters: [
      { q: 'Q1', actual: 710, forecast: 700, safety: 105 },
      { q: 'Q2', actual: 760, forecast: 755, safety: 110 },
      { q: 'Q3', actual: 890, forecast: 880, safety: 130 },
      { q: 'Q4', actual: 990, forecast: 985, safety: 145 }
    ]
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [copiedItem, setCopiedItem] = useState(null);
  const [selectedClient, setSelectedClient] = useState(CLIENT_PEDIGREE[0]);
  const [telemetryStage, setTelemetryStage] = useState('BI'); // 'EXCEL' | 'ETL' | 'BI'
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState(SKILLS_16_GRID[0]);
  const [expandedExp, setExpandedExp] = useState('LOG-01');
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Project 1 Interactive Churn Simulator State
  const [recencyDays, setRecencyDays] = useState(62);
  const [monthlyOrders, setMonthlyOrders] = useState(2);
  const [avgBasketValue, setAvgBasketValue] = useState(4200);
  const [supportTickets, setSupportTickets] = useState(3);
  const [project1Tab, setProject1Tab] = useState('SIMULATOR'); // 'SIMULATOR' | 'CODE'

  // Project 2 Interactive Supply Chain State
  const [selectedHub, setSelectedHub] = useState('BHIWANDI');
  const [project2Tab, setProject2Tab] = useState('TELEMETRY'); // 'TELEMETRY' | 'DAX'

  // Copy helper
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2200);
  };

  // Real-time Churn Model calculation
  const churnSimulation = useMemo(() => {
    // Logistic-style weighted risk score
    const recencyWeight = (recencyDays / 120) * 45;
    const freqPenalty = Math.max(0, (12 - monthlyOrders) / 12) * 28;
    const ticketWeight = (supportTickets / 6) * 27;
    const rawScore = Math.min(98, Math.max(4, Math.round(recencyWeight + freqPenalty + ticketWeight)));

    const annualLtv = monthlyOrders * avgBasketValue * 12;
    let segment = 'CORE STABLE';
    let badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    let recommendation = 'Maintain standard loyalty cadence & automated cross-sell bundle.';

    if (rawScore >= 70 && annualLtv >= 80000) {
      segment = 'HIGH-VALUE AT-RISK (PRIORITY 1)';
      badgeColor = 'text-orange-400 border-orange-500/50 bg-orange-500/15';
      recommendation = 'Trigger immediate VIP retention credit + proactive account manager outreach within 24h.';
    } else if (rawScore >= 60) {
      segment = 'CHURN RISK COHORT';
      badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      recommendation = 'Deploy automated win-back discount workflow & resolve open support tickets.';
    } else if (annualLtv >= 120000) {
      segment = 'PLATINUM CHAMPION';
      badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      recommendation = 'Enroll in early-access tier; zero discount needed (preserve margin).';
    }

    return {
      probability: rawScore,
      annualLtv,
      segment,
      badgeColor,
      recommendation
    };
  }, [recencyDays, monthlyOrders, avgBasketValue, supportTickets]);

  const currentBiData = BI_REGIONAL_DATA[selectedRegion];
  const currentHubData = SUPPLY_CHAIN_HUBS[selectedHub];

  // Theme tokens
  const bgMain = darkMode ? 'bg-[#0C0D0E] text-[#F3F4F6]' : 'bg-[#F8F7F4] text-[#111315]';
  const bgPanel = darkMode ? 'bg-[#131517]' : 'bg-[#FFFFFF]';
  const bgSubtle = darkMode ? 'bg-[#181B1E]' : 'bg-[#F0EFEA]';
  const borderCol = darkMode ? 'border-[#22262A]' : 'border-[#DCD9D0]';
  const textMuted = darkMode ? 'text-[#9CA3AF]' : 'text-[#57534E]';
  const accentText = 'text-[#FF5500]';
  const accentBg = 'bg-[#FF5500]';

  return (
    <div className={`min-h-screen ${bgMain} font-sans selection:bg-[#FF5500] selection:text-white transition-colors duration-200`}>
      {/* Subtle Industrial Dot-Matrix Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: `radial-gradient(${darkMode ? '#4B5563' : '#78716C'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Copy Toast Notification */}
      {copiedItem && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-[#FF5500] text-white font-mono text-xs uppercase tracking-wider shadow-xl border border-white/20">
          <Check className="w-4 h-4" />
          <span>COPIED TO CLIPBOARD // {copiedItem}</span>
        </div>
      )}

      {/* TOP TELEMETRY STATUS BAR & NAVIGATION */}
      <header className={`sticky top-0 z-40 backdrop-blur-md ${darkMode ? 'bg-[#0C0D0E]/90' : 'bg-[#F8F7F4]/90'} border-b ${borderCol}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-3 gap-3">
            {/* Left Identity & Status */}
            <div className="flex items-center gap-4">
              <a href="#top" className="font-mono text-xs sm:text-sm font-bold tracking-tight flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-[#FF5500]" />
                <span>HANZALA KHAN</span>
                <span className={textMuted}>// SYS.2026</span>
              </a>
              <div className={`hidden md:flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono border ${borderCol} ${bgSubtle}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-500 font-semibold">ONLINE</span>
                <span className={textMuted}>THANE, IN (19.2183° N)</span>
              </div>
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 font-mono text-xs">
              <a href="#overview" className={`hover:text-[#FF5500] transition-colors`}>01.OVERVIEW</a>
              <a href="#telemetry-lab" className={`hover:text-[#FF5500] transition-colors`}>02.TELEMETRY_LAB</a>
              <a href="#experience" className={`hover:text-[#FF5500] transition-colors`}>03.EXPERIENCE</a>
              <a href="#skills-grid" className={`hover:text-[#FF5500] transition-colors`}>04.16_SKILL_MATRIX</a>
              <a href="#projects" className={`hover:text-[#FF5500] transition-colors`}>05.PROJECTS</a>
              <a href="#credentials" className={`hover:text-[#FF5500] transition-colors`}>06.CREDENTIALS</a>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResumeModal(true)}
                className={`px-3 py-1.5 font-mono text-xs border ${borderCol} ${bgPanel} hover:border-[#FF5500] flex items-center gap-1.5 transition-colors`}
              >
                <FileText className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>ATS_SPEC</span>
              </button>

              <button
                onClick={() => handleCopy('khanhanzala0987@gmail.com', 'EMAIL ADDRESS')}
                className="px-3 py-1.5 font-mono text-xs bg-[#FF5500] text-white font-semibold hover:bg-[#e04b00] flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">COPY EMAIL</span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle Theme"
                className={`p-1.5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] transition-colors`}
                title="Switch Industrial Dark / Editorial Paper Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main id="top" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* 01. HERO SECTION — EDITORIAL ASYMMETRIC GRID */}
        <section id="overview" className={`pt-10 pb-14 border-b ${borderCol}`}>
          {/* Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-6 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 font-semibold">
                DATA OPERATIONS & ANALYST
              </span>
              <span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                BUSINESS INTELLIGENCE (BI)
              </span>
              <span className={`px-2 py-0.5 border ${borderCol} ${bgSubtle}`}>
                DATA SCIENTIST
              </span>
            </div>
            <div className={`${textMuted} flex items-center gap-4`}>
              <span>DOC_REF: HK-2026-V4</span>
              <span>•</span>
              <span>WEST INDIA ENTERPRISE OPS</span>
            </div>
          </div>

          {/* Main Asymmetric Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Exact Resume Hook & Narrative */}
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.08]">
                <span className="text-[#FF5500]">99.9%</span> data integrity.{' '}
                <span className="underline decoration-[#FF5500]/60 decoration-2 underline-offset-8">7,000+</span> database records architected.{' '}
                Raw Excel chaos transformed into live Power BI dashboards.
              </h1>

              <p className={`text-base sm:text-lg leading-relaxed max-w-3xl ${textMuted}`}>
                Data Operations & Business Intelligence Analyst backed by a{' '}
                <span className={darkMode ? 'text-white font-medium' : 'text-black font-medium'}>
                  Bachelor of Management Studies (BMS)
                </span>{' '}
                and a{' '}
                <span className={darkMode ? 'text-white font-medium' : 'text-black font-medium'}>
                  Master Certification in Data Science & Machine Learning
                </span>
                , with nearly 2 years of enterprise data operations experience. Proven track record in bridging the gap between backend data operations and commercial business strategy through end-to-end data workflows, automated ETL pipelines, and interactive Power BI ecosystems that give stakeholders real-time operational telemetry.
              </p>

              {/* Direct Contact & External Links Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <a
                  href="https://linkedin.com/in/khan-hanzala01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] flex items-center gap-2 font-semibold transition-all`}
                >
                  <span>LINKEDIN // khan-hanzala01</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5500]" />
                </a>
                <a
                  href="https://github.com/khanhanzala0987-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2.5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] flex items-center gap-2 font-semibold transition-all`}
                >
                  <GitBranch className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>GITHUB // khanhanzala0987-hub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5500]" />
                </a>
                <button
                  onClick={() => handleCopy('+91 79779 39389', 'PHONE NUMBER')}
                  className={`px-4 py-2.5 border ${borderCol} ${bgSubtle} hover:border-[#FF5500] flex items-center gap-2 transition-all`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+91 79779 39389</span>
                  <Copy className="w-3 h-3 opacity-60" />
                </button>
              </div>
            </div>

            {/* Right 4 Columns: Live Operational Identity Card */}
            <div className={`lg:col-span-4 border ${borderCol} ${bgPanel} p-5 space-y-4`}>
              <div className={`flex items-center justify-between border-b ${borderCol} pb-3 font-mono text-xs`}>
                <span className="font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#FF5500]" />
                  OPERATOR_TELEMETRY
                </span>
                <span className="text-emerald-500 font-semibold">VERIFIED</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-neutral-700/40">
                  <span className={textMuted}>CURRENT ROLE</span>
                  <span className="font-semibold text-right">Data Operations Assistant</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-neutral-700/40">
                  <span className={textMuted}>ORGANIZATION</span>
                  <span className="font-semibold text-right">Express Housekeeper (EHK)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-neutral-700/40">
                  <span className={textMuted}>TENURE</span>
                  <span className="font-semibold text-right">Jan 2025 – Present (~2 Yrs)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-neutral-700/40">
                  <span className={textMuted}>PRIMARY STACK</span>
                  <span className="font-semibold text-[#FF5500] text-right">Power BI • SQL • Python • ML</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className={textMuted}>BASE_STATION</span>
                  <span className="font-semibold text-right">Thane, Maharashtra, IN</span>
                </div>
              </div>

              <div className={`p-3 ${bgSubtle} border ${borderCol} font-mono text-[11px] space-y-1`}>
                <div className="text-[#FF5500] font-semibold">CORE VALUE PROPOSITION:</div>
                <p className={textMuted}>
                  Bridging raw enterprise ERP/Excel operations with executive BI dashboards & predictive Python pipelines.
                </p>
              </div>
            </div>
          </div>

          {/* 4-CARD KPI BENTO STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <div className={`p-5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] transition-colors group`}>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className={textMuted}>01 // WORKFORCE DB SCALE</span>
                <Database className="w-4 h-4 text-[#FF5500]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">7,000+</div>
              <div className="text-xs font-semibold mt-1">Active Employee Records Governed</div>
              <p className={`text-xs mt-2 ${textMuted}`}>
                Master schemas & KYC verification managed across the West India region via CARE ERP & Advanced Excel.
              </p>
            </div>

            <div className={`p-5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] transition-colors group`}>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className={textMuted}>02 // DATA INTEGRITY</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-emerald-500">99.9%</div>
              <div className="text-xs font-semibold mt-1">Master Database Accuracy</div>
              <p className={`text-xs mt-2 ${textMuted}`}>
                Automated validation rules engineered to eliminate manual reconciliation bottlenecks and audit errors.
              </p>
            </div>

            <div className={`p-5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] transition-colors group`}>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className={textMuted}>03 // ENTERPRISE FOOTPRINT</span>
                <Building2 className="w-4 h-4 text-[#FF5500]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">100+</div>
              <div className="text-xs font-semibold mt-1">Client Site Environments</div>
              <p className={`text-xs mt-2 ${textMuted}`}>
                Zero-defect, 100% audit-ready operational datasets delivered for global Fortune 500 leaders.
              </p>
            </div>

            <div className={`p-5 border ${borderCol} ${bgPanel} hover:border-[#FF5500] transition-colors group`}>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className={textMuted}>04 // BI VELOCITY GAIN</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight">~25%</div>
              <div className="text-xs font-semibold mt-1">Faster Reporting Turnaround</div>
              <p className={`text-xs mt-2 ${textMuted}`}>
                Migrated legacy manual Excel tracking to live Power BI telemetry with automated ingestion.
              </p>
            </div>
          </div>

          {/* INTERACTIVE CLIENT PEDIGREE INSPECTOR */}
          <div className={`mt-6 border ${borderCol} ${bgPanel} p-4 sm:p-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF5500]" />
                <span>ENTERPRISE CLIENT DATASET PEDIGREE (CLICK CLIENT TO INSPECT AUDIT ARCHITECTURE)</span>
              </div>
              <span className={`font-mono text-xs ${textMuted}`}>100% AUDIT-READY COMPLIANCE</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {CLIENT_PEDIGREE.map((client) => {
                const active = selectedClient.id === client.id;
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`px-3.5 py-2 font-mono text-xs border transition-all flex items-center gap-2 ${
                      active
                        ? 'bg-[#FF5500] text-white border-[#FF5500] font-bold'
                        : `${bgSubtle} ${borderCol} hover:border-[#FF5500]`
                    }`}
                  >
                    <span>{client.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 ${active ? 'bg-black/25 text-white' : 'text-emerald-500'}`}>
                      {client.auditScore}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Client Inspection Strip */}
            <div className={`p-3.5 ${bgSubtle} border ${borderCol} grid grid-cols-1 md:grid-cols-12 gap-4 items-center font-mono text-xs`}>
              <div className="md:col-span-3">
                <div className={textMuted}>CLIENT ENVIRONMENT</div>
                <div className="font-bold text-sm mt-0.5">{selectedClient.name}</div>
                <div className="text-[11px] text-[#FF5500]">{selectedClient.sector}</div>
              </div>
              <div className="md:col-span-2">
                <div className={textMuted}>GOVERNED SITES</div>
                <div className="font-bold text-sm mt-0.5">{selectedClient.sites} Active Sites</div>
                <div className="text-[11px] text-emerald-500">Audit Score: {selectedClient.auditScore}</div>
              </div>
              <div className="md:col-span-7">
                <div className={textMuted}>DATA ENGINEERING & COMPLIANCE DELIVERY</div>
                <div className="font-sans text-xs sm:text-sm mt-0.5 font-medium">{selectedClient.focus}</div>
                <div className={`font-sans text-xs ${textMuted} mt-0.5`}>{selectedClient.schemaNote}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 02. INTERACTIVE SIMULATOR: RAW EXCEL CHAOS ➔ LIVE POWER BI TELEMETRY */}
        <section id="telemetry-lab" className={`py-14 border-b ${borderCol}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs text-[#FF5500] uppercase tracking-widest mb-1">
                // 02. INTERACTIVE WORKFLOW SANDBOX
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                From Legacy Excel Chaos to Live Power BI Telemetry
              </h2>
              <p className={`text-sm mt-1 max-w-2xl ${textMuted}`}>
                Inspect how fragmented regional spreadsheets are sanitized via automated ETL rules and published into executive Power BI dashboards.
              </p>
            </div>

            {/* 3-Stage Pipeline Switcher */}
            <div className={`inline-flex p-1 border ${borderCol} ${bgPanel} font-mono text-xs`}>
              <button
                onClick={() => setTelemetryStage('EXCEL')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-all ${
                  telemetryStage === 'EXCEL' ? 'bg-[#FF5500] text-white font-bold' : `${textMuted} hover:text-current`
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>1. RAW EXCEL CHAOS</span>
              </button>
              <button
                onClick={() => setTelemetryStage('ETL')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-all ${
                  telemetryStage === 'ETL' ? 'bg-[#FF5500] text-white font-bold' : `${textMuted} hover:text-current`
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>2. ETL & VALIDATION</span>
              </button>
              <button
                onClick={() => setTelemetryStage('BI')}
                className={`px-3 py-2 flex items-center gap-1.5 transition-all ${
                  telemetryStage === 'BI' ? 'bg-[#FF5500] text-white font-bold' : `${textMuted} hover:text-current`
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>3. LIVE POWER BI</span>
              </button>
            </div>
          </div>

          {/* STAGE 1: RAW EXCEL VIEW */}
          {telemetryStage === 'EXCEL' && (
            <div className={`border ${borderCol} ${bgPanel} p-5 space-y-4`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>LEGACY INPUT STREAM: West_India_Attendance_Manual_v8_FINAL(2).xlsx</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/30">
                  4 SCHEMA VIOLATIONS DETECTED IN SAMPLE
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs text-left border-collapse">
                  <thead>
                    <tr className={`${bgSubtle} border-b ${borderCol} ${textMuted}`}>
                      <th className="p-2.5">ROW_ID</th>
                      <th className="p-2.5">EMP_ID (RAW)</th>
                      <th className="p-2.5">EMPLOYEE_NAME</th>
                      <th className="p-2.5">CLIENT_SITE</th>
                      <th className="p-2.5">KYC_TOKEN</th>
                      <th className="p-2.5">LOG_DATE</th>
                      <th className="p-2.5">HOURS</th>
                      <th className="p-2.5">AUDIT DIAGNOSTIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {RAW_EXCEL_ROWS.map((r) => (
                      <tr key={r.rowId} className={r.issue ? 'bg-red-500/5' : ''}>
                        <td className="p-2.5 text-[#9CA3AF]">{r.rowId}</td>
                        <td className="p-2.5 font-semibold">{r.empId}</td>
                        <td className="p-2.5">{r.name}</td>
                        <td className="p-2.5">{r.site}</td>
                        <td className="p-2.5">{r.kyc}</td>
                        <td className="p-2.5">{r.date}</td>
                        <td className="p-2.5">{r.hours}</td>
                        <td className="p-2.5">
                          {r.issue ? (
                            <span className="text-red-400 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{r.status}: {r.issue}</span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>VALID</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className={`text-xs ${textMuted}`}>
                  Without automated validation rules, manual spreadsheets create payroll delays and audit risk across 7,000+ active employees.
                </p>
                <button
                  onClick={() => setTelemetryStage('ETL')}
                  className="px-4 py-2 bg-[#FF5500] text-white font-mono text-xs font-bold flex items-center gap-2 shrink-0"
                >
                  <span>EXECUTE ETL SANITIZATION PIPELINE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: ETL & VALIDATION VIEW */}
          {telemetryStage === 'ETL' && (
            <div className={`border ${borderCol} ${bgPanel} p-5 space-y-5`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                  <Terminal className="w-4 h-4" />
                  <span>STAGE 2 // AUTOMATED POWER QUERY + SQL + PYTHON VALIDATION ENGINE</span>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  7,000+ RECORDS NORMALIZED AT 99.9% ACCURACY
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className={`p-4 ${bgSubtle} border ${borderCol} font-mono text-xs space-y-2`}>
                  <div className="text-[#FF5500] font-bold">// STEP A: SQL & CARE ERP REFERENTIAL INTEGRITY</div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`-- Standardize EMP_ID & isolate unverified KYC records
WITH CleanedFeed AS (
  SELECT 
    CONCAT('EHK_', REGEXP_EXTRACT(emp_id, '\\\\d{4}')) AS clean_emp_id,
    UPPER(TRIM(site_code)) AS standardized_site,
    TRY_CAST(log_date AS DATE) AS iso_date,
    COALESCE(TRY_CAST(hours AS INT), 0) AS valid_hours,
    kyc_status
  FROM raw_regional_staging
)
SELECT * FROM CleanedFeed
WHERE kyc_status = 'VERIFIED' 
  AND valid_hours BETWEEN 1 AND 260;`}
                  </pre>
                </div>

                <div className={`p-4 ${bgSubtle} border ${borderCol} font-mono text-xs space-y-2`}>
                  <div className="text-[#FF5500] font-bold">// STEP B: DAX EXECUTIVE TELEMETRY MEASURES</div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-amber-200">
{`// Calculate 99.9% Database Governance Score
Master_DB_Accuracy = 
VAR TotalActive = COUNTROWS('CARE_Master_Workforce')
VAR Exceptions = 
    CALCULATE(
        COUNTROWS('CARE_Master_Workforce'),
        'CARE_Master_Workforce'[KYC_Verified] = FALSE() ||
        ISBLANK('CARE_Master_Workforce'[Site_ID])
    )
RETURN
    DIVIDE(TotalActive - Exceptions, TotalActive, 0)`}
                  </pre>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-emerald-400 font-bold">✓ DUPLICATES MERGED</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">✓ ISO-8601 DATES ENFORCED</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">✓ KYC GATED</span>
                </div>
                <button
                  onClick={() => setTelemetryStage('BI')}
                  className="px-4 py-2 bg-[#FF5500] text-white font-mono text-xs font-bold flex items-center gap-2 shrink-0"
                >
                  <span>LAUNCH LIVE POWER BI DASHBOARD</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: LIVE POWER BI EXECUTIVE TELEMETRY */}
          {telemetryStage === 'BI' && (
            <div className={`border ${borderCol} ${bgPanel} p-5 space-y-6`}>
              {/* Top Filter Bar inside BI Simulator */}
              <div className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${borderCol}`}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    POWER BI EXECUTIVE TELEMETRY // {currentBiData.label}
                  </span>
                </div>

                {/* Region Slicer Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                  <span className={`mr-1 flex items-center gap-1 ${textMuted}`}>
                    <Filter className="w-3.5 h-3.5 text-[#FF5500]" /> SLICER:
                  </span>
                  {Object.keys(BI_REGIONAL_DATA).map((rk) => (
                    <button
                      key={rk}
                      onClick={() => setSelectedRegion(rk)}
                      className={`px-2.5 py-1 border transition-colors ${
                        selectedRegion === rk
                          ? 'bg-[#FF5500] text-white border-[#FF5500] font-bold'
                          : `${bgSubtle} ${borderCol} hover:border-[#FF5500]`
                      }`}
                    >
                      {rk}
                    </button>
                  ))}
                </div>
              </div>

              {/* BI KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
                <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                  <div className={`text-[10px] ${textMuted}`}>GOVERNED RECORDS</div>
                  <div className="text-xl font-bold mt-1">{currentBiData.records}</div>
                </div>
                <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                  <div className={`text-[10px] ${textMuted}`}>DB & KYC ACCURACY</div>
                  <div className="text-xl font-bold text-emerald-500 mt-1">{currentBiData.accuracy}</div>
                </div>
                <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                  <div className={`text-[10px] ${textMuted}`}>TURNAROUND TIME</div>
                  <div className="text-xl font-bold text-[#FF5500] mt-1">{currentBiData.turnaroundDelta}</div>
                </div>
                <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                  <div className={`text-[10px] ${textMuted}`}>ACTIVE CLIENT SITES</div>
                  <div className="text-xl font-bold mt-1">{currentBiData.activeSites} Sites</div>
                </div>
                <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                  <div className={`text-[10px] ${textMuted}`}>AUDIT SLA SCORE</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{currentBiData.slaScore}%</div>
                </div>
                <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                  <div className={`text-[10px] ${textMuted}`}>CLIENT FEEDBACK KPI</div>
                  <div className="text-xl font-bold mt-1">{currentBiData.clientFeedback}</div>
                </div>
              </div>

              {/* Visual Telemetry Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 7 Cols: Reporting Turnaround Compression Bar Chart */}
                <div className={`lg:col-span-7 p-4 border ${borderCol} ${bgSubtle} space-y-4`}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold">MONTHLY REPORTING TURNAROUND (MANUAL EXCEL HRS vs. POWER BI HRS)</span>
                    <span className="text-emerald-400">~25% TIME SAVED</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {currentBiData.monthlyTrend.map((item) => {
                      const maxHrs = 50;
                      const manualPct = Math.min(100, Math.round((item.manualHrs / maxHrs) * 100));
                      const biPct = Math.min(100, Math.round((item.biHrs / maxHrs) * 100));
                      return (
                        <div key={item.month} className="space-y-1 font-mono text-xs">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-bold">{item.month} 2026</span>
                            <span className={textMuted}>
                              Legacy: {item.manualHrs}h ➔ <strong className="text-emerald-400">Power BI: {item.biHrs}h</strong> (SLA: {item.sla}%)
                            </span>
                          </div>
                          <div className="w-full h-5 bg-black/30 relative flex flex-col justify-center gap-0.5 p-0.5">
                            <div
                              className="h-1.5 bg-neutral-500/60 transition-all duration-300"
                              style={{ width: `${manualPct}%` }}
                              title={`Manual Excel: ${item.manualHrs} hrs`}
                            />
                            <div
                              className="h-2 bg-[#FF5500] transition-all duration-300"
                              style={{ width: `${biPct}%` }}
                              title={`Live Power BI: ${item.biHrs} hrs`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 Cols: Audit Readiness & Governance Breakdown */}
                <div className={`lg:col-span-5 p-4 border ${borderCol} ${bgSubtle} flex flex-col justify-between space-y-4`}>
                  <div>
                    <div className="font-mono text-xs font-bold mb-3">
                      ENTERPRISE WORKFLOW TELEMETRY SUMMARY
                    </div>
                    <ul className="space-y-2.5 text-xs">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Automated Data Ingestion:</strong> Eliminated manual copy-pasting across {currentBiData.activeSites} sites via Power Query connectors.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>KYC & Statutory Governance:</strong> {currentBiData.kycVerified} verified employee compliance across CARE ERP records.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Client-Facing Transparency:</strong> Interactive drill-downs allow clients (Dell, eBay, Philips, WNS) to inspect real-time SLA adherence.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-3 border ${borderCol} ${bgPanel} font-mono text-[11px] flex items-center justify-between`}>
                    <span>PIPELINE STATUS: <strong className="text-emerald-400">PRODUCTION_LIVE</strong></span>
                    <button
                      onClick={() => setTelemetryStage('EXCEL')}
                      className="text-[#FF5500] underline hover:no-underline"
                    >
                       Compare with Raw Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 03. PROFESSIONAL EXPERIENCE (INTERACTIVE AUDIT LOG) */}
        <section id="experience" className={`py-14 border-b ${borderCol}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs text-[#FF5500] uppercase tracking-widest mb-1">
                // 03. PRODUCTION TRACK RECORD
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Professional Experience
              </h2>
            </div>
            <div className="font-mono text-xs flex items-center gap-3">
              <span className="px-2.5 py-1 border border-[#FF5500]/40 bg-[#FF5500]/10 text-[#FF5500] font-semibold">
                Express Housekeeper Pvt. Ltd. (EHK)
              </span>
              <span className={textMuted}>Jan 2025 – Present | Thane, Maharashtra</span>
            </div>
          </div>

          {/* Role Banner */}
          <div className={`p-5 border ${borderCol} ${bgPanel} mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <div className="text-lg sm:text-xl font-bold">
                Data Operations Assistant <span className="text-[#FF5500]">|</span> Express Housekeeper Pvt. Ltd. (EHK)
              </div>
              <p className={`text-xs sm:text-sm ${textMuted} mt-0.5`}>
                Governing 7,000+ active employee records across West India • Delivering 100% audit-ready datasets across 100+ enterprise sites
              </p>
            </div>
            <div className="font-mono text-xs text-right shrink-0">
              <div className="text-emerald-400 font-bold">FULL-TIME // ON-SITE</div>
              <div className={textMuted}>THANE, MAHARASHTRA, IN</div>
            </div>
          </div>

          {/* 4 Interactive Experience Pillars */}
          <div className="space-y-3">
            {EXPERIENCE_LOGS.map((log) => {
              const isOpen = expandedExp === log.id;
              return (
                <div
                  key={log.id}
                  className={`border transition-colors ${
                    isOpen ? 'border-[#FF5500]' : borderCol
                  } ${bgPanel}`}
                >
                  <button
                    onClick={() => setExpandedExp(isOpen ? null : log.id)}
                    className="w-full p-4 sm:p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="font-mono text-xs px-2 py-1 bg-[#FF5500]/15 text-[#FF5500] font-bold">
                        {log.id}
                      </span>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg">{log.pillar}</h3>
                        <div className={`font-mono text-[11px] ${textMuted}`}>{log.tag}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="font-mono text-xs px-2.5 py-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold">
                        {log.metric}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90 text-[#FF5500]' : textMuted}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className={`px-4 sm:px-5 pb-5 pt-2 border-t ${borderCol} space-y-4`}>
                      <p className="text-sm sm:text-base leading-relaxed">
                        {log.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                        <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                          <div className="text-amber-400 font-bold mb-1">LEGACY STATE (BEFORE):</div>
                          <p className={`font-sans ${textMuted}`}>{log.beforeState}</p>
                        </div>
                        <div className={`p-3 border ${borderCol} ${bgSubtle}`}>
                          <div className="text-emerald-400 font-bold mb-1">ARCHITECTED STATE (AFTER):</div>
                          <p className={`font-sans ${textMuted}`}>{log.afterState}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className={textMuted}>DELIVERABLES:</span>
                        {log.artifacts.map((art) => (
                          <span key={art} className={`px-2 py-0.5 border ${borderCol} ${bgSubtle}`}>
                            {art}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 04. TECHNICAL & STRATEGIC COMPETENCIES — STRICT 4x4 ARCHITECTURAL MATRIX */}
        <section id="skills-grid" className={`py-14 border-b ${borderCol}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs text-[#FF5500] uppercase tracking-widest mb-1">
                // 04. STRICT 4×4 COMPETENCY ARCHITECTURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Technical & Strategic Competencies (16-Skill Matrix)
              </h2>
              <p className={`text-sm mt-1 ${textMuted}`}>
                Sequenced logically from BI & Telemetry to Databases, Python/ML, and Commercial Strategy. Click any cell to inspect production implementation.
              </p>
            </div>
            <div className="font-mono text-xs text-emerald-400">
              ACTIVE INSPECTION: [{selectedSkill.name.toUpperCase()}]
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Exact 4x4 Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {SKILLS_16_GRID.map((skill) => {
                const isSelected = selectedSkill.name === skill.name;
                return (
                  <button
                    key={skill.name}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-3.5 text-left border transition-all flex flex-col justify-between min-h-[96px] ${
                      isSelected
                        ? 'border-[#FF5500] bg-[#FF5500]/10 shadow-sm'
                        : `${borderCol} ${bgPanel} hover:border-[#FF5500]/60`
                    }`}
                  >
                    <div className="flex items-center justify-between w-full font-mono text-[10px]">
                      <span className={isSelected ? 'text-[#FF5500] font-bold' : textMuted}>{skill.pos}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FF5500]' : 'bg-emerald-500/60'}`} />
                    </div>
                    <div className="my-2">
                      <div className="font-bold text-xs sm:text-sm leading-snug">• {skill.name}</div>
                    </div>
                    <div className={`font-mono text-[10px] ${textMuted} truncate`}>{skill.domain}</div>
                  </button>
                );
              })}
            </div>

            {/* Right 5 Columns: Live Production Code & Use-Case Inspector */}
            <div className={`lg:col-span-5 border ${borderCol} ${bgPanel} p-5 space-y-4 sticky top-20`}>
              <div className={`flex items-center justify-between border-b ${borderCol} pb-3 font-mono text-xs`}>
                <span className="text-[#FF5500] font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  SKILL_INSPECTOR // {selectedSkill.pos}
                </span>
                <span className={`px-2 py-0.5 ${bgSubtle} border ${borderCol}`}>{selectedSkill.domain}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold">{selectedSkill.name}</h3>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${textMuted}`}>
                  {selectedSkill.productionUse}
                </p>
              </div>

              <div className={`p-3.5 ${bgSubtle} border ${borderCol} font-mono text-xs space-y-2`}>
                <div className="text-[11px] text-emerald-400 font-semibold">{selectedSkill.snippetTitle}</div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed">
                  {selectedSkill.snippet}
                </pre>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] pt-1">
                <span className={textMuted}>VERIFIED IN: EHK OPS & MASTER CERT</span>
                <span className="text-emerald-400">PRODUCTION READY</span>
              </div>
            </div>
          </div>
        </section>

        {/* 05. KEY TECHNICAL PROJECTS (WITH INTERACTIVE ML & BI SIMULATORS) */}
        <section id="projects" className={`py-14 border-b ${borderCol}`}>
          <div className="mb-8">
            <div className="font-mono text-xs text-[#FF5500] uppercase tracking-widest mb-1">
              // 05. APPLIED DATA SCIENCE & BI ENGINEERING
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Key Technical Projects & Interactive Simulators
            </h2>
          </div>

          <div className="space-y-10">
            {/* PROJECT 01: RETAIL CUSTOMER RETENTION & CHURN PREDICTION MODEL */}
            <div className={`border ${borderCol} ${bgPanel} p-5 sm:p-7`}>
              <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b ${borderCol}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
                    <span className="px-2 py-0.5 bg-[#FF5500] text-white font-bold">PROJECT 01</span>
                    <span className="px-2.5 py-0.5 border border-[#FF5500]/40 text-[#FF5500] font-semibold">
                      [Python • Scikit-Learn • SQL • Pandas • EDA]
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Retail Customer Retention & Churn Prediction Model
                  </h3>
                </div>

                <div className={`inline-flex p-1 border ${borderCol} ${bgSubtle} font-mono text-xs self-start`}>
                  <button
                    onClick={() => setProject1Tab('SIMULATOR')}
                    className={`px-3 py-1.5 ${
                      project1Tab === 'SIMULATOR' ? 'bg-[#FF5500] text-white font-bold' : textMuted
                    }`}
                  >
                    LIVE CHURN SIMULATOR
                  </button>
                  <button
                    onClick={() => setProject1Tab('CODE')}
                    className={`px-3 py-1.5 ${
                      project1Tab === 'CODE' ? 'bg-[#FF5500] text-white font-bold' : textMuted
                    }`}
                  >
                    PYTHON / SQL PIPELINE
                  </button>
                </div>
              </div>

              <p className={`text-sm sm:text-base mt-4 leading-relaxed ${textMuted}`}>
                Architected an end-to-end predictive classification pipeline using{' '}
                <strong className={darkMode ? 'text-white' : 'text-black'}>Python (Scikit-Learn, Pandas)</strong> and{' '}
                <strong className={darkMode ? 'text-white' : 'text-black'}>SQL</strong> to evaluate customer behavioral telemetry and forecast churn risk for retail/FMCG operations, isolating high-value segments to drive targeted retention strategies.
              </p>

              {project1Tab === 'SIMULATOR' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
                  {/* Sliders Input Panel */}
                  <div className={`lg:col-span-7 p-5 border ${borderCol} ${bgSubtle} space-y-4 font-mono text-xs`}>
                    <div className="flex items-center justify-between border-b border-neutral-700/40 pb-2">
                      <span className="font-bold flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#FF5500]" />
                        CUSTOMER TELEMETRY INPUT PARAMETERS
                      </span>
                      <span className={textMuted}>ADJUST SLIDERS</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>RECENCY (Days Since Last Order)</span>
                        <span className="font-bold text-[#FF5500]">{recencyDays} Days</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="120"
                        value={recencyDays}
                        onChange={(e) => setRecencyDays(Number(e.target.value))}
                        className="w-full accent-[#FF5500] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>PURCHASE FREQUENCY (Orders / Month)</span>
                        <span className="font-bold text-[#FF5500]">{monthlyOrders} Orders/mo</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        value={monthlyOrders}
                        onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                        className="w-full accent-[#FF5500] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>AVG BASKET VALUE (INR ₹)</span>
                        <span className="font-bold text-emerald-400">₹{avgBasketValue.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="15000"
                        step="500"
                        value={avgBasketValue}
                        onChange={(e) => setAvgBasketValue(Number(e.target.value))}
                        className="w-full accent-[#FF5500] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>UNRESOLVED SUPPORT TICKETS (Last 90d)</span>
                        <span className="font-bold text-amber-400">{supportTickets} Tickets</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6"
                        value={supportTickets}
                        onChange={(e) => setSupportTickets(Number(e.target.value))}
                        className="w-full accent-[#FF5500] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Model Classification Output Panel */}
                  <div className={`lg:col-span-5 p-5 border ${borderCol} ${bgSubtle} space-y-4 font-mono`}>
                    <div className="text-xs text-[#9CA3AF]">SCIKIT-LEARN CLASSIFIER OUTPUT</div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-xs">PREDICTED CHURN PROBABILITY</div>
                        <div className={`text-4xl font-bold mt-1 ${churnSimulation.probability >= 60 ? 'text-[#FF5500]' : 'text-emerald-400'}`}>
                          {churnSimulation.probability}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#9CA3AF]">EST. ANNUAL LTV</div>
                        <div className="text-lg font-bold">₹{churnSimulation.annualLtv.toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Visual Risk Bar */}
                    <div className="w-full h-2.5 bg-black/40 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          churnSimulation.probability >= 60 ? 'bg-[#FF5500]' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${churnSimulation.probability}%` }}
                      />
                    </div>

                    <div className="pt-1">
                      <div className="text-[11px] text-[#9CA3AF] mb-1">ISOLATED CUSTOMER SEGMENT:</div>
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold border ${churnSimulation.badgeColor}`}>
                        {churnSimulation.segment}
                      </span>
                    </div>

                    <div className={`p-3 border ${borderCol} ${bgPanel} text-xs font-sans`}>
                      <div className="font-mono text-[10px] text-[#FF5500] font-bold mb-1">
                        COMMERCIAL RETENTION STRATEGY:
                      </div>
                      {churnSimulation.recommendation}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`mt-6 p-4 ${bgSubtle} border ${borderCol} font-mono text-xs`}>
                  <div className="text-[#FF5500] font-bold mb-2">
                    // SQL COHORT EXTRACTION + PYTHON SCIKIT-LEARN CLASSIFICATION PIPELINE
                  </div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`# 1. Extract behavioral RFM telemetry from SQL warehouse
query = """
SELECT customer_id,
       DATEDIFF(CURRENT_DATE, MAX(order_date)) AS recency_days,
       COUNT(DISTINCT order_id) AS order_frequency,
       AVG(order_total_inr) AS avg_basket_inr,
       SUM(CASE WHEN ticket_status = 'OPEN' THEN 1 ELSE 0 END) AS support_tickets,
       churn_label
FROM retail_fmcg_telemetry
GROUP BY customer_id, churn_label;
"""

# 2. Train balanced Random Forest & isolate High-LTV churn risk
X = df[['recency_days', 'order_frequency', 'avg_basket_inr', 'support_tickets']]
y = df['churn_label']

model = RandomForestClassifier(n_estimators=300, max_depth=9, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)
df['churn_prob'] = model.predict_proba(X)[:, 1]
high_value_targets = df[(df['churn_prob'] >= 0.65) & (df['avg_basket_inr'] >= 3500)]`}
                  </pre>
                </div>
              )}
            </div>

            {/* PROJECT 02: SUPPLY CHAIN & INVENTORY FORECASTING ANALYTICS */}
            <div className={`border ${borderCol} ${bgPanel} p-5 sm:p-7`}>
              <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b ${borderCol}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold">PROJECT 02</span>
                    <span className="px-2.5 py-0.5 border border-emerald-500/40 text-emerald-400 font-semibold">
                      [Power BI • DAX • Power Query • SQL • ETL]
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Supply Chain & Inventory Forecasting Analytics
                  </h3>
                </div>

                <div className={`inline-flex p-1 border ${borderCol} ${bgSubtle} font-mono text-xs self-start`}>
                  <button
                    onClick={() => setProject2Tab('TELEMETRY')}
                    className={`px-3 py-1.5 ${
                      project2Tab === 'TELEMETRY' ? 'bg-[#FF5500] text-white font-bold' : textMuted
                    }`}
                  >
                    HUB DEMAND EXPLORER
                  </button>
                  <button
                    onClick={() => setProject2Tab('DAX')}
                    className={`px-3 py-1.5 ${
                      project2Tab === 'DAX' ? 'bg-[#FF5500] text-white font-bold' : textMuted
                    }`}
                  >
                    ETL & DAX ARCHITECTURE
                  </button>
                </div>
              </div>

              <p className={`text-sm sm:text-base mt-4 leading-relaxed ${textMuted}`}>
                Engineered automated{' '}
                <strong className={darkMode ? 'text-white' : 'text-black'}>ETL data extraction pipelines</strong> and interactive{' '}
                <strong className={darkMode ? 'text-white' : 'text-black'}>Power BI executive dashboards</strong> to monitor regional inventory flows, demand forecasting accuracy, and logistical bottlenecks—translating raw model outputs into commercial strategy.
              </p>

              {project2Tab === 'TELEMETRY' ? (
                <div className="mt-6 space-y-5">
                  {/* Hub Selector Buttons */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className={textMuted}>SELECT REGIONAL LOGISTICS HUB:</span>
                    {Object.keys(SUPPLY_CHAIN_HUBS).map((hubKey) => (
                      <button
                        key={hubKey}
                        onClick={() => setSelectedHub(hubKey)}
                        className={`px-3 py-1.5 border transition-colors ${
                          selectedHub === hubKey
                            ? 'bg-[#FF5500] text-white border-[#FF5500] font-bold'
                            : `${bgSubtle} ${borderCol} hover:border-[#FF5500]`
                        }`}
                      >
                        {hubKey.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                    <div className={`lg:col-span-5 p-4 border ${borderCol} ${bgSubtle} space-y-3 font-mono text-xs`}>
                      <div className="font-bold text-sm text-[#FF5500]">{currentHubData.name}</div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className={`p-2.5 border ${borderCol} ${bgPanel}`}>
                          <div className={`text-[10px] ${textMuted}`}>FORECAST ACCURACY</div>
                          <div className="text-lg font-bold text-emerald-400">{currentHubData.forecastAccuracy}</div>
                        </div>
                        <div className={`p-2.5 border ${borderCol} ${bgPanel}`}>
                          <div className={`text-[10px] ${textMuted}`}>AVG LEAD TIME</div>
                          <div className="text-lg font-bold">{currentHubData.leadTimeDays}</div>
                        </div>
                        <div className={`p-2.5 border ${borderCol} ${bgPanel}`}>
                          <div className={`text-[10px] ${textMuted}`}>ACTIVE SKU COUNT</div>
                          <div className="text-lg font-bold">{currentHubData.skuCount}</div>
                        </div>
                        <div className={`p-2.5 border ${borderCol} ${bgPanel}`}>
                          <div className={`text-[10px] ${textMuted}`}>STOCKOUT RISK</div>
                          <div className="text-lg font-bold text-[#FF5500]">{currentHubData.stockoutRisk}</div>
                        </div>
                      </div>
                      <div className={`p-3 border ${borderCol} ${bgPanel} font-sans text-xs`}>
                        <strong className="font-mono text-[10px] text-emerald-400 block mb-0.5">
                          COMMERCIAL STRATEGY IMPACT:
                        </strong>
                        {currentHubData.bottleneckNote}
                      </div>
                    </div>

                    {/* Forecast vs Actual Telemetry Bars */}
                    <div className={`lg:col-span-7 p-4 border ${borderCol} ${bgSubtle} space-y-3 font-mono text-xs`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">QUARTERLY DEMAND TELEMETRY (ACTUAL vs. MODEL FORECAST UNITS)</span>
                        <span className={textMuted}>IN THOUSANDS</span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {currentHubData.quarters.map((qItem) => {
                          const maxVal = 1350;
                          const actPct = Math.round((qItem.actual / maxVal) * 100);
                          const fcPct = Math.round((qItem.forecast / maxVal) * 100);
                          return (
                            <div key={qItem.q} className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="font-bold">{qItem.q} 2026</span>
                                <span>
                                  Actual: <strong>{qItem.actual}k</strong> | Forecast: <strong className="text-emerald-400">{qItem.forecast}k</strong> | Safety Stock: {qItem.safety}k
                                </span>
                              </div>
                              <div className="w-full h-5 bg-black/30 p-0.5 flex flex-col justify-center gap-0.5">
                                <div className="h-1.5 bg-[#FF5500]" style={{ width: `${actPct}%` }} />
                                <div className="h-1.5 bg-emerald-400" style={{ width: `${fcPct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`mt-6 p-4 ${bgSubtle} border ${borderCol} font-mono text-xs`}>
                  <div className="text-emerald-400 font-bold mb-2">
                    // POWER BI DAX: FORECAST ACCURACY (MAPE) & DYNAMIC REORDER POINT
                  </div>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-amber-200">
{`Demand_Forecast_Accuracy_% = 
VAR AbsoluteError = 
    SUMX(
        'Inventory_Telemetry',
        ABS('Inventory_Telemetry'[Actual_Units] - 'Inventory_Telemetry'[Forecast_Units])
    )
VAR TotalActual = SUM('Inventory_Telemetry'[Actual_Units])
RETURN
    1 - DIVIDE(AbsoluteError, TotalActual, 0)

Dynamic_Reorder_Trigger = 
VAR CurrentStock = SUM('Inventory_Telemetry'[OnHand_Qty])
VAR ReorderThreshold = [Avg_Daily_Usage] * [Vendor_Lead_Time_Days] + [Safety_Stock_Buffer]
RETURN
    IF(CurrentStock <= ReorderThreshold, "TRIGGER_PO_IMMEDIATE", "OPTIMAL_BUFFER")`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 06. EDUCATION, CERTIFICATIONS & DIRECT RECRUITER ACTION FOOTER */}
        <section id="credentials" className="pt-14">
          <div className="mb-8">
            <div className="font-mono text-xs text-[#FF5500] uppercase tracking-widest mb-1">
              // 06. ACADEMIC & TECHNICAL CREDENTIALS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Education & Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            <div className={`p-6 border ${borderCol} ${bgPanel} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="px-2 py-0.5 bg-[#FF5500]/15 text-[#FF5500] font-bold">
                    MASTER CERTIFICATION
                  </span>
                  <span className="text-emerald-400 font-semibold">COMPLETED</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Master Certification in Data Science, Machine Learning & AI
                </h3>
                <p className={`text-sm mt-1 ${textMuted}`}>
                  Digifine Academy of Digital Education (DADE)
                </p>
              </div>
              <div className={`mt-4 pt-3 border-t ${borderCol} font-mono text-xs ${textMuted}`}>
                STACK: Python • Scikit-Learn • SQL • Power BI • TensorFlow • NLP • Predictive Statistics
              </div>
            </div>

            <div className={`p-6 border ${borderCol} ${bgPanel} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className={`px-2 py-0.5 border ${borderCol} ${bgSubtle} font-bold`}>
                    BACHELOR'S DEGREE
                  </span>
                  <span className="font-semibold">2023 – 2026 | CGPA: 7.9 / 10.0</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Bachelor of Management Studies (BMS - Marketing)
                </h3>
                <p className={`text-sm mt-1 ${textMuted}`}>
                  A.E. Kalsekar Degree College, University of Mumbai
                </p>
              </div>
              <div className={`mt-4 pt-3 border-t ${borderCol} font-mono text-xs ${textMuted}`}>
                FOCUS: Commercial Strategy • ROI Analysis • Consumer Analytics • Operations Management
              </div>
            </div>
          </div>

          {/* TERMINAL DISPATCH FOOTER */}
          <div className={`border-2 border-[#FF5500] ${bgPanel} p-6 sm:p-8`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2">
                <div className="font-mono text-xs text-[#FF5500] font-bold uppercase tracking-wider">
                  // READY FOR IMMEDIATE DEPLOYMENT
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Hiring for Data Analyst, Business Intelligence, or Data Science roles?
                </h3>
                <p className={`text-sm ${textMuted}`}>
                  Available for full-time opportunities across Mumbai, Thane, Navi Mumbai, Pune, and remote global teams.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end font-mono text-xs">
                <button
                  onClick={() => handleCopy('khanhanzala0987@gmail.com', 'EMAIL: khanhanzala0987@gmail.com')}
                  className="px-4 py-3 bg-[#FF5500] text-white font-bold hover:bg-[#e04b00] flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>khanhanzala0987@gmail.com</span>
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setShowResumeModal(true)}
                  className={`px-4 py-3 border ${borderCol} ${bgSubtle} hover:border-[#FF5500] font-bold flex items-center gap-2 transition-colors`}
                >
                  <FileText className="w-4 h-4 text-[#FF5500]" />
                  <span>VIEW FULL ATS RESUME</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ATS RESUME QUICK-VIEW MODAL */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`max-w-4xl w-full border ${borderCol} ${bgPanel} p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6`}>
            <div className={`flex items-center justify-between border-b ${borderCol} pb-4`}>
              <div className="font-mono text-xs text-[#FF5500] font-bold">
                // VERIFIED 9.8/10 ATS RESUME SPECIFICATION
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className={`p-1.5 border ${borderCol} hover:border-[#FF5500]`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="text-center border-b pb-4 border-neutral-700/40">
                <h2 className="text-2xl font-bold tracking-wide">HANZALA KHAN</h2>
                <div className="text-[#FF5500] font-semibold mt-0.5">
                  Data Operations & Analyst | Business Intelligence (BI) | Data Scientist
                </div>
                <div className={`font-mono text-xs mt-1 ${textMuted}`}>
                  Thane, Maharashtra, India | +91 79779 39389 | khanhanzala0987@gmail.com
                </div>
                <div className={`font-mono text-xs ${textMuted}`}>
                  linkedin.com/in/khan-hanzala01 | github.com/khanhanzala0987-hub
                </div>
              </div>

              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#FF5500] mb-1">Professional Summary</h4>
                <p>
                  <strong>99.9% data integrity. 7,000+ database records architected. Raw Excel chaos transformed into live Power BI dashboards.</strong> Data Operations & Business Intelligence Analyst backed by a Management degree and a Master Certification in Data Science & Machine Learning, and nearly 2 years of enterprise data operations experience. Proven track record in bridging the gap between backend data operations and commercial business strategy through end-to-end data workflows, automated ETL pipelines, and interactive Power BI ecosystems that give stakeholders real-time operational telemetry.
                </p>
              </div>

              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#FF5500] mb-1">
                  Professional Experience — Express Housekeeper Pvt. Ltd. (EHK) [Jan 2025 – Present]
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>BI & Reporting Automation:</strong> Spearheaded migration from legacy manual Excel tracking to live, interactive Power BI dashboards—automating data ingestion, cleaning, and KPI visualization for ~25% faster reporting turnaround.</li>
                  <li><strong>Enterprise Data Engineering:</strong> Engineered and delivered zero-defect, 100% audit-ready operational and compliance datasets across 100+ client environments (Dell, eBay, Philips, Tech Mahindra, WNS, Colgate-Palmolive, Voltas).</li>
                  <li><strong>Database Administration & ETL:</strong> Governed master database schemas and KYC verification records for 7,000+ active employees across West India at 99.9% accuracy via CARE enterprise portal and Advanced Excel.</li>
                  <li><strong>Technical & Operational Leadership:</strong> Aligned backend database administration, payroll, and statutory compliance workflows with executive business strategy across Mumbai.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-xs font-bold uppercase text-[#FF5500] mb-2">
                  Technical & Strategic Competencies (4×4 Matrix)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {SKILLS_16_GRID.map((s) => (
                    <div key={s.name} className={`p-2 border ${borderCol} ${bgSubtle}`}>• {s.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}