#!/bin/bash
# Script per deploy su Vercel

echo "🚀 Deploy su Vercel - Gestionale Finanziario"
echo "=============================================="
echo ""

# Verifica token
if [ -z "$VERCEL_TOKEN" ]; then
    if [ -f ~/.vercel/token ]; then
        export VERCEL_TOKEN=$(cat ~/.vercel/token)
    elif [ -f .vercelrc ]; then
        export VERCEL_TOKEN=$(grep -o '"token": "[^"]*"' .vercelrc | cut -d'"' -f4)
    else
        echo "❌ Token Vercel non trovato"
        echo "   Configura VERCEL_TOKEN come variabile d'ambiente"
        echo "   oppure esegui: vercel login"
        exit 1
    fi
fi

echo "✅ Token Vercel configurato"
echo ""

# Vai nella directory frontend
cd frontend || exit 1

# Installa dipendenze se necessario
if [ ! -d "node_modules" ]; then
    echo "📦 Installazione dipendenze..."
    npm install --legacy-peer-deps
fi

# Build
echo "🔨 Build in corso..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Errore durante il build"
    exit 1
fi

echo "✅ Build completato"
echo ""

# Deploy con Vercel CLI
echo "🚀 Deploy su Vercel..."
export VERCEL_TOKEN="$VERCEL_TOKEN"
vercel --prod --yes --token "$VERCEL_TOKEN"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy completato con successo!"
    echo "🔗 Controlla il tuo progetto su: https://vercel.com/dashboard"
else
    echo "❌ Errore durante il deploy"
    echo ""
    echo "💡 Soluzioni possibili:"
    echo "   1. Verifica che il token sia valido"
    echo "   2. Esegui: vercel login"
    echo "   3. Oppure configura VERCEL_TOKEN come variabile d'ambiente"
    exit 1
fi
