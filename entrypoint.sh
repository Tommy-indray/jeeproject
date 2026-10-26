#!/bin/sh
set -e

# Default API URL to Gateway at http://localhost:8080 if not set
export VITE_API_URL="${VITE_API_URL:-http://localhost:8080}"

echo "Configuring Vigilia Frontend runtime environment..."
echo "API Gateway URL: ${VITE_API_URL}"

# Substitute placeholders in JS bundles if needed
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_API_URL_PLACEHOLDER__|${VITE_API_URL}|g" {} + 2>/dev/null || true

exec "$@"

