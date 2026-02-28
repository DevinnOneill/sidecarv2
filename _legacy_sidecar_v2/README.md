# 🚢 SIDECAR — Navy Distribution Automation

SIDECAR is a modern, TypeScript-based platform designed to automate and streamline Navy personnel distribution and order management. It integrates sailor readiness data, billet inventory, and complex policy engines into a single "glass-floor" dashboard.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **NVM**: (Optional) Recommended for version management

### Installation & Run
1. **Setup**: Run the setup script to install dependencies and verify your environment.
   ```bash
   ./setup.sh
   ```
2. **Launch**: Start the development server and open the app in your browser automatically.
   ```bash
   ./run.sh
   ```

## 🏗️ Project Structure

```text
sidecar-v2
└── TYPESCRIPTS
    ├── src
    │   ├── server.ts      # Express entry point & middleware
    │   ├── data/          # Mock Data Store (The "Brain")
    │   ├── routes/        # API Endpoints (Sailors, Billets, Orders, etc.)
    │   └── types/         # Shared TypeScript Interfaces
    ├── frontend
    │   ├── index.html     # Login & Entry
    │   ├── css/           # Modern Glassmorphism Styles
    │   └── js/
    │       ├── app.js     # Main UI Controller
    │       ├── api.js     # Shared API Client
    │       └── modules/   # Feature-specific logic (Home, Sailors, Analytics)
    └── shared/            # Types shared across Frontend & Backend
```

## 🛠️ Technology Stack
- **Backend**: Node.js, Express, TypeScript, Morgan (Logging)
- **Frontend**: Vanilla JS (ES6+), Modern CSS (no frameworks for speed/control)
- **Tooling**: `ts-node-dev` for hot-reloading development

## 🧪 Demo Data
The app is pre-loaded with **10 sailors**, **10 billets**, and a full **Orders/Activity history**. 
- **Main Demo User**: `D001` (J. Davis - Detailer)
- **Debug Path**: Visit `/api/debug` to see raw data states.

--
