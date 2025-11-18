# 🛠️ Tecnologie Utilizzate - Gestionale Finanziario

## 📋 Panoramica

Questo documento elenca tutte le tecnologie, framework, librerie e strumenti utilizzati nel progetto **Gestionale Finanziario**.

---

## 🎨 Frontend

### Framework e Librerie Core

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **React** | 18.2.0 | Framework UI principale |
| **TypeScript** | 5.9.2 | Linguaggio di programmazione |
| **React Router** | 6.20.1 | Routing e navigazione |
| **Create React App** | 5.0.1 | Build tool e configurazione |

### UI Framework e Styling

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Material-UI (MUI)** | 5.14.20 | Componenti UI |
| **@mui/icons-material** | 5.14.19 | Icone Material Design |
| **@mui/lab** | 5.0.0-alpha.165 | Componenti sperimentali MUI |
| **@emotion/react** | 11.11.1 | CSS-in-JS styling |
| **@emotion/styled** | 11.11.0 | Styled components |

### Grafici e Visualizzazioni

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Recharts** | 3.1.2 | Grafici e visualizzazioni dati |

### Backend Integration

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Axios** | 1.11.0 | HTTP client per API |
| **@supabase/supabase-js** | 2.78.0 | Client Supabase (Auth, Database) |

### Utilities

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **web-vitals** | 2.1.4 | Metriche performance web |

---

## ⚙️ Backend (Core Banking)

### Runtime e Framework

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Node.js** | >=18.0.0 | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web server |
| **express-async-errors** | 3.1.1 | Gestione errori async |

### Database e ORM

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **PostgreSQL** | - | Database relazionale |
| **Sequelize** | 6.35.1 | ORM per PostgreSQL |
| **pg** | 8.11.3 | Driver PostgreSQL |
| **pg-hstore** | 2.3.4 | Serializzazione hstore |
| **Supabase** | 2.78.0 | Backend-as-a-Service (Auth, Database) |

### Caching

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Redis** | 4.6.10 | Cache in-memory |
| **ioredis** | 5.3.2 | Client Redis |
| **node-cache** | 5.1.2 | Cache locale |

### Autenticazione e Sicurezza

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **jsonwebtoken** | 9.0.2 | JWT tokens |
| **bcryptjs** | 2.4.3 | Hashing password |
| **helmet** | 7.1.0 | Security headers HTTP |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing |
| **express-rate-limit** | 7.1.5 | Rate limiting |

### Validazione e Parsing

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **joi** | 17.11.0 | Validazione schema |
| **express-validator** | 7.0.1 | Validazione richieste |
| **multer** | 1.4.5-lts.1 | Upload file |

### Calcoli Finanziari

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **decimal.js** | 10.4.3 | Calcoli decimali precisi |
| **big.js** | 6.2.1 | Aritmetica big number |

### Utilities

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **lodash** | 4.17.21 | Utility functions |
| **moment** | 2.29.4 | Manipolazione date |
| **uuid** | 9.0.1 | Generazione UUID |
| **axios** | 1.6.2 | HTTP client |

### Logging e Monitoring

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **winston** | 3.11.0 | Logging avanzato |
| **winston-daily-rotate-file** | 4.7.1 | Rotazione log giornaliera |
| **morgan** | 1.10.0 | HTTP request logger |

### Documentazione API

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **swagger-jsdoc** | 6.2.8 | Documentazione Swagger |
| **swagger-ui-express** | 5.0.0 | UI Swagger |

### Scheduling

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **node-cron** | 3.0.3 | Task scheduling |

### Performance

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **compression** | 1.7.4 | Compressione risposte HTTP |

### Configurazione

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **dotenv** | 16.3.1 | Gestione variabili d'ambiente |

---

## 🗄️ Database e Storage

### Database Principale

| Tecnologia | Utilizzo |
|------------|----------|
| **Supabase PostgreSQL** | Database principale con RLS (Row Level Security) |
| **PostgreSQL** | Database relazionale tradizionale (opzionale) |

### Cache

| Tecnologia | Utilizzo |
|------------|----------|
| **Redis** | Cache in-memory per performance |
| **node-cache** | Cache locale in-process |

---

## 🔐 Autenticazione e Sicurezza

| Tecnologia | Utilizzo |
|------------|----------|
| **Supabase Auth** | Autenticazione utenti (JWT) |
| **JWT (jsonwebtoken)** | Token autenticazione |
| **bcryptjs** | Hashing password |
| **Helmet** | Security headers |
| **CORS** | Cross-origin requests |
| **Rate Limiting** | Protezione da abusi |

---

## 🚀 Deployment e DevOps

### Hosting

| Tecnologia | Utilizzo |
|------------|----------|
| **Vercel** | Deploy frontend (React) |
| **Supabase** | Backend-as-a-Service (Database, Auth) |

### Containerizzazione

| Tecnologia | Utilizzo |
|------------|----------|
| **Docker** | Containerizzazione servizi |
| **Docker Compose** | Orchestrazione multi-container |

### Build Tools

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Babel** | 6.26.0 | Transpilazione JavaScript |
| **babel-preset-env** | 1.7.0 | Preset Babel |

---

## 🧪 Testing e Quality

### Testing

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **Jest** | 29.7.0 | Framework testing |
| **supertest** | 6.3.3 | Testing API HTTP |

### Code Quality

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **ESLint** | 8.55.0 | Linter JavaScript |
| **eslint-config-airbnb-base** | 15.0.0 | Configurazione ESLint |
| **TypeScript** | 5.9.2 | Type checking |

### Documentazione

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **JSDoc** | 4.0.2 | Documentazione codice |

---

## 🛠️ Development Tools

### Development

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **nodemon** | 3.0.2 | Auto-reload sviluppo |
| **sequelize-cli** | 6.6.2 | CLI per migrazioni database |

### Type Definitions

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **@types/react** | 19.1.11 | Type definitions React |
| **@types/react-dom** | 19.1.7 | Type definitions React DOM |
| **@types/axios** | 0.9.36 | Type definitions Axios |
| **@types/jest** | 29.5.8 | Type definitions Jest |

---

## 📊 Architettura

### Pattern Architetturali

- **MVC (Model-View-Controller)** - Backend
- **Component-Based Architecture** - Frontend React
- **RESTful API** - Comunicazione frontend-backend
- **Microservices** - Servizi separati (core-banking, cryptocurrency)

### Design Patterns

- **Service Layer Pattern** - Business logic separata
- **Repository Pattern** - Accesso dati astratto
- **Middleware Pattern** - Express middleware
- **Observer Pattern** - React state management

---

## 🔗 Integrazioni

### Servizi Esterni

| Servizio | Utilizzo |
|----------|----------|
| **Supabase** | Database, Autenticazione, Storage |
| **Vercel** | Hosting frontend |
| **Docker Hub** | Container registry |

---

## 📦 Gestione Dipendenze

| Strumento | Utilizzo |
|-----------|----------|
| **npm** | Package manager |
| **package-lock.json** | Lock file versioni |

---

## 🌐 Browser Support

### Target Browsers

- Chrome (ultima versione)
- Firefox (ultima versione)
- Safari (ultima versione)
- Edge (ultima versione)

### Polyfills

- Gestiti automaticamente da Create React App
- Babel per compatibilità ES5+

---

## 📝 Linguaggi di Programmazione

| Linguaggio | Utilizzo |
|------------|----------|
| **TypeScript** | Frontend (principale) |
| **JavaScript (ES6+)** | Backend, configurazioni |
| **SQL** | Query database, migrazioni |
| **CSS** | Styling (via Emotion/MUI) |

---

## 🔄 Version Control

| Strumento | Utilizzo |
|-----------|----------|
| **Git** | Version control |
| **GitHub** | Repository hosting |

---

## 📚 Documentazione e Standard

- **OpenAPI/Swagger** - Documentazione API
- **JSDoc** - Documentazione codice
- **Markdown** - Documentazione progetto

---

## 🎯 Stack Completo

### Frontend Stack
```
React + TypeScript + Material-UI + React Router + Supabase + Axios
```

### Backend Stack
```
Node.js + Express + Sequelize + PostgreSQL + Supabase + Redis + JWT
```

### DevOps Stack
```
Docker + Docker Compose + Vercel + Supabase Cloud
```

### Database Stack
```
Supabase PostgreSQL + Redis Cache
```

---

## 📊 Statistiche Tecnologie

- **Linguaggi**: TypeScript, JavaScript, SQL
- **Framework Frontend**: React 18
- **Framework Backend**: Express 4
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis
- **Deploy**: Vercel (Frontend), Supabase (Backend)
- **Container**: Docker
- **Testing**: Jest
- **CI/CD**: Vercel automatico

---

**Ultimo aggiornamento**: 2024-11-18

