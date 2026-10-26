# Vigilia Platform — Frontend (Member 4)

Production-grade React + TypeScript frontend for **Vigilia — Smart Fraud Protection & High-Availability MLOps Platform**.

This frontend is designed according to the **Vigilia UI/UX Blueprint**, adhering to all shared interface contracts between team members (Member 1 ML Training, Member 2 FastAPI ML Serving, Member 3 Spring Boot Microservices, Member 4 Frontend/Audit/Notification, Member 5 Kubernetes/DevOps).

---

## 🌟 Overview & Architecture

The application delivers a unified, light-mode FinTech and Security Intelligence user interface across three primary personas:

1. **Customer Workspace** (Calm, reassuring, consumer-facing protection & transaction tracker)
2. **Analyst Workspace** (High-density, evidence-based investigation & human review adjudication queue)
3. **Admin Workspace** (Kubernetes telemetry, MLflow model registry, policy threshold simulator & traffic load tests)

```
                       ┌─────────────────────────────────────────┐
                       │   React 18 + TypeScript (Vite + Tailwind)│
                       └────────────────────┬────────────────────┘
                                            │
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │     Spring Boot Gateway (Port 8080)     │
                       │     JWT Auth / Route Propagation        │
                       └────────┬──────────────────────┬─────────┘
                                │                      │
                 ┌──────────────┴───────┐      ┌───────┴──────────────┐
                 ▼                      ▼      ▼                      ▼
        Transaction Service    Risk Management  Audit Service   Notification
            (Port 8083)          (Port 8084)     (Port 8086)     (Port 8085)
                                        │
                                        ▼
                                 FastAPI Serving
                                   (Port 8000)
                                        │
                                 XGBoost Champion
```

---

## 📑 18-Page Blueprint Implementation Matrix

| Page # | Page Name | Role | Priority | Route | Key Features & Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Home** | Customer | Core | `/customer` | Active protection card, 3 KPI metrics, recent transaction feed, quick checkout. |
| **02** | **Transactions** | Customer | Core | `/customer/transactions` | Filter by status/category, real-time search, transaction detail drawer. |
| **03** | **New Checkout** | Customer | Wow Demo | `/customer/checkout` | Virtual card preview, 3 test presets (Normal, Borderline, Suspicious), live ML evaluation. |
| **04** | **Status Tracker** | Customer | Core | `/customer/transactions/:id` | Plain-language reason, verification timeline, *"Was this you?"* response action. |
| **05** | **Spending Insights** | Customer | Stretch | `/customer/insights` | Category breakdown donut chart, monthly spending trend bar chart. |
| **06** | **Investigation Queue**| Analyst | Core (High) | `/analyst/queue` | Expected loss sorting (`prob × amount`), SLA countdowns, priority tabs, KPI strip. |
| **07** | **Case Workspace** | Analyst | **Signature** | `/analyst/cases/:id` | **3-Zone layout**: (1) Customer profile, (2) Facts/GeoMap/SHAP/UMAP, (3) Sticky Adjudication Panel. |
| **08** | **Model Explanation**| Analyst | Wow | `/analyst/cases/:id/explanation` | Interactive SHAP waterfall, baseline comparison, Platt calibration curve, conformal intervals. |
| **09** | **Similar Cases** | Analyst | Wow | `/analyst/cases/:id/similar` | 2D UMAP scatter plot with current case reticle, historical nearest-neighbor matches. |
| **10** | **Case Timeline** | Analyst | Core | `/analyst/cases/:id/timeline` | Immutable audit trail with `X-Correlation-ID`, actor history, before/after diffs. |
| **11** | **Analyst Analytics** | Analyst | Wow | `/analyst/analytics` | Average Handling Time (AHT), review rate, 2×2 Confusion Matrix, human vs ML agreement. |
| **12** | **Operations Overview**| Admin | Core | `/admin/operations` | p95 latency, RPS throughput, decision mix donut chart, active alerts. |
| **13** | **Service Health** | Admin | Wow | `/admin/services` | Dependency topology diagram, 8 services status, **Chaos Pod Termination simulation**. |
| **14** | **Model Health** | Admin | Wow | `/admin/models` | 5-Model Benchmark table (XGBoost, RF, MLP, SVM, LR), Kolmogorov-Smirnov drift test. |
| **15** | **Threshold Simulator**| Admin | Stretch | `/admin/simulator` | Interactive sliders for approval/rejection/uncertainty boundaries, validation trade-off curve. |
| **16** | **Trace Explorer** | Admin | Stretch | `/admin/traces` | Distributed waterfall across Gateway &rarr; Transaction &rarr; Risk &rarr; ML &rarr; Audit. |
| **17** | **Audit Explorer** | Admin | Core | `/admin/audit` | Searchable GDPR compliance logs, expandable payload snapshots, CSV export. |
| **18** | **Traffic Simulator** | Admin | Wow | `/admin/traffic` | **4-Stage Load Test**: Normal &rarr; High &rarr; Overload &rarr; Recovery with Kubernetes autoscaling. |

---

## 🎨 Design System & Theme Specs

- **Page Background**: `#F5F7FB` (Cool light gray)
- **Card Background**: `#FFFFFF` (Crisp white)
- **Primary Navy**: `#15345B` (Brand trust & authority)
- **Accent Blue**: `#2563EB` (Interactive highlights)
- **Success / Cleared**: `#059669` / `#ECFDF5`
- **Warning / Review**: `#D97706` / `#FFFBEB`
- **Critical / Fraud**: `#DC2626` / `#FEF2F2`
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide Icons
- **Shortcuts**: `Ctrl+K` or `Cmd+K` global Command Palette launcher.

---

## 🚀 Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server (Port 5173)
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Compile TypeScript and bundle assets with Vite
npm run build

# Preview production build locally on port 8087
npm run preview
```

### Docker Containerization

Conforms strictly to `contracts/observability/runtime-v0.1.md`:

```bash
# Build multi-stage unprivileged Nginx image
docker build -t vigilia-frontend .

# Run container on port 8080 (or 8087)
docker run -d -p 8080:8080 --name vigilia-ui vigilia-frontend

# Health checks
curl http://localhost:8080/health/live
curl http://localhost:8080/health/ready
```

---

## 🔌 API Contracts & Dual-Mode Execution

1. **Live Backend Mode**: When Spring Boot API Gateway is running on `http://localhost:8080`, all requests carry `X-Correlation-ID` and Bearer JWT tokens.
2. **Standalone Demo Mode**: If the microservices or ML serving are offline, the frontend's built-in intelligent mock store automatically handles transactions, case resolutions, threshold simulations, and chaos pod recovery. This guarantees a **100% reliable 5-minute video presentation** without relying on external servers.

