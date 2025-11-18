# 🚀 Push Immediato su GitHub

## ✅ Stato Attuale

- ✅ Git installato e configurato
- ✅ Repository inizializzato
- ✅ Remote GitHub configurato: `https://github.com/thedragon689/Gestionale-Finanziario.git`
- ✅ Branch: `master`
- ✅ Commit pronti per il push

## 🔐 Autenticazione Richiesta

Il push richiede autenticazione GitHub. Ecco le opzioni:

### Opzione 1: Personal Access Token (Più Semplice)

1. **Crea Personal Access Token:**
   - Vai su: https://github.com/settings/tokens
   - Clicca "Generate new token" > "Generate new token (classic)"
   - Nome: `Gestionale-Finanziario`
   - Scadenza: `90 days` (o `No expiration`)
   - Seleziona permessi: ✅ `repo` (tutti)
   - Clicca "Generate token"
   - **COPIA IL TOKEN** (lo vedrai solo una volta!)

2. **Usa il token per push:**
   ```bash
   cd /home/lfaggi/Documenti/Gestionale-Finanziario-main
   
   # Usa il token come password quando richiesto
   git push origin master
   # Username: thedragon689
   # Password: [incolla il token qui]
   ```

3. **Oppure salva le credenziali:**
   ```bash
   git config --global credential.helper store
   git push origin master
   # Inserisci username e token una volta, poi sarà salvato
   ```

### Opzione 2: GitHub CLI (gh)

```bash
# Installa GitHub CLI
sudo dnf install gh

# Login
gh auth login
# Segui le istruzioni:
# - GitHub.com
# - HTTPS
# - Login con browser
# - Autorizza

# Push
git push origin master
```

### Opzione 3: SSH Keys

```bash
# Genera SSH key
ssh-keygen -t ed25519 -C "luca.faggi73@gmail.com"
# Premi Enter per accettare percorso di default
# Inserisci passphrase (opzionale)

# Mostra chiave pubblica
cat ~/.ssh/id_ed25519.pub

# Copia l'output e aggiungi su GitHub:
# https://github.com/settings/keys
# Clicca "New SSH key"
# Incolla la chiave

# Cambia remote a SSH
git remote set-url origin git@github.com:thedragon689/Gestionale-Finanziario.git

# Push
git push origin master
```

### Opzione 4: URL con Token (Temporaneo)

```bash
# Sostituisci TOKEN con il tuo Personal Access Token
git remote set-url origin https://TOKEN@github.com/thedragon689/Gestionale-Finanziario.git

# Push
git push origin master
```

## 🚀 Comando Push

Una volta autenticato:

```bash
cd /home/lfaggi/Documenti/Gestionale-Finanziario-main
git push origin master
```

Se il branch si chiama `main`:
```bash
git push origin main
```

## 📋 Verifica Push

Dopo il push, verifica su:
https://github.com/thedragon689/Gestionale-Finanziario

## 🔗 Link Utili

- **Personal Access Tokens**: https://github.com/settings/tokens
- **SSH Keys**: https://github.com/settings/keys
- **Repository**: https://github.com/thedragon689/Gestionale-Finanziario

---

**Raccomandazione**: Usa **Personal Access Token** (Opzione 1) per semplicità e sicurezza.

