#!/bin/bash
# Local SSL setup for OAuth development
# 
# This script generates local SSL certificates using mkcert for developing
# OAuth flows locally. OAuth providers require HTTPS callbacks, so you need
# valid SSL certificates even in development.
#
# Prerequisites:
#   - mkcert installed (https://github.com/FiloSottile/mkcert)
#   - macOS/Linux (or use WSL on Windows)
#
# Usage: ./scripts/setup-local-ssl.sh

set -e

CERT_DIR="./nginx/ssl"
DOMAIN="${DOMAIN:-localhost}"

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert not found. Install it from: https://github.com/FiloSottile/mkcert"
    exit 1
fi

# Create SSL directory
mkdir -p "$CERT_DIR"

# Generate certificates
echo "📝 Generating local SSL certificates for $DOMAIN..."
mkcert -cert-file "$CERT_DIR/cert.pem" -key-file "$CERT_DIR/key.pem" "$DOMAIN" "*.${DOMAIN}"

echo "✅ SSL certificates generated in $CERT_DIR"
echo ""
echo "📋 Next steps:"
echo "1. Update your OAuth provider callback URL to https://$DOMAIN (if using *.localhost)"
echo "2. Update BETTER_AUTH_URL in .env to https://$DOMAIN if needed"
echo "3. Uncomment the HTTPS section in nginx/nginx.conf"
echo "4. Restart your development environment"
echo ""
echo "💡 For OAuth with localhost, you may also need to:"
echo "   - Use a hosts file entry for local domains (e.g., app.localhost)"
echo "   - Or use ngrok/Cloudflare Tunnel for exposing to OAuth providers"
