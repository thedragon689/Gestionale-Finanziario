const { logger } = require('../utils/logger');
const SimulationScheduler = require('../services/SimulationScheduler');
const MarketSimulationService = require('../services/MarketSimulationService');
const simulationInitializer = require('../init/simulation');

class SimulationController {
  constructor() {
    this.scheduler = new SimulationScheduler();
    this.simulationService = new MarketSimulationService();
  }

  /**
   * Ottiene lo stato del sistema di simulazione
   */
  async getSystemStatus(req, res) {
    try {
      logger.info('📊 Richiesta stato sistema simulazione');
      
      const status = simulationInitializer.getSystemStatus();
      
      res.json({
        success: true,
        data: status
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero stato sistema:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero stato sistema',
        details: error.message
      });
    }
  }

  /**
   * Avvia una simulazione manuale
   */
  async startManualSimulation(req, res) {
    try {
      const { date } = req.body;
      logger.info('🎲 Avvio simulazione manuale', { date });
      
      if (!simulationInitializer.isInitialized) {
        // Inizializza il sistema se non è già inizializzato
        await simulationInitializer.initialize();
      }
      
      const result = await simulationInitializer.runManualSimulation(date);
      
      res.json({
        success: true,
        message: 'Simulazione manuale avviata con successo',
        data: result
      });
      
    } catch (error) {
      logger.error('❌ Errore nell\'avvio simulazione manuale:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nell\'avvio simulazione manuale',
        details: error.message
      });
    }
  }

  /**
   * Ottiene i dati del dashboard di simulazione
   */
  async getDashboardData(req, res) {
    try {
      const { days = 7 } = req.query;
      logger.info('📈 Richiesta dati dashboard simulazione', { days });
      
      const dashboardData = await this.simulationService.getDashboardData(parseInt(days));
      
      res.json({
        success: true,
        data: dashboardData
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero dati dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero dati dashboard',
        details: error.message
      });
    }
  }

  /**
   * Ottiene le statistiche di simulazione
   */
  async getSimulationStats(req, res) {
    try {
      const { startDate, endDate, limit = 30 } = req.query;
      logger.info('📊 Richiesta statistiche simulazione', { startDate, endDate, limit });
      
      const stats = await this.simulationService.getSimulationStats({
        startDate,
        endDate,
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: stats
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero statistiche:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero statistiche',
        details: error.message
      });
    }
  }

  /**
   * Ottiene gli eventi di mercato simulati
   */
  async getMarketEvents(req, res) {
    try {
      const { date, type, limit = 50 } = req.query;
      logger.info('🎯 Richiesta eventi di mercato', { date, type, limit });
      
      const events = await this.simulationService.getMarketEvents({
        date,
        type,
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: events
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero eventi mercato:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero eventi mercato',
        details: error.message
      });
    }
  }

  /**
   * Ottiene le transazioni simulate
   */
  async getSimulatedTransactions(req, res) {
    try {
      const { userId, date, type, limit = 100 } = req.query;
      logger.info('💳 Richiesta transazioni simulate', { userId, date, type, limit });
      
      const transactions = await this.simulationService.getSimulatedTransactions({
        userId,
        date,
        type,
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: transactions
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero transazioni simulate:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero transazioni simulate',
        details: error.message
      });
    }
  }

  /**
   * Ottiene le performance degli asset simulati
   */
  async getAssetPerformance(req, res) {
    try {
      const { symbol, period = '1d', limit = 100 } = req.query;
      logger.info('📈 Richiesta performance asset', { symbol, period, limit });
      
      const performance = await this.simulationService.getAssetPerformance({
        symbol,
        period,
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        data: performance
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero performance asset:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero performance asset',
        details: error.message
      });
    }
  }

  /**
   * Inizializza il sistema di simulazione
   */
  async initializeSystem(req, res) {
    try {
      logger.info('🚀 Richiesta inizializzazione sistema simulazione');
      
      const result = await simulationInitializer.initialize();
      
      res.json({
        success: true,
        message: 'Sistema di simulazione inizializzato con successo',
        data: result
      });
      
    } catch (error) {
      logger.error('❌ Errore nell\'inizializzazione sistema:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nell\'inizializzazione sistema',
        details: error.message
      });
    }
  }

  /**
   * Arresta il sistema di simulazione
   */
  async shutdownSystem(req, res) {
    try {
      logger.info('🛑 Richiesta arresto sistema simulazione');
      
      await simulationInitializer.shutdown();
      
      res.json({
        success: true,
        message: 'Sistema di simulazione arrestato con successo'
      });
      
    } catch (error) {
      logger.error('❌ Errore nell\'arresto sistema:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nell\'arresto sistema',
        details: error.message
      });
    }
  }

  /**
   * Ottiene i log di simulazione
   */
  async getSimulationLogs(req, res) {
    try {
      const { level = 'info', limit = 100, startDate, endDate } = req.query;
      logger.info('📝 Richiesta log simulazione', { level, limit, startDate, endDate });
      
      const logs = await this.simulationService.getSimulationLogs({
        level,
        limit: parseInt(limit),
        startDate,
        endDate
      });
      
      res.json({
        success: true,
        data: logs
      });
      
    } catch (error) {
      logger.error('❌ Errore nel recupero log:', error);
      res.status(500).json({
        success: false,
        error: 'Errore nel recupero log',
        details: error.message
      });
    }
  }
}

module.exports = new SimulationController();
