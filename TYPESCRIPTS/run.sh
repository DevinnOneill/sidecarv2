#!/bin/bash
# Move to the directory where the script is located
cd "$(dirname "$0")"

# Try to find Node/NPM if missing (NVM fallback)
if ! command -v npm &> /dev/null; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

echo "⚓  Starting SIDECAR (TypeScript + Node.js)"
echo "   App: http://localhost:3000"
echo "   Press Ctrl+C to stop"

# Open the browser automatically on Mac
open http://localhost:3000 &

npm run dev
