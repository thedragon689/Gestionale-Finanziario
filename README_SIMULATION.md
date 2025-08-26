# 🚀 Sistema di Simulazione Finanziaria

Un agente automatizzato completo per simulare l'andamento del mercato finanziario, generando dati realistici con fluttuazioni positive e negative, e salvando ogni dato prodotto in modo strutturato e consultabile.

## ✨ Caratteristiche Principali

- **🎯 Simulazioni Automatiche**: Esecuzione programmata giornaliera, oraria, settimanale e mensile
- **📊 Asset Diversificati**: Azioni, ETF, criptovalute, fondi e obbligazioni
- **👥 Utenti Simulati**: 5 utenti con profili di rischio diversi
- **🎲 Eventi di Mercato**: Crisi, boom, breakthrough tecnologici e variazioni normative
- **💳 Transazioni Realistiche**: Stipendi, spese, investimenti e dividendi
- **📈 Report Automatici**: Dashboard, statistiche e analisi in tempo reale
- **🗄️ Persistenza Dati**: Database PostgreSQL con indici ottimizzati
- **🔧 API Complete**: Endpoint REST per gestione e consultazione

## 🏗️ Architettura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   API Gateway                              │
│              (Express.js + Routes)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Simulation Services                            │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │MarketSimulation │SimulationScheduler│SimulationInit  │   │
│  │Service          │                 │                │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Database                                  │
│              (PostgreSQL + Sequelize)                      │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │MarketSimulation │SimulatedTransaction│SimulatedEvent│   │
│  │                 │                 │                │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Installazione e Configurazione

### Prerequisiti

- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- Redis (opzionale, per cache)

### 1. Clona il Repository

```bash
git clone <repository-url>
cd gestionale-finanziario
```

### 2. Installa Dipendenze

```bash
# Dipendenze principali
npm install

# Dipendenze core-banking
cd core-banking
npm install
```

### 3. Configura Database

```bash
# Crea database PostgreSQL
createdb gestionale_finanziario

# Configura variabili d'ambiente
cp core-banking/.env.example core-banking/.env
```

Modifica `core-banking/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gestionale_finanziario
NODE_ENV=development

# Configurazione simulazioni
SIMULATION_ENABLED=true
SIMULATION_TIMEZONE=Europe/Rome
GENERATE_HISTORICAL_DATA=false
```

### 4. Inizializza Database

```bash
cd core-banking
npm run migrate
npm run seed
```

### 5. Avvia il Sistema

```bash
# Terminal 1: Backend
cd core-banking
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

## 📊 Utilizzo

### Avvio Automatico

Il sistema si avvia automaticamente e:
- Verifica la connessione al database
- Sincronizza i modelli
- Inizializza lo scheduler
- Esegue simulazioni programmate

### Simulazione Manuale

```javascript
const scheduler = require('./src/services/SimulationScheduler');

// Avvia simulazione per oggi
const result = await scheduler.runManualSimulation();

// Avvia simulazione per una data specifica
const result = await scheduler.runManualSimulation(new Date('2024-01-15'));
```

### API Endpoints

#### Gestione Sistema
```bash
# Stato del sistema
GET /api/simulation/status

# Inizializzazione
POST /api/simulation/initialize

# Avvio manuale
POST /api/simulation/start

# Riavvio
POST /api/simulation/restart

# Arresto
POST /api/simulation/stop
```

#### Dati e Statistiche
```bash
# Statistiche periodiche
GET /api/simulation/stats?startDate=2024-01-01&endDate=2024-01-31

# Performance asset
GET /api/simulation/assets?symbol=AAPL&days=30

# Transazioni utente
GET /api/simulation/transactions?userId=user-001&limit=100

# Eventi di mercato
GET /api/simulation/events?active=true

# Dashboard aggregata
GET /api/simulation/dashboard?days=7
```

#### Report e Analisi
```bash
# Report mensile
GET /api/simulation/report/monthly?month=1&year=2024

# Simulazioni storiche
POST /api/simulation/historical
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

## 🧪 Testing

### Test Completi

```bash
cd core-banking
node src/examples/simulation-test.js
```

### Test Specifici

```javascript
const SimulationTester = require('./src/examples/simulation-test');
const tester = new SimulationTester();

// Test singoli
await tester.testInitialization();
await tester.testManualSimulation();
await tester.testAssetPerformance();
```

## 📈 Configurazione Avanzata

### Personalizzazione Asset

```javascript
// Aggiungi nuovo asset in MarketSimulationService
{
  symbol: 'NVDA',
  name: 'NVIDIA Corporation',
  type: 'STOCK',
  initialValue: 500.00,
  sector: 'Technology',
  country: 'USA',
  volatility: 0.35
}
```

### Personalizzazione Eventi

```javascript
// Aggiungi nuovo tipo di evento
{
  type: 'NEW_REGULATION',
  title: 'Nuova Regolamentazione',
  description: 'Cambiamento normativo che influenza il mercato',
  severity: 'MEDIUM',
  scope: 'NATIONAL',
  impact: -8.0,
  probability: 0.15
}
```

### Personalizzazione Transazioni

```javascript
// Aggiungi nuovo tipo di transazione
{
  type: 'INSURANCE_PAYMENT',
  category: 'Insurance',
  description: 'Pagamento assicurazione',
  amount: -150,
  isRecurring: true,
  recurringFrequency: 'MONTHLY'
}
```

## ⏰ Scheduling

### Simulazioni Automatiche

| Tipo | Frequenza | Orario | Descrizione |
|------|-----------|---------|-------------|
| **Giornaliera** | Ogni giorno | 00:01 | Simulazione completa del mercato |
| **Oraria** | 9:00-17:00 (Lun-Ven) | Ogni ora | Movimenti di mercato |
| **Settimanale** | Domenica | 23:00 | Riepilogo settimanale |
| **Mensile** | 1° del mese | 00:05 | Report mensile aggregato |
| **Pulizia** | 1° del mese | 02:00 | Eliminazione dati vecchi |

### Configurazione Orari

```env
SIMULATION_DAILY_TIME=00:01
SIMULATION_HOURLY_START=09:00
SIMULATION_HOURLY_END=17:00
SIMULATION_WEEKLY_TIME=23:00
SIMULATION_MONTHLY_TIME=00:05
SIMULATION_CLEANUP_TIME=02:00
```

## 📊 Output e Report

### Report Giornaliero

```
=== REPORT GIORNALIERO SIMULAZIONE ===
Data: 2024-01-15
Performance mercato: +2.45%
Variazione saldo totale: +1.87%
Asset migliore: AAPL (+5.23%)
Asset peggiore: TSLA (-3.12%)
Eventi attivi: 3
Alert generati: 2
=====================================
```

### Dashboard

```json
{
  "period": "2024-01-09 - 2024-01-15",
  "currentBalance": 425000.00,
  "averageMarketPerformance": 1.23,
  "totalTransactions": 156,
  "totalEvents": 8,
  "daysSimulated": 7,
  "activeEvents": 3,
  "recentPerformance": [...],
  "alerts": [...]
}
```

## 🔧 Manutenzione

### Pulizia Dati

```bash
# Pulizia manuale
curl -X POST http://localhost:3001/api/simulation/cleanup

# Configurazione automatica
DATA_RETENTION_DAYS=365
CLEANUP_BATCH_SIZE=1000
```

### Backup

```bash
# Backup database
pg_dump gestionale_finanziario > backup_$(date +%Y%m%d).sql

# Restore
psql gestionale_finanziario < backup_20240115.sql
```

### Monitoraggio

```bash
# Stato sistema
curl http://localhost:3001/api/simulation/status

# Log in tempo reale
tail -f core-banking/logs/app.log
```

## 🚨 Troubleshooting

### Problemi Comuni

1. **Database non raggiungibile**
   ```bash
   # Verifica connessione
   psql -h localhost -U postgres -d gestionale_finanziario
   
   # Controlla variabili d'ambiente
   echo $DB_HOST $DB_PORT $DB_NAME
   ```

2. **Simulazioni non si avviano**
   ```bash
   # Controlla stato scheduler
   curl http://localhost:3001/api/simulation/status
   
   # Riavvia sistema
   curl -X POST http://localhost:3001/api/simulation/restart
   ```

3. **Performance lente**
   ```bash
   # Ottimizza database
   npm run migrate
   
   # Riduci frequenza simulazioni
   # Modifica .env
   ```

### Log e Debug

```javascript
// Abilita logging dettagliato
process.env.LOG_LEVEL = 'debug';

// Verifica stato scheduler
console.log(scheduler.getSchedulerStatus());

// Test connessione database
const { testConnection } = require('./src/config/database');
await testConnection();
```

## 🔒 Sicurezza

- **Rate Limiting**: Protezione da abuso API
- **Validazione Input**: Controllo parametri in ingresso
- **Logging**: Tracciamento di tutte le operazioni
- **Gestione Errori**: Gestione robusta degli errori
- **Timeout**: Protezione da operazioni lunghe

## 📈 Performance

- **Simulazioni Asincrone**: Non bloccano l'applicazione
- **Batch Processing**: Operazioni multiple in parallelo
- **Indici Ottimizzati**: Query database veloci
- **Pool Connessioni**: Gestione efficiente del database
- **Cleanup Automatico**: Mantenimento performance

## 🌟 Estensioni Future

- **Machine Learning**: Predizioni basate su dati storici
- **Notifiche Push**: Alert in tempo reale
- **Integrazione API**: Connessione a servizi finanziari reali
- **Analisi Avanzate**: Grafici e trend analysis
- **Multi-tenant**: Supporto per più istituti finanziari

## 📚 Documentazione

- [Documentazione Completa](docs/SIMULATION_SYSTEM.md)
- [API Reference](docs/API_REFERENCE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)

## 🤝 Contributi

1. Fork il progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.

## 🆘 Supporto

Per supporto tecnico:
- 📧 Email: support@gestionale-finanziario.com
- 🐛 Issues: [GitHub Issues](https://github.com/gestionale-finanziario/gestionale-finanziario/issues)
- 📖 Wiki: [Documentazione Wiki](https://github.com/gestionale-finanziario/gestionale-finanziario/wiki)

---

**⚠️ Nota Importante**: Questo sistema è progettato per scopi di test e sviluppo. Non utilizzare i dati simulati per decisioni finanziarie reali.

**🚀 Buon Coding!**
