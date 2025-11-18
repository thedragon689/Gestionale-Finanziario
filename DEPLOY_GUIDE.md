# 🚀 Guida Deploy su Vercel

## ⚠️ Problema Token

Il token fornito potrebbe non essere valido o scaduto. Ecco le soluzioni:

## ✅ Opzione 1: Login Interattivo (Consigliato)

```bash
cd frontend
vercel login
# Segui le istruzioni nel browser
vercel --prod
```

## ✅ Opzione 2: Dashboard Vercel (Più Semplice)

1. **Vai su**: https://vercel.com
2. **Login** con il tuo account
3. **Import Project**:
   - Connetti il repository GitHub
   - Oppure carica il progetto
4. **Configura**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build --legacy-peer-deps`
   - **Output Directory**: `build`
5. **Environment Variables** (IMPORTANTE!):
   ```
   REACT_APP_SUPABASE_URL=https://iunozzbacimqssxfsyht.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bm96emJhY2ltcXNzeGZzeWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTY4OTUsImV4cCI6MjA3OTAzMjg5NX0.J-R_nnAo5WCMdV6FWMjVhYeo2e7liserGyQk8pvOiB4
   NEXT_PUBLIC_SUPABASE_URL=https://iunozzbacimqssxfsyht.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bm96emJhY2ltcXNzeGZzeWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTY4OTUsImV4cCI6MjA3OTAzMjg5NX0.J-R_nnAo5WCMdV6FWMjVhYeo2e7liserGyQk8pvOiB4
   ```
6. **Deploy**!

## ✅ Opzione 3: Token Valido

Se hai un token valido:

```bash
export VERCEL_TOKEN=tuo_token_valido
cd frontend
vercel --prod --token "$VERCEL_TOKEN"
```

## 📋 Checklist Pre-Deploy

- [x] Build funziona localmente (`npm run build`)
- [x] File `public/index.html` presente
- [x] Dipendenze installate con `--legacy-peer-deps`
- [ ] Token Vercel valido o login effettuato
- [ ] Variabili d'ambiente configurate in Vercel
- [ ] Repository GitHub connesso (opzionale ma consigliato)

## 🔧 Configurazione Build

Il progetto usa `--legacy-peer-deps` per risolvere conflitti TypeScript.

In Vercel Dashboard, configura:
- **Build Command**: `npm run build --legacy-peer-deps`
- Oppure aggiungi in `package.json`:
  ```json
  "scripts": {
    "build": "react-scripts build"
  }
  ```
  E usa `npm install --legacy-peer-deps` come install command.

## 🔗 Link Utili

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentazione**: https://vercel.com/docs
- **Supabase Dashboard**: https://app.supabase.com/project/iunozzbacimqssxfsyht

---

**Raccomandazione**: Usa l'**Opzione 2 (Dashboard)** per semplicità e gestione automatica del deploy.

