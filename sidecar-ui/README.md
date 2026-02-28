# Sidecar Dashboard (SPFx UI)

This is the primary frontend codebase for the **Sidecar** Navy Distribution Automation platform. It is built as a **SharePoint Framework (SPFx) Web Part** using React, TypeScript, and PnP JS.

## 🏗️ Enterprise Architecture

Unlike a standard SPFx web part, this project implements a highly scalable, decoupled enterprise architecture:

*   `src/core/`: Application constants, React context providers, and global types.
*   `src/services/`: The Data Integration Layer. All communication with SharePoint Lists via `@pnp/sp` happens here, completely isolated from the UI.
*   `src/shared/`: The **"Naval UX" Component Library**. Contains generic "Glass Cockpit" UI elements (Swipe Cards, Navigation Hubs) that hold no business state. Styled exclusively with **Tailwind CSS**.
*   `src/features/`: Smart, stateful components (e.g., `BilletManager`) that compose shared UI elements and connect them to the data services.
*   `src/webparts/`: The thin SPFx entry points that bootstrap the React tree and provide the M365 context.

## 🛡️ USN Flankspeed Integration Constraints

This app is explicitly configured to deploy to the USN Flankspeed (IL5/IL6) environment. All developers must adhere to the following strict constraints:
1. **No External CDNs:** Absolute prohibition on `<link rel="stylesheet">` or `<script src="...">` tags pointing to external CDNs.
2. **Local CSS Bundling:** Tailwind CSS has been integrated directly into the `gulpfile.js` Webpack PostCSS pipeline. All Tailwind utility classes used in the project will be compiled, purged, and bundled directly inside the final `.sppkg` file.
3. **Internal Assets Only:** `includeClientSideAssets` is deliberately set to `true` in `package-solution.json` and the `externals` block is empty in `config.json`. Do not change these.

## 🧑‍💻 AI Agent Context (Personas)

When using AI agents (like Antigravity) to develop this project, you **MUST** reference the defined project personas to ensure the generated code adheres to our strict DoD/M365 constraints.

👉 **[Read the Project Personas Guide here](./docs/personas.md)**

## 🚀 Development Quick Start

### 1. Environment Prerequisites
SPFx v1.20 requires **Node.js v18.x** and specific global build tools.
```bash
# Strongly recommended to use NVM
nvm install 18
nvm use 18

# Install global tooling if not already present
npm install gulp-cli yo @microsoft/generator-sharepoint --global
```

### 2. Trust the Local Certificate
Before running the local server for the first time, you must trust the developer certificate:
```bash
gulp trust-dev-cert
```

### 3. Run the Development Server
Install dependencies and spin up the Webpack hot-reloading server:
```bash
npm install
gulp serve
```
*Note: `gulp serve` will no longer open an offline local workbench. You must navigate to your SharePoint Tenant's Hosted Workbench (`https://<tenant>.sharepoint.com/_layouts/15/workbench.aspx`) to view the web part.*

## 📦 Building and Deployment

To package the solution for deployment to the SharePoint App Catalog:

1. Bundle the static assets:
   ```bash
   gulp bundle --ship
   ```
2. Create the `.sppkg` deployment file:
   ```bash
   gulp package-solution --ship
   ```
The resulting package will be located in the `sharepoint/solution/` folder.
