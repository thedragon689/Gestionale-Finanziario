# Sistema di Simulazione Finanziaria

## Panoramica

Il Sistema di Simulazione Finanziaria è un agente automatizzato completo che simula quotidianamente l'andamento del mercato azionario, dei fondi, della borsa e dei conti correnti. Il sistema genera dati realistici con fluttuazioni positive e negative, salvando ogni dato prodotto in modo strutturato e consultabile.

## Caratteristiche Principali

### 🎯 Simulazioni Automatiche
- **Simulazione Giornaliera**: Eseguita automaticamente alle 00:01 ogni giorno
- **Simulazione Oraria**: Durante l'orario di trading (9:00-17:00) nei giorni lavorativi
- **Simulazione Settimanale**: Ogni domenica alle 23:00 per riepiloghi settimanali
- **Simulazione Mensile**: Il primo del mese alle 00:05 per report aggregati

### 📊 Asset Simulati
- **Azioni USA**: AAPL, MSFT, GOOGL, TSLA, AMZN
- **Azioni Europee**: ASML, NOVO, NESN
- **ETF**: SPY, QQQ, VTI
- **Criptovalute**: BTC, ETH, ADA
- **Fondi**: Fidelity Growth, Vanguard 500
- **Obbligazioni**: US Treasury, European Government

### 👥 Utenti Simulati
- 5 utenti con profili di rischio diversi (CONSERVATIVE, MODERATE, AGGRESSIVE)
- Saldi iniziali variabili da €30,000 a €120,000
- Transazioni realistiche (stipendi, spese, investimenti, dividendi)

### 🎲 Eventi di Mercato
- Crisi di mercato globali e settoriali
- Boom di mercato e crescita economica
- Variazioni dei tassi di interesse
- Breakthrough tecnologici
- Cambiamenti normativi e politici
- Bonus aziendali e variazioni fiscali

## Architettura del Sistema

### Modelli Database

#### 1. MarketSimulation
```sql
CREATE TABLE market_simulations (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  asset VARCHAR(100) NOT NULL,
  asset_type ENUM('STOCK', 'ETF', 'CRYPTO', 'FUND', 'BOND', 'COMMODITY'),
  symbol VARCHAR(20) NOT NULL,
  initial_value DECIMAL(15,4) NOT NULL,
  final_value DECIMAL(15,4) NOT NULL,
  variation DECIMAL(8,4) NOT NULL,
  absolute_variation DECIMAL(15,4) NOT NULL,
  volume DECIMAL(20,2),
  market_cap DECIMAL(20,2),
  volatility DECIMAL(8,4),
  sector VARCHAR(100),
  country VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. SimulatedTransaction
```sql
CREATE TABLE simulated_transactions (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  user_id UUID NOT NULL,
  account_id UUID NOT NULL,
  type ENUM('INCOME', 'EXPENSE', 'TRANSFER', 'INVESTMENT', 'DIVIDEND', 'FEE', 'LOAN_PAYMENT', 'REFUND', 'MARKET_CRASH', 'MARKET_BOOM'),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  description TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'),
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  counterparty VARCHAR(200),
  reference VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. SimulatedEvent
```sql
CREATE TABLE simulated_events (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
  scope ENUM('GLOBAL', 'REGIONAL', 'NATIONAL', 'SECTORAL', 'INDIVIDUAL'),
  affected_assets JSONB,
  affected_users JSONB,
  impact DECIMAL(8,4) NOT NULL,
  absolute_impact DECIMAL(15,2),
  duration INTEGER,
  description TEXT NOT NULL,
  title VARCHAR(200) NOT NULL,
  source VARCHAR(100),
  probability DECIMAL(5,4),
  metadata JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. DailySimulation
```sql
CREATE TABLE daily_simulations (
  id UUID PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  total_users INTEGER DEFAULT 0,
  total_accounts INTEGER DEFAULT 0,
  total_assets INTEGER DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_balance DECIMAL(20,2) DEFAULT 0,
  total_balance_change DECIMAL(20,2) DEFAULT 0,
  total_balance_change_percent DECIMAL(8,4) DEFAULT 0,
  market_performance DECIMAL(8,4) DEFAULT 0,
  best_performing_asset VARCHAR(100),
  worst_performing_asset VARCHAR(100),
  best_performing_user UUID,
  worst_performing_user UUID,
  total_income DECIMAL(20,2) DEFAULT 0,
  total_expenses DECIMAL(20,2) DEFAULT 0,
  total_investments DECIMAL(20,2) DEFAULT 0,
  total_dividends DECIMAL(20,2) DEFAULT 0,
  total_fees DECIMAL(20,2) DEFAULT 0,
  market_volatility DECIMAL(8,4),
  active_events JSONB,
  alerts JSONB,
  summary TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Servizi

#### 1. MarketSimulationService
Gestisce la logica di business per:
- Generazione variazioni degli asset
- Creazione transazioni simulate
- Generazione eventi di mercato
- Calcolo statistiche e performance

#### 2. SimulationScheduler
Gestisce la programmazione automatica:
- Job cron per simulazioni periodiche
- Esecuzione simulazioni storiche
- Pulizia dati vecchi
- Generazione report

### API Endpoints

#### Gestione Sistema
- `GET /api/simulation/status` - Stato del sistema
- `POST /api/simulation/initialize` - Inizializzazione
- `POST /api/simulation/start` - Avvio manuale
- `POST /api/simulation/restart` - Riavvio
- `POST /api/simulation/stop` - Arresto

#### Dati e Statistiche
- `GET /api/simulation/stats` - Statistiche periodiche
- `GET /api/simulation/assets` - Performance asset
- `GET /api/simulation/transactions` - Transazioni utente
- `GET /api/simulation/events` - Eventi di mercato
- `GET /api/simulation/dashboard` - Dashboard aggregata

#### Report e Analisi
- `GET /api/simulation/report/monthly` - Report mensile
- `POST /api/simulation/historical` - Simulazioni storiche

## Configurazione

### Variabili d'Ambiente

```bash
# Abilita/disabilita il sistema
SIMULATION_ENABLED=true

# Fuso orario per le simulazioni
SIMULATION_TIMEZONE=Europe/Rome

# Orari delle simulazioni
SIMULATION_DAILY_TIME=00:01
SIMULATION_HOURLY_START=09:00
SIMULATION_HOURLY_END=17:00
SIMULATION_WEEKLY_TIME=23:00
SIMULATION_MONTHLY_TIME=00:05

# Generazione dati storici all'avvio
GENERATE_HISTORICAL_DATA=false

# Parametri di volatilità
MARKET_VOLATILITY_MULTIPLIER=1.0
DEFAULT_STOCK_VOLATILITY=0.25
DEFAULT_CRYPTO_VOLATILITY=0.80

# Probabilità eventi
MARKET_EVENT_PROBABILITY_MULTIPLIER=1.0
USER_TRANSACTION_PROBABILITY=0.8
```

### Inizializzazione

```javascript
const simulationInitializer = require('./src/init/simulation');

// Inizializza il sistema
await simulationInitializer.initialize();

// Ottieni lo stato
const status = simulationInitializer.getStatus();

// Riavvia il sistema
await simulationInitializer.restart();
```

## Utilizzo

### 1. Avvio Automatico
Il sistema si avvia automaticamente con l'applicazione e:
- Verifica la connessione al database
- Sincronizza i modelli
- Inizializza lo scheduler
- Esegue simulazioni programmate

### 2. Simulazione Manuale
```javascript
// Avvia simulazione per oggi
const result = await scheduler.runManualSimulation();

// Avvia simulazione per una data specifica
const result = await scheduler.runManualSimulation(new Date('2024-01-15'));

// Esegui simulazioni storiche
const results = await scheduler.runHistoricalSimulations(
  new Date('2024-01-01'), 
  new Date('2024-01-31')
);
```

### 3. Monitoraggio
```javascript
// Stato del sistema
const status = scheduler.getSchedulerStatus();

// Statistiche recenti
const stats = await simulationService.getSimulationStats(
  new Date('2024-01-01'), 
  new Date('2024-01-31')
);

// Performance asset
const performance = await simulationService.getAssetPerformance('AAPL', 30);
```

## Output e Report

### Report Giornaliero
- Performance media del mercato
- Variazione saldo totale
- Asset con migliore/peggiore performance
- Numero di eventi e transazioni
- Alert e notifiche

### Report Mensile
- Statistiche aggregate mensili
- Performance media del periodo
- Giorni migliori e peggiori
- Trend e analisi

### Dashboard
- Saldo corrente aggregato
- Performance recenti
- Eventi attivi
- Alert e notifiche
- Grafici di trend

## Manutenzione

### Pulizia Dati
- Eliminazione automatica di dati vecchi (>1 anno)
- Esecuzione mensile alle 02:00
- Configurabile tramite variabili d'ambiente

### Backup
- I dati sono persistenti nel database PostgreSQL
- Backup regolari del database raccomandati
- Export periodici per analisi esterne

### Monitoraggio
- Log dettagliati di tutte le operazioni
- Metriche di performance
- Alert per errori e anomalie
- Stato del sistema in tempo reale

## Estensioni e Personalizzazioni

### Nuovi Asset
```javascript
// Aggiungi nuovo asset nel MarketSimulationService
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

### Nuovi Eventi
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

### Nuove Transazioni
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

## Troubleshooting

### Problemi Comuni

1. **Database non raggiungibile**
   - Verifica connessione e credenziali
   - Controlla firewall e porte
   - Verifica variabili d'ambiente

2. **Simulazioni non si avviano**
   - Controlla lo stato dello scheduler
   - Verifica log per errori
   - Controlla configurazione cron

3. **Performance lente**
   - Ottimizza query database
   - Riduci frequenza simulazioni
   - Aumenta risorse sistema

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

## Sicurezza

- Tutte le API sono protette da rate limiting
- Validazione input su tutti gli endpoint
- Logging di tutte le operazioni
- Gestione errori robusta
- Timeout per operazioni lunghe

## Performance

- Simulazioni asincrone per non bloccare l'app
- Batch processing per operazioni multiple
- Indici database ottimizzati
- Pool di connessioni configurato
- Cleanup automatico dei dati vecchi

## Supporto

Per supporto tecnico o domande:
- Controlla i log dell'applicazione
- Verifica la documentazione API
- Controlla lo stato del sistema via endpoint `/status`
- Riavvia il sistema se necessario

---

**Nota**: Questo sistema è progettato per scopi di test e sviluppo. Non utilizzare i dati simulati per decisioni finanziarie reali.
