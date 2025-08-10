# 🚀 Lumesix Frontend Development Guide

## ⚠️ CRITICAL: What Lumesix Actually Is

**Lumesix is NOT a personal subscription tracker app.**

**Lumesix IS a B2B SaaS analytics platform** for mobile app developers who use RevenueCat for in-app subscriptions.

---

## 🎯 Target Users & Use Case

### Who Uses Lumesix?
- **Mobile app developers** (iOS/Android)
- **Product managers** at app companies
- **Growth teams** optimizing subscription revenue
- **Indie developers** with subscription apps

### What Problem Does Lumesix Solve?
- **RevenueCat Data Analysis** - Raw RevenueCat data is hard to interpret
- **AI-Powered Insights** - Predict churn, optimize pricing, analyze cohorts
- **Business Intelligence** - Turn subscription data into actionable recommendations
- **Revenue Optimization** - Help developers make more money from their apps

### Example Lumesix Customer:
"I have a meditation app with 10K paid subscribers using RevenueCat. I want to:
- See which subscription plans have the highest churn
- Get AI predictions on which customers might cancel
- Optimize my pricing strategy
- Understand my customer lifetime value"

---

## 🏗️ Correct App Architecture

### Authentication Flow
1. **Landing/Login Screen** - Developer signs up for Lumesix
2. **RevenueCat Setup** - Connect their RevenueCat API key
3. **Dashboard** - View their app's subscription analytics
4. **AI Insights** - Get business recommendations

### Core Screens Needed

#### 1. **Dashboard Screen** (Main)
**File Path:** `app/(tabs)/index.tsx` or `app/(tabs)/dashboard.tsx`
**Route:** `/dashboard` or `/` (home)
**Purpose:** Overview of the developer's app subscription metrics

**Key Metrics to Display:**
- **Monthly Recurring Revenue (MRR)** - $45,230
- **Active Subscribers** - 8,432 users
- **Churn Rate** - 5.2% monthly
- **Customer Lifetime Value (LTV)** - $89.40
- **Conversion Rate** - 3.8% trial-to-paid
- **New Subscribers** - +234 this month
- **Revenue Growth** - +12.5% vs last month

**Visual Elements:**
- Revenue trend charts (line graphs)
- Subscriber growth charts
- Churn rate visualization
- Top performing subscription plans
- Recent customer activity feed

#### 2. **AI Insights Screen**
**File Path:** `app/(tabs)/insights.tsx`
**Route:** `/insights`
**Purpose:** AI-powered business recommendations

**Insight Types:**
```
🔻 CHURN PREDICTION
"83 subscribers at high risk of churning in next 7 days"
Action: Send retention campaign to at-risk users

💰 PRICING OPTIMIZATION  
"Decrease Premium plan from $9.99 to $8.99"
Expected: +15% revenue increase

👥 COHORT ANALYSIS
"March 2024 cohort has 23% better retention"
Action: Analyze what made March acquisition successful

📊 SEASONAL PATTERNS
"Subscriptions spike 40% in January (New Year effect)"
Action: Prepare marketing campaigns for December
```

#### 3. **Customers Screen**
**File Path:** `app/(tabs)/customers.tsx`
**Route:** `/customers`
**Purpose:** Deep dive into subscriber data

**Features:**
- Customer list with subscription status
- Individual customer lifetime value
- Churn risk scores per customer
- Subscription history and behavior
- Cohort analysis tools

#### 4. **Revenue Screen**
**File Path:** `app/(tabs)/revenue.tsx`
**Route:** `/revenue`
**Purpose:** Financial analytics and forecasting

**Features:**
- Revenue breakdown by subscription plan
- Revenue forecasting (next 3-6 months)
- Plan performance comparison
- Refund and cancellation analysis
- Financial health indicators

#### 5. **Settings Screen**
**File Path:** `app/(tabs)/settings.tsx`
**Route:** `/settings`
**Purpose:** App settings and integrations

**Features:**
- RevenueCat connection status
- API key management
- Notification preferences
- Data export options
- App preferences (dark mode, refresh intervals)
- Privacy settings

#### 6. **Profile Screen** (NEW)
**File Path:** `app/(tabs)/profile.tsx` or `app/profile.tsx`
**Route:** `/profile`
**Purpose:** User account management and billing

**Features:**
- **Account Information**
  - Name, email, company details
  - Account creation date
  - Subscription plan (Free/Pro/Enterprise)
- **Billing & Subscription**
  - Current plan details
  - Usage metrics (API calls, data storage)
  - Billing history
  - Upgrade/downgrade options
- **Account Actions**
  - Change password
  - Update email address
  - Delete account
  - Export data
- **Support & Documentation**
  - Help center links
  - Contact support
  - API documentation
  - Changelog/updates

---

## 🎨 UI/UX Guidelines

### Design Principles
1. **Business-Focused** - Clean, professional, data-heavy interface
2. **Dashboard-Centric** - Metrics and charts are primary content
3. **Actionable Insights** - Every insight should have a clear next step
4. **Mobile Responsive** - Works on phone/tablet for on-the-go checking

### Color Scheme
- **Primary:** Professional blue (#007AFF)
- **Success:** Revenue green (#34C759)
- **Warning:** Churn orange (#FF9500)
- **Danger:** Risk red (#FF3B30)
- **Background:** Clean white/dark mode support

### Key Components Needed

#### MetricCard Component
```typescript
interface MetricCardProps {
  title: string;           // "Monthly Recurring Revenue"
  value: string;           // "$45,230"
  change: number;          // +12.5
  changeType: 'up' | 'down' | 'neutral';
  trend?: number[];        // For sparkline charts
  subtitle?: string;       // "vs last month"
}
```

#### InsightCard Component  
```typescript
interface InsightCardProps {
  type: 'churn' | 'pricing' | 'cohort' | 'seasonal';
  title: string;
  description: string;
  confidence: number;      // 0.85 (85% confidence)
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendation: string;
  supportingData?: any;
}
```

#### RevenueChart Component
```typescript
interface RevenueChartProps {
  data: ChartDataPoint[];
  timeframe: '7d' | '30d' | '90d' | '1y';
  metricType: 'revenue' | 'subscribers' | 'churn';
  showForecast?: boolean;
}
```

---

## 🔌 Backend Integration

### API Endpoints to Use

#### Authentication
- `POST /api/auth/register` - Developer creates account
- `POST /api/auth/login` - Developer logs in

#### RevenueCat Integration
- `POST /api/revenuecat/connect` - Connect RevenueCat API key
- `GET /api/revenuecat/status` - Check connection status  
- `GET /api/revenuecat/dashboard` - Get subscription metrics

#### AI Insights
- `GET /api/ai-insights/dashboard` - Get all insights for dashboard
- `GET /api/ai-insights/churn-prediction` - Churn analysis
- `GET /api/ai-insights/revenue-optimization` - Pricing recommendations
- `GET /api/ai-insights/business-insights` - General business insights

### Sample API Response
```json
{
  "success": true,
  "data": {
    "metrics": {
      "mrr": 45230.50,
      "activeSubscribers": 8432,
      "churnRate": 0.052,
      "ltv": 89.40,
      "conversionRate": 0.038
    },
    "insights": [
      {
        "type": "churn_prediction",
        "title": "High Churn Risk Detected",
        "description": "83 subscribers likely to churn in next 7 days",
        "confidence": 0.87,
        "impact": "high",
        "recommendation": "Send retention offer to at-risk users"
      }
    ]
  }
}
```

---

## 📱 Screen Flow & Navigation

### Bottom Tab Navigation
1. **Dashboard** (🏠) - Main metrics overview `/dashboard`
2. **Insights** (🧠) - AI recommendations `/insights`
3. **Customers** (👥) - Subscriber analysis `/customers`
4. **Revenue** (💰) - Financial analytics `/revenue`
5. **Profile** (👤) - User account & billing `/profile`
6. **Settings** (⚙️) - App settings & integrations `/settings`

**Note:** Consider using a 5-tab layout with Settings accessible via Profile, or implement a drawer/hamburger menu for the 6th item.

### Onboarding Flow
1. **Welcome Screen** - "Optimize your app's subscription revenue"
2. **Register/Login** - Create Lumesix developer account
3. **RevenueCat Setup** - "Connect your RevenueCat account"
4. **Dashboard** - Start viewing analytics

---

## 🚫 What NOT to Build

### ❌ Wrong Examples (What You Built)
- Personal subscription tracker (Netflix, Spotify lists)
- Individual expense management
- Personal finance balance tracking
- Consumer-facing subscription management

### ✅ Correct Examples (What to Build Instead)
- Business subscription analytics dashboard
- Developer-focused RevenueCat insights
- App monetization recommendations
- B2B SaaS analytics interface

---

## 🛠️ Technical Requirements

### Frontend Stack (Keep Current)
- **Expo Router** - File-based routing ✅
- **React Native** - Cross-platform ✅
- **TypeScript** - Type safety ✅
- **Themed Components** - Dark/light mode ✅

### Required Libraries
```json
{
  "recharts": "^2.8.0",        // For revenue charts
  "@expo/vector-icons": "^14.0.0", // For metric icons
  "react-native-svg": "^13.0.0",   // For custom charts
  "date-fns": "^2.30.0"            // For date formatting
}
```

### File Structure
```
app/
├── (tabs)/
│   ├── index.tsx          // Main dashboard (/) 
│   ├── insights.tsx       // AI insights (/insights)
│   ├── customers.tsx      // Customer analytics (/customers)
│   ├── revenue.tsx        // Revenue analytics (/revenue)
│   ├── profile.tsx        // User profile & billing (/profile)
│   ├── settings.tsx       // App settings (/settings)
│   └── _layout.tsx        // Tab layout
├── auth/
│   ├── login.tsx          // Developer login (/auth/login)
│   ├── register.tsx       // Developer signup (/auth/register)
│   └── revenuecat-setup.tsx // Connect RevenueCat (/auth/revenuecat-setup)
├── (modals)/
│   ├── edit-profile.tsx   // Edit profile modal
│   ├── change-password.tsx // Change password modal
│   └── billing.tsx        // Billing details modal
└── _layout.tsx            // Root layout

components/
├── metrics/
│   ├── MetricCard.tsx     // KPI display cards
│   ├── RevenueChart.tsx   // Revenue trend charts
│   └── ChurnChart.tsx     // Churn visualization
├── insights/
│   ├── InsightCard.tsx    // AI insight cards
│   ├── RecommendationCard.tsx // Action recommendations
│   └── ConfidenceIndicator.tsx // AI confidence meter
└── customers/
    ├── CustomerList.tsx   // Subscriber list
    ├── CohortChart.tsx    // Cohort analysis
    └── RiskIndicator.tsx  // Churn risk display
```

---

## 🎨 Visual Examples

### Dashboard Layout
```
┌─────────────────────────────────────┐
│ Lumesix Dashboard            [User] │
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ MRR │ │Subs │ │Churn│ │ LTV │    │
│ │$45K │ │8.4K │ │5.2% │ │$89  │    │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────────────┤
│ Revenue Trend Chart                 │
│ ┌─────────────────────────────────┐ │
│ │    ╭──╮                       │ │
│ │   ╱    ╲     ╭─╮              │ │
│ │  ╱      ╲   ╱   ╲             │ │
│ │ ╱        ╲ ╱     ╲            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Recent Insights                     │
│ 🔻 High churn risk: 83 users       │
│ 💰 Pricing optimization available   │
│ 👥 March cohort performing +23%     │
└─────────────────────────────────────┘
```

### AI Insights Cards
```
┌─────────────────────────────────────┐
│ 🔻 CHURN PREDICTION        [87%]    │
│ High Risk: 83 subscribers           │
│ Likely to churn in next 7 days     │
│ ▼ Action: Send retention campaign   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 💰 PRICING OPTIMIZATION   [75%]     │
│ Premium Plan: $9.99 → $8.99        │
│ Expected +15% revenue increase      │
│ ▼ Action: A/B test new pricing      │
└─────────────────────────────────────┘
```

---

## 🧪 Testing & Demo

### Demo Data Examples
Use realistic B2B subscription app data:

```typescript
const mockMetrics = {
  mrr: 45230.50,
  activeSubscribers: 8432,
  churnRate: 0.052,
  ltv: 89.40,
  conversionRate: 0.038,
  revenueGrowth: 0.125
};

const mockInsights = [
  {
    type: 'churn_prediction',
    title: 'High Churn Risk: 83 Users',
    description: '83 subscribers have 85%+ probability of churning in next 7 days',
    confidence: 0.87,
    impact: 'high',
    recommendation: 'Send targeted retention campaign with 25% discount offer'
  }
];
```

### Test Scenarios
1. **New Developer** - Fresh account, needs to connect RevenueCat
2. **Connected Developer** - Has data, sees full analytics  
3. **High Churn Alert** - Dashboard shows urgent churn insights
4. **Revenue Optimization** - Pricing recommendations available

---

## 📋 Development Checklist

### Phase 1: Core Dashboard
- [ ] Create MetricCard component for KPIs
- [ ] Build revenue trend chart
- [ ] Implement basic dashboard layout
- [ ] Connect to backend metrics API
- [ ] Add loading states and error handling

### Phase 2: AI Insights
- [ ] Create InsightCard component
- [ ] Implement confidence indicators
- [ ] Add insight type icons and colors
- [ ] Connect to AI insights API
- [ ] Add action buttons for recommendations

### Phase 3: RevenueCat Integration
- [ ] Update onboarding flow
- [ ] Fix RevenueCat connection screen
- [ ] Add connection status indicators
- [ ] Handle demo vs real data states

### Phase 4: Advanced Features
- [ ] Customer analytics screen
- [ ] Revenue forecasting charts
- [ ] Cohort analysis visualization
- [ ] Data export functionality

---

## 🎯 Success Criteria

### The Correct UI Should:
1. **Look like a business analytics tool** (not personal finance app)
2. **Show RevenueCat subscription metrics** (MRR, churn, LTV)
3. **Display AI business insights** (churn prediction, pricing optimization)
4. **Help app developers** make data-driven decisions
5. **Feel professional and enterprise-ready**

### Key Questions to Ask:
- Would a mobile app developer find this useful?
- Does it help optimize subscription revenue?
- Are the insights actionable for business decisions?
- Does it solve RevenueCat data analysis problems?

---

## 🚀 Next Steps

1. **Review this guide thoroughly**
2. **Study the existing backend APIs** to understand data structure
3. **Sketch wireframes** for the correct dashboard layout
4. **Start with the dashboard screen** - core metrics first
5. **Test with demo data** that represents a real app's metrics
6. **Get feedback** before building all screens

Remember: **Lumesix helps app developers optimize their subscription revenue using AI insights from RevenueCat data.**

---

**Questions?** Ask about any specific screen, component, or integration details!
