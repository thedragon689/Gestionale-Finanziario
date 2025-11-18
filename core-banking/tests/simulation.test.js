const SimulationScheduler = require('../src/services/SimulationScheduler');
const MarketSimulationService = require('../src/services/MarketSimulationService');

// Mock del logger per i test
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

// Mock del database per i test
jest.mock('../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  },
  testConnection: jest.fn().mockResolvedValue(true),
  syncModels: jest.fn().mockResolvedValue(true)
}));

// Mock dei modelli per i test
jest.mock('../src/models/index.js', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  }
}));

describe('Sistema di Simulazione Finanziaria', () => {
  let scheduler;
  let simulationService;

  beforeEach(() => {
    scheduler = new SimulationScheduler();
    simulationService = new MarketSimulationService();
  });

  describe('SimulationScheduler', () => {
    test('dovrebbe inizializzare correttamente', async () => {
      const result = await scheduler.initialize();
      expect(result).toBeDefined();
      expect(scheduler.isInitialized).toBe(true);
    });

    test('dovrebbe avviare simulazione giornaliera', async () => {
      await scheduler.initialize();
      const result = await scheduler.startDailySimulation();
      expect(result).toBeDefined();
      expect(result.scheduled).toBe(true);
    });

    test('dovrebbe avviare simulazione oraria', async () => {
      await scheduler.initialize();
      const result = await scheduler.startHourlySimulation();
      expect(result).toBeDefined();
      expect(result.scheduled).toBe(true);
    });

    test('dovrebbe avviare simulazione settimanale', async () => {
      await scheduler.initialize();
      const result = await scheduler.startWeeklySimulation();
      expect(result).toBeDefined();
      expect(result.scheduled).toBe(true);
    });

    test('dovrebbe avviare simulazione mensile', async () => {
      await scheduler.initialize();
      const result = await scheduler.startMonthlySimulation();
      expect(result).toBeDefined();
      expect(result.scheduled).toBe(true);
    });

    test('dovrebbe avviare pulizia dati', async () => {
      await scheduler.initialize();
      const result = await scheduler.startDataCleanup();
      expect(result).toBeDefined();
      expect(result.scheduled).toBe(true);
    });

    test('dovrebbe eseguire simulazione manuale', async () => {
      await scheduler.initialize();
      const result = await scheduler.runManualSimulation();
      expect(result).toBeDefined();
      expect(result.marketSimulations).toBeGreaterThan(0);
      expect(result.userTransactions).toBeGreaterThan(0);
      expect(result.marketEvents).toBeGreaterThan(0);
    });

    test('dovrebbe ottenere stato scheduler', () => {
      const status = scheduler.getSchedulerStatus();
      expect(status).toBeDefined();
      expect(status.activeJobs).toBeGreaterThan(0);
      expect(status.jobDetails).toBeDefined();
    });

    test('dovrebbe arrestarsi correttamente', async () => {
      await scheduler.initialize();
      await scheduler.shutdown();
      expect(scheduler.isInitialized).toBe(false);
    });
  });

  describe('MarketSimulationService', () => {
    test('dovrebbe inizializzare correttamente', async () => {
      const result = await simulationService.initialize();
      expect(result).toBeDefined();
    });

    test('dovrebbe generare simulazione di mercato', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateMarketSimulation();
      expect(result).toBeDefined();
      expect(result.assets).toBeDefined();
      expect(result.events).toBeDefined();
    });

    test('dovrebbe generare transazioni utente', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateUserTransactions();
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
      expect(result.transactions.length).toBeGreaterThan(0);
    });

    test('dovrebbe generare eventi di mercato', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateMarketEvents();
      expect(result).toBeDefined();
      expect(result.events).toBeDefined();
      expect(result.events.length).toBeGreaterThan(0);
    });

    test('dovrebbe generare riepilogo giornaliero', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateDailySummary();
      expect(result).toBeDefined();
      expect(result.totalBalance).toBeDefined();
      expect(result.marketPerformance).toBeDefined();
      expect(result.totalTransactions).toBeDefined();
    });

    test('dovrebbe ottenere dati dashboard', async () => {
      await simulationService.initialize();
      const result = await simulationService.getDashboardData(7);
      expect(result).toBeDefined();
      expect(result.period).toBeDefined();
      expect(result.currentBalance).toBeDefined();
      expect(result.averageMarketPerformance).toBeDefined();
    });

    test('dovrebbe ottenere statistiche simulazione', async () => {
      await simulationService.initialize();
      const result = await simulationService.getSimulationStats({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        limit: 30
      });
      expect(result).toBeDefined();
      expect(result.period).toBeDefined();
      expect(result.stats).toBeDefined();
      expect(result.stats.length).toBeGreaterThan(0);
    });

    test('dovrebbe ottenere eventi di mercato', async () => {
      await simulationService.initialize();
      const result = await simulationService.getMarketEvents({
        date: '2024-01-15',
        type: 'MARKET_EVENT',
        limit: 50
      });
      expect(result).toBeDefined();
      expect(result.events).toBeDefined();
    });

    test('dovrebbe ottenere transazioni simulate', async () => {
      await simulationService.initialize();
      const result = await simulationService.getSimulatedTransactions({
        userId: '1',
        date: '2024-01-15',
        type: 'transfer',
        limit: 100
      });
      expect(result).toBeDefined();
      expect(result.transactions).toBeDefined();
    });

    test('dovrebbe ottenere performance asset', async () => {
      await simulationService.initialize();
      const result = await simulationService.getAssetPerformance({
        symbol: 'AAPL',
        period: '1d',
        limit: 100
      });
      expect(result).toBeDefined();
      expect(result.performance).toBeDefined();
    });
  });

  describe('Integrazione Sistema', () => {
    test('dovrebbe eseguire ciclo completo di simulazione', async () => {
      // Inizializza scheduler
      await scheduler.initialize();
      
      // Avvia tutti i job
      await scheduler.startDailySimulation();
      await scheduler.startHourlySimulation();
      await scheduler.startWeeklySimulation();
      await scheduler.startMonthlySimulation();
      await scheduler.startDataCleanup();
      
      // Esegui simulazione manuale
      const result = await scheduler.runManualSimulation();
      
      // Verifica risultati
      expect(result).toBeDefined();
      expect(result.marketSimulations).toBeGreaterThan(0);
      expect(result.userTransactions).toBeGreaterThan(0);
      expect(result.marketEvents).toBeGreaterThan(0);
      expect(result.dailySummary).toBeDefined();
      
      // Verifica stato scheduler
      const status = scheduler.getSchedulerStatus();
      expect(status.activeJobs).toBe(5);
      
      // Arresta sistema
      await scheduler.shutdown();
      expect(scheduler.isInitialized).toBe(false);
    });

    test('dovrebbe gestire errori di inizializzazione', async () => {
      // Simula errore di connessione database
      const originalAuthenticate = require('../src/config/database').sequelize.authenticate;
      require('../src/config/database').sequelize.authenticate = jest.fn().mockRejectedValue(new Error('Connection failed'));
      
      try {
        await scheduler.initialize();
        fail('Dovrebbe lanciare un errore');
      } catch (error) {
        expect(error.message).toContain('Connection failed');
      } finally {
        // Ripristina funzione originale
        require('../src/config/database').sequelize.authenticate = originalAuthenticate;
      }
    });

    test('dovrebbe gestire errori di simulazione', async () => {
      await scheduler.initialize();
      
      // Simula errore durante simulazione
      const originalGenerateMarketSimulation = simulationService.generateMarketSimulation;
      simulationService.generateMarketSimulation = jest.fn().mockRejectedValue(new Error('Simulation failed'));
      
      try {
        await scheduler.runManualSimulation();
        fail('Dovrebbe lanciare un errore');
      } catch (error) {
        expect(error.message).toContain('Simulation failed');
      } finally {
        // Ripristina funzione originale
        simulationService.generateMarketSimulation = originalGenerateMarketSimulation;
        await scheduler.shutdown();
      }
    });
  });

  describe('Validazione Dati', () => {
    test('dovrebbe validare dati simulazione', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateMarketSimulation();
      
      // Valida struttura dati
      expect(result.assets).toBeInstanceOf(Array);
      expect(result.events).toBeInstanceOf(Array);
      
      if (result.assets.length > 0) {
        const asset = result.assets[0];
        expect(asset).toHaveProperty('symbol');
        expect(asset).toHaveProperty('price');
        expect(asset).toHaveProperty('changePercent');
      }
      
      if (result.events.length > 0) {
        const event = result.events[0];
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('severity');
        expect(event).toHaveProperty('message');
      }
    });

    test('dovrebbe validare transazioni utente', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateUserTransactions();
      
      expect(result.transactions).toBeInstanceOf(Array);
      
      if (result.transactions.length > 0) {
        const transaction = result.transactions[0];
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('userId');
        expect(transaction).toHaveProperty('amount');
        expect(transaction).toHaveProperty('type');
        expect(transaction).toHaveProperty('timestamp');
      }
    });

    test('dovrebbe validare riepilogo giornaliero', async () => {
      await simulationService.initialize();
      const result = await simulationService.generateDailySummary();
      
      expect(result).toHaveProperty('totalBalance');
      expect(result).toHaveProperty('marketPerformance');
      expect(result).toHaveProperty('totalTransactions');
      expect(result).toHaveProperty('totalEvents');
      expect(result).toHaveProperty('date');
      
      expect(typeof result.totalBalance).toBe('number');
      expect(typeof result.marketPerformance).toBe('number');
      expect(typeof result.totalTransactions).toBe('number');
      expect(typeof result.totalEvents).toBe('number');
    });
  });
});
