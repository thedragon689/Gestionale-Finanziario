# 🚀 Push su GitHub - Istruzioni

## 👤 Configurazione Utente

- **Username GitHub**: `thedragon689`
- **Email**: `luca.faggi73@gmail.com`
- **Repository**: `https://github.com/thedragon689/Gestionale-Finanziario.git`

## ⚡ Metodo Rapido (Script Automatico)

### 1. Installa Git (se non installato)

**Su Fedora:**
```bash
sudo dnf install git
```

**Su Ubuntu/Debian:**
```bash
sudo apt-get install git
```

### 2. Esegui lo script automatico

```bash
cd /home/lfaggi/Documenti/Gestionale-Finanziario-main
./setup_git.sh
```

Lo script:
- ✅ Verifica installazione Git
- ✅ Configura nome e email
- ✅ Inizializza repository (se necessario)
- ✅ Aggiunge remote GitHub
- ✅ Aggiunge file allo staging
- ✅ Crea commit
- ✅ Fa push su GitHub

## 📋 Metodo Manuale

### 1. Installa Git

```bash
sudo dnf install git  # Fedora
# oppure
sudo apt-get install git  # Ubuntu
```

### 2. Configura Git

```bash
git config --global user.name "thedragon689"
git config --global user.email "luca.faggi73@gmail.com"
```

### 3. Inizializza Repository

```bash
cd /home/lfaggi/Documenti/Gestionale-Finanziario-main
git init
```

### 4. Aggiungi Remote GitHub

```bash
git remote add origin https://github.com/thedragon689/Gestionale-Finanziario.git
```

**Nota**: Se il repository non esiste ancora su GitHub:
1. Vai su: https://github.com/new
2. Nome repository: `Gestionale-Finanziario`
3. Crea il repository (puoi lasciarlo vuoto)

### 5. Aggiungi File

```bash
git add .
```

### 6. Crea Commit

```bash
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
```

### 7. Push su GitHub

```bash
git push -u origin main
```

Se il branch si chiama `master`:
```bash
git push -u origin master
```

## 🔐 Autenticazione GitHub

### Opzione 1: Personal Access Token (Consigliato)

1. Vai su: https://github.com/settings/tokens
2. Genera nuovo token (classic)
3. Permessi: `repo` (tutti)
4. Copia il token
5. Quando richiesto, usa il token come password

### Opzione 2: GitHub CLI

```bash
# Installa GitHub CLI
sudo dnf install gh  # Fedora
# oppure
sudo apt-get install gh  # Ubuntu

# Login
gh auth login

# Push
git push -u origin main
```

### Opzione 3: SSH Keys

```bash
# Genera SSH key
ssh-keygen -t ed25519 -C "luca.faggi73@gmail.com"

# Aggiungi al GitHub
cat ~/.ssh/id_ed25519.pub
# Copia e incolla su: https://github.com/settings/keys

# Cambia remote a SSH
git remote set-url origin git@github.com:thedragon689/Gestionale-Finanziario.git
```

## 📁 File da Committare

### Nuovi file:
- `TECNOLOGIE.md` - Documentazione tecnologie
- `CREDENZIALI_TEST.md` - Credenziali utenti test
- `VERCEL_DEPLOY.md` - Guida deploy Vercel
- `DEPLOY_GUIDE.md` - Guida deploy completa
- `PUSH_GITHUB.md` - Questa guida
- `setup_git.sh` - Script setup automatico
- `frontend/.npmrc` - Configurazione npm
- `frontend/vercel.json` - Configurazione Vercel
- `.vercelignore` - File esclusi da deploy
- `deploy_vercel.sh` - Script deploy automatico

### File modificati:
- `frontend/src/pages/Auth/Login.tsx` - Login rapido e fix autenticazione
- `frontend/src/components/Auth/ProtectedRoute.tsx` - Migliorata verifica sessione
- `frontend/src/lib/supabase.ts` - Configurazione Supabase
- `frontend/public/index.html` - File HTML principale
- `frontend/public/manifest.json` - Manifest PWA
- `vercel.json` - Configurazione deploy
- `.gitignore` - Aggiornato per escludere file inutili

## 🔗 Link Utili

- **Repository GitHub**: https://github.com/thedragon689/Gestionale-Finanziario
- **Crea Repository**: https://github.com/new
- **Personal Access Tokens**: https://github.com/settings/tokens
- **SSH Keys**: https://github.com/settings/keys
- **Git Download**: https://git-scm.com/download/linux

## ⚠️ Note Importanti

1. **Repository non esiste?**: Crealo prima su https://github.com/new
2. **Autenticazione richiesta?**: Usa Personal Access Token o GitHub CLI
3. **Branch diverso?**: Verifica con `git branch` e usa il nome corretto

---

**Pronto per il push!** 🚀
