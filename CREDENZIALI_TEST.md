# 🔐 Credenziali di Test - Supabase

## ✅ Variabili d'Ambiente Configurate

Le variabili d'ambiente Supabase sono state configurate in Vercel per tutti gli ambienti:
- ✅ Production
- ✅ Preview  
- ✅ Development

## 👤 Utenti di Test

Gli utenti di test sono stati creati in Supabase Auth:

| Email | Password | Ruolo |
|-------|----------|-------|
| user1@test.com | Test123456! | user |
| user2@test.com | Test123456! | user |
| user3@test.com | Test123456! | user |
| admin@test.com | Test123456! | admin |
| manager@test.com | Test123456! | manager |

## 🔧 Risoluzione Errori Credenziali

### Se vedi "Invalid login credentials":

1. **Verifica che l'utente esista**:
   - Vai su: https://app.supabase.com/project/iunozzbacimqssxfsyht/auth/users
   - Controlla che l'email sia presente

2. **Verifica che l'email sia confermata**:
   - In Supabase Dashboard > Auth > Users
   - L'utente deve avere "Email Confirmed" = true

3. **Reimposta la password se necessario**:
   - In Supabase Dashboard > Auth > Users
   - Clicca sull'utente > Reset Password

### Se vedi "Supabase configuration missing":

1. **Verifica variabili d'ambiente in Vercel**:
   - Vai su: https://vercel.com/luca-faggis-projects/frontend/settings/environment-variables
   - Controlla che tutte le 4 variabili siano presenti

2. **Riavvia il deploy**:
   - Vercel dovrebbe fare un nuovo deploy automatico
   - Oppure: `vercel --prod` dalla directory frontend

## 🔗 Link Utili

- **Vercel Dashboard**: https://vercel.com/luca-faggis-projects/frontend
- **Supabase Dashboard**: https://app.supabase.com/project/iunozzbacimqssxfsyht
- **Supabase Auth Users**: https://app.supabase.com/project/iunozzbacimqssxfsyht/auth/users

## 📝 Note

- Le password sono case-sensitive
- Gli utenti devono avere l'email confermata per fare login
- Se crei nuovi utenti, assicurati di confermare l'email o disabilita la conferma email in Supabase Settings

