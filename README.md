# 🚢 SIDECAR — Navy Distribution Automation

SIDECAR is a modern web platform designed to automate and streamline Navy personnel distribution and order management. It integrates sailor readiness data, billet inventory, and complex policy engines into a single "glass-floor" dashboard.

## 🏗️ Project Architecture (V2)

The project has recently migrated from a standalone Node.js server to a native **Microsoft 365 SharePoint Framework (SPFx) React Application**.

### Directory Structure

```text
sidecar-v2
├── sidecar-ui/              # 🟢 ACTIVE: The SPFx React Web Part
│   ├── src/                 # React components, PnP JS data layer, and business logic
│   ├── docs/                # Project documentation (e.g., Personas)
│   └── package.json         # SPFx Dependencies (Requires Node v18)
│
└── _legacy_sidecar_v2/      # 🔴 DEPRECATED: Historical Reference Only
    ├── src/routes/          # Contains the original Policy Engine logic (JTRS, EAOS, NEC)
    └── frontend/            # The original vanilla JS/HTML views
```

## 🚀 Quick Start (Active Project)

To develop on the active Sidecar application, you must work inside the `sidecar-ui` directory. 

**CRITICAL REQUIREMENT:** You must use **Node.js v18.x** to build and run the SPFx frontend. Node v20+ is not supported by Microsoft's build tools.

1. Navigate to the active UI directory:
   ```bash
   cd sidecar-ui
   ```
2. Switch to Node 18 (using NVM):
   ```bash
   nvm use 18
   ```
3. Start the local development server:
   ```bash
   gulp serve
   ```
4. Open your SharePoint tenant's Hosted Workbench to test the web part:
   `https://<your-tenant>.sharepoint.com/_layouts/15/workbench.aspx`

## 📖 Documentation

For detailed information on the design system, data integration, and how AI agents should interact with this repository, please read the [Sidecar UI Personas](sidecar-ui/docs/personas.md).

---
*Questions? Contact PERS-40 Development Team.*
