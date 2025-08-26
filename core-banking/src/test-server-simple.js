require('express-async-errors');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.CORE_BANKING_PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (ridotto per i test)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Aumentato per i test
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'core-banking-simple',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MOCKED'
  });
});

// Simulation health check
app.get('/simulation/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'simulation-system-simple',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MOCKED',
    features: [
      'market-simulation',
      'user-transactions',
      'market-events',
      'daily-summaries',
      'automated-scheduling'
    ]
  });
});

// Test simulation endpoints (senza database)
app.get('/api/simulation/status', (req, res) => {
  res.json({
    success: true,
    data: {
      scheduler: {
        isInitialized: true,
        activeJobs: 5,
        jobDetails: {
          dailySimulation: { scheduled: true, running: false },
          hourlyMarketSimulation: { scheduled: true, running: false },
          weeklySimulation: { scheduled: true, running: false },
          monthlySimulation: { scheduled: true, running: false },
          dataCleanup: { scheduled: true, running: false }
        }
      },
      lastSimulation: {
        date: new Date().toISOString().split('T')[0],
        marketPerformance: 2.45,
        totalBalance: 425000.00
      },
      systemHealth: {
        database: 'MOCKED',
        scheduler: 'RUNNING',
        timestamp: new Date().toISOString()
      }
    }
  });
});

app.post('/api/simulation/start', (req, res) => {
  const { date } = req.body;
  const simulationDate = date || new Date().toISOString().split('T')[0];
  
  res.json({
    success: true,
    message: 'Simulazione avviata con successo (mock mode)',
    data: {
      date: simulationDate,
      marketSimulations: 18,
      marketEvents: 3,
      userTransactions: 25,
      dailySummary: {
        totalBalance: 425000.00,
        marketPerformance: 2.45,
        totalTransactions: 25,
        totalEvents: 3
      }
    }
  });
});

app.get('/api/simulation/dashboard', (req, res) => {
  const { days = 7 } = req.query;
  
  res.json({
    success: true,
    data: {
      period: `${new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} - ${new Date().toISOString().split('T')[0]}`,
      currentBalance: 425000.00,
      averageMarketPerformance: 1.23,
      totalTransactions: 156,
      totalEvents: 8,
      daysSimulated: parseInt(days),
      activeEvents: 3,
      recentPerformance: [
        { date: '2024-01-15', marketPerformance: 2.45, totalBalance: 425000, totalTransactions: 25 },
        { date: '2024-01-14', marketPerformance: 1.87, totalBalance: 415000, totalTransactions: 22 },
        { date: '2024-01-13', marketPerformance: -0.32, totalBalance: 408000, totalTransactions: 18 }
      ],
      alerts: [
        { type: 'ASSET_BOOM', severity: 'LOW', message: 'AAPL in forte crescita (+15%)' },
        { type: 'MARKET_EVENT', severity: 'MEDIUM', message: 'Nuovo evento di mercato attivo' }
      ]
    }
  });
});

app.get('/api/simulation/stats', (req, res) => {
  const { startDate, endDate, limit = 30 } = req.query;
  
  res.json({
    success: true,
    data: {
      period: `${startDate || '2024-01-01'} - ${endDate || '2024-01-31'}`,
      totalDays: parseInt(limit),
      stats: Array.from({ length: parseInt(limit) }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalBalance: 400000 + Math.random() * 50000,
        marketPerformance: -5 + Math.random() * 10,
        totalTransactions: 15 + Math.floor(Math.random() * 20),
        totalEvents: 1 + Math.floor(Math.random() * 5)
      }))
    }
  });
});

// API endpoints per il frontend
app.get('/api/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        totalBalance: 125000,
        monthlyGrowth: 8.5,
        activeAccounts: 45,
        totalTransactions: 1234,
      },
      transactions: [
        {
          id: '1',
          type: 'transfer',
          amount: 5000,
          currency: 'EUR',
          description: 'Transfer to Account IT987654321',
          status: 'completed',
          timestamp: new Date('2024-01-15T10:30:00'),
        },
        {
          id: '2',
          type: 'deposit',
          amount: 10000,
          currency: 'EUR',
          description: 'Salary deposit',
          status: 'completed',
          timestamp: new Date('2024-01-14T09:15:00'),
        },
        {
          id: '3',
          type: 'payment',
          amount: -250,
          currency: 'EUR',
          description: 'Utility bill payment',
          status: 'pending',
          timestamp: new Date('2024-01-15T14:20:00'),
        },
      ],
      cryptoPrices: [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 45000,
          change24h: 1200,
          changePercent: 2.7,
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3000,
          change24h: -50,
          changePercent: -1.6,
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          price: 1.2,
          change24h: 0.05,
          changePercent: 4.3,
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          price: 25,
          change24h: -1.2,
          changePercent: -4.6,
        },
      ],
      systemAlerts: [],
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧪 Test server semplice running on port ${PORT}`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
  console.log(`📊 Simulation health check at http://localhost:${PORT}/simulation/health`);
  console.log(`📈 Simulation API available at http://localhost:${PORT}/api/simulation`);
  console.log(`🎯 Dashboard API available at http://localhost:${PORT}/api/dashboard`);
});

module.exports = app;
