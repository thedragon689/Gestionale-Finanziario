# 🚀 Deploy su Vercel - Guida Rapida

## ✅ Preparazione Completata

Il progetto è stato pulito e preparato per il deploy su Vercel con Supabase.

## 📋 File Rimossi (Non Necessari per Deploy)

- ❌ Tutti i CSV in `docs/tables/` (solo per setup)
- ❌ Tutti i file MD di documentazione setup
- ❌ Script Python di setup/test
- ❌ File SQL di setup
- ❌ File .txt di documentazione (auth.txt, database.txt)

## ✅ File Mantenuti (Essenziali)

- ✅ Codice sorgente frontend e backend
- ✅ Configurazione Supabase (`frontend/src/lib/supabase.ts`)
- ✅ File .env.example (template)
- ✅ Package.json e dipendenze
- ✅ Configurazione TypeScript/React

## 🔧 Configurazione Vercel

### Variabili d'Ambiente da Configurare in Vercel

Vai su Vercel Dashboard > Project Settings > Environment Variables e aggiungi:

```
REACT_APP_SUPABASE_URL=https://iunozzbacimqssxfsyht.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bm96emJhY2ltcXNzeGZzeWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTY4OTUsImV4cCI6MjA3OTAzMjg5NX0.J-R_nnAo5WCMdV6FWMjVhYeo2e7liserGyQk8pvOiB4

NEXT_PUBLIC_SUPABASE_URL=https://iunozzbacimqssxfsyht.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bm96emJhY2ltcXNzeGZzeWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTY4OTUsImV4cCI6MjA3OTAzMjg5NX0.J-R_nnAo5WCMdV6FWMjVhYeo2e7liserGyQk8pvOiB4
```

## 🚀 Deploy

### Opzione 1: Script Automatico (Consigliato)

```bash
# Esegui lo script di deploy
./deploy_vercel.sh
```

Lo script:
- ✅ Verifica il token Vercel
- ✅ Installa dipendenze
- ✅ Esegue il build
- ✅ Fa il deploy su Vercel

### Opzione 2: Vercel CLI Manuale

```bash
# Token già configurato in .vercelrc
cd frontend
vercel --prod
```

### Opzione 3: Dashboard Vercel

1. Vai su https://vercel.com
2. Importa il repository GitHub
3. Configura:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Aggiungi le variabili d'ambiente (vedi sopra)
5. Deploy!

## 📝 Note Importanti

- ✅ Il file `.vercelignore` esclude automaticamente file inutili
- ✅ Le variabili d'ambiente devono essere configurate in Vercel
- ✅ Supabase è già connesso e configurato
- ✅ Il frontend usa Supabase Client configurato

## 🔗 Link Utili

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com/project/iunozzbacimqssxfsyht
- **Documentazione Vercel**: https://vercel.com/docs

---

**Pronto per il deploy!** 🚀

