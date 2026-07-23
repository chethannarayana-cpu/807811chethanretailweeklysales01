# Retail Sales Intelligence Dashboard

A modern, full-stack analytics platform for retail performance, store metrics, regional sales trends, and AI-powered business insights.

## 🌟 Key Features

- **Executive KPI Metrics**: Live summary cards tracking Total Sales, Units Sold, Average Order Value (AOV), Profit Margins, and Active Stores with period-over-period comparison badges.
- **Interactive Data Visualization**: Recharts-powered interactive charts detailing sales trends over time, category breakdowns, regional performance, and profit margins.
- **Multi-Dimensional Filter Bar**: Filter metrics dynamically by region, category, store location, and custom date ranges with quick date presets.
- **AI Business Analyst**: Integrated AI insights powered by Google Gemini to analyze sales patterns, highlight top performers, flag anomalies, and provide strategic recommendations.
- **Store Leaderboard**: Ranked store list highlighting top-performing outlets, growth percentages, and key metrics.
- **Data Upload & Excel Parser**: Upload custom CSV or Excel (`.xlsx`) datasets with built-in schema parsing and formula validation.
- **Export & Share**: Share reports or export metrics for external presentation.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion
- **Charts**: Recharts
- **Backend / API**: Node.js, Express.js
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Data Utilities**: XLSX parser

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **bun** / **yarn**

### 1. Environment Setup

Copy the example environment file and add your Gemini API Key if using AI Analyst features:

```bash
cp .env.example .env
```

Define your `GEMINI_API_KEY` in `.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### 2. Installation

Install project dependencies:

```bash
npm install
```

### 3. Running in Development

Start the Express + Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📦 Building for Production

To create an optimized production build and launch the compiled server:

```bash
# Build Vite client assets & bundle backend Express server
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```text
├── server.ts                   # Express server entry point & Gemini API proxy
├── src/
│   ├── App.tsx                 # Main Dashboard component & state hub
│   ├── components/             # UI Components
│   │   ├── AiAnalystDrawer.tsx # AI Chat & Analysis sidebar drawer
│   │   ├── BusinessInsightsSummary.tsx # AI key takeaways panel
│   │   ├── ChartsSection.tsx   # Recharts visualization modules
│   │   ├── FileUploadModal.tsx # CSV/Excel data upload modal
│   │   ├── FilterBar.tsx       # Multi-select category & date filter bar
│   │   ├── FormulaValidationModal.tsx # Data schema validation
│   │   ├── KpiCards.tsx        # High-level metric summary cards
│   │   ├── Navbar.tsx          # App header & navigation bar
│   │   ├── ShareModal.tsx       # Export & sharing options
│   │   └── StoreLeaderboard.tsx# Store performance rankings
│   ├── types/                  # TypeScript interfaces & types
│   └── utils/                  # Helper functions & mock dataset generators
├── package.json
└── README.md
```

---

## 📄 License

MIT License.
