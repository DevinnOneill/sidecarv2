#!/bin/bash
set -e
echo ""
echo "⚓  SIDECAR TypeScript Setup"
echo "────────────────────────────────────────"

# Try to find Node/NPM if missing (NVM fallback)
if ! command -v node &> /dev/null; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

if ! command -v node &>/dev/null; then 
  echo "❌ Node.js not found. It seems you have .nvm installed but it is not loaded."
  echo "Try running: source ~/.nvm/nvm.sh"
  exit 1
fi

echo "✅ Node: $(node --version)"
echo "📦 Installing dependencies..."
npm install
echo "🔨 Type checking..."
npm run typecheck && echo "✅ TypeScript — no errors"
echo ""
echo "✅ Setup complete! Run: ./run.sh"
echo "   App: http://localhost:3000"
