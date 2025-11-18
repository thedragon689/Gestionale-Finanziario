#!/bin/bash
# Script per configurare Git e fare push su GitHub

echo "🔧 Configurazione Git per Gestionale Finanziario"
echo "================================================"
echo ""

# Verifica se Git è installato
if ! command -v git &> /dev/null; then
    echo "❌ Git non è installato!"
    echo ""
    echo "📦 Installa Git:"
    echo "   sudo dnf install git  # Fedora"
    echo "   sudo apt-get install git  # Ubuntu"
    echo ""
    exit 1
fi

echo "✅ Git installato: $(git --version)"
echo ""

# Configurazione Git
echo "📝 Configurazione Git..."
git config --global user.name "thedragon689"
git config --global user.email "luca.faggi73@gmail.com"

echo "✅ Git configurato:"
echo "   Nome: $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"
echo ""

# Vai nella directory del progetto
cd "$(dirname "$0")"

# Verifica se è già un repository Git
if [ ! -d ".git" ]; then
    echo "📦 Inizializzazione repository Git..."
    git init
    echo "✅ Repository inizializzato"
    echo ""
fi

# Aggiungi remote (se non esiste)
if ! git remote | grep -q "origin"; then
    echo "🔗 Aggiunta remote GitHub..."
    git remote add origin https://github.com/thedragon689/Gestionale-Finanziario.git
    echo "✅ Remote aggiunto: https://github.com/thedragon689/Gestionale-Finanziario.git"
    echo ""
else
    echo "✅ Remote già configurato:"
    git remote -v
    echo ""
fi

# Aggiungi tutti i file
echo "📁 Aggiunta file allo staging..."
git add .
echo "✅ File aggiunti"
echo ""

# Mostra stato
echo "📊 Stato repository:"
git status --short | head -20
echo ""

# Chiedi conferma per commit
read -p "Vuoi fare commit e push? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Commit
    echo "💾 Creazione commit..."
    git commit -m "feat: Integrazione Supabase, deploy Vercel e miglioramenti UI

- Integrazione completa Supabase per Auth e Database
- Configurazione variabili d'ambiente per Vercel
- Implementazione login rapido per app vetrina
- Fix autenticazione e gestione sessione
- Pulizia file inutili per deploy
- Aggiunta documentazione tecnologie (TECNOLOGIE.md)
- Configurazione RLS policies Supabase
- Deploy automatico su Vercel
- Miglioramenti UI/UX pagina login"
    
    echo "✅ Commit creato"
    echo ""
    
    # Push
    echo "🚀 Push su GitHub..."
    echo "⚠️  Nota: Potrebbe richiedere autenticazione GitHub"
    echo ""
    
    # Prova a fare push
    if git push -u origin main 2>&1 || git push -u origin master 2>&1; then
        echo ""
        echo "✅ Push completato con successo!"
        echo "🔗 Repository: https://github.com/thedragon689/Gestionale-Finanziario"
    else
        echo ""
        echo "⚠️  Push fallito. Possibili cause:"
        echo "   1. Repository GitHub non esiste ancora"
        echo "   2. Problemi di autenticazione"
        echo ""
        echo "💡 Soluzioni:"
        echo "   1. Crea il repository su: https://github.com/new"
        echo "      Nome: Gestionale-Finanziario"
        echo "   2. Oppure usa GitHub CLI: gh auth login"
        echo "   3. Oppure configura SSH keys"
    fi
else
    echo "❌ Operazione annullata"
    echo ""
    echo "Per fare commit manualmente:"
    echo "  git commit -m 'Il tuo messaggio'"
    echo "  git push -u origin main"
fi

