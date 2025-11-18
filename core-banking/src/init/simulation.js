#!/usr/bin/env node

/**
 * Sistema di Inizializzazione Simulazione Finanziaria
 * 
 * Questo modulo gestisce l'avvio e la configurazione del sistema di simulazione
 * finanziaria, inclusi scheduler, servizi di mercato e database.
 */

require('dotenv').config();
const { logger } = require('../utils/logger');
const SimulationScheduler = require('../services/SimulationScheduler');
const MarketSimulationService = require('../services/MarketSimulationService');
const { sequelize, testConnection, syncModels } = require('../config/database');

class SimulationInitializer {
  constructor() {
    this.scheduler = new SimulationScheduler();
    this.simulationService = new MarketSimulationService();
    this.isInitialized = false;
  }

  /**
   * Inizializza completamente il sistema di simulazione
   */
  async initialize() {
    try {
      logger.info('🚀 Inizializzazione sistema di simulazione finanziaria...');

      // 1. Test connessione database
      await this.initializeDatabase();

      // 2. Sincronizza modelli
      await this.syncDatabaseModels();

      // 3. Inizializza scheduler
      await this.initializeScheduler();

      // 4. Inizializza servizi di simulazione
      await this.initializeSimulationServices();

      // 5. Genera dati storici se richiesto
      await this.generateHistoricalData();

      // 6. Avvia job di simulazione
      await this.startSimulationJobs();

      this.isInitialized = true;
      logger.info('✅ Sistema di simulazione inizializzato con successo!');

      return {
        success: true,
        message: 'Sistema di simulazione inizializzato',
        timestamp: new Date().toISOString(),
        components: {
          database: 'CONNECTED',
          scheduler: 'RUNNING',
          simulationService: 'ACTIVE',
          models: 'SYNCED'
        }
      };

    } catch (error) {
      logger.error('❌ Errore durante l\'inizializzazione:', error);
      throw new Error(`Inizializzazione simulazione fallita: ${error.message}`);
    }
  }

  /**
   * Inizializza la connessione al database
   */
  async initializeDatabase() {
    logger.info('📊 Inizializzazione connessione database...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Impossibile connettersi al database');
    }
    
    logger.info('✅ Connessione database stabilita');
  }

  /**
   * Sincronizza i modelli del database
   */
  async syncDatabaseModels() {
    logger.info('🔄 Sincronizzazione modelli database...');
    
    const forceSync = process.env.NODE_ENV === 'development';
    await syncModels(forceSync);
    
    logger.info('✅ Modelli database sincronizzati');
  }

  /**
   * Inizializza lo scheduler di simulazione
   */
  async initializeScheduler() {
    logger.info('⏰ Inizializzazione scheduler simulazione...');
    
    await this.scheduler.initialize();
    
    const status = this.scheduler.getSchedulerStatus();
    logger.info(`✅ Scheduler inizializzato: ${status.activeJobs} job attivi`);
  }

  /**
   * Inizializza i servizi di simulazione
   */
  async initializeSimulationServices() {
    logger.info('🎯 Inizializzazione servizi simulazione...');
    
    await this.simulationService.initialize();
    
    logger.info('✅ Servizi simulazione inizializzati');
  }

  /**
   * Genera dati storici se richiesto
   */
  async generateHistoricalData() {
    const shouldGenerate = process.env.GENERATE_HISTORICAL_DATA === 'true';
    
    if (shouldGenerate) {
      logger.info('📈 Generazione dati storici simulati...');
      
      try {
        await this.simulationService.generateHistoricalData();
        logger.info('✅ Dati storici generati');
      } catch (error) {
        logger.warn('⚠️ Errore nella generazione dati storici:', error.message);
      }
    } else {
      logger.info('⏭️ Generazione dati storici saltata');
    }
  }

  /**
   * Avvia i job di simulazione programmati
   */
  async startSimulationJobs() {
    logger.info('🚀 Avvio job simulazione programmati...');
    
    try {
      // Avvia simulazione giornaliera
      await this.scheduler.startDailySimulation();
      
      // Avvia simulazione oraria
      await this.scheduler.startHourlySimulation();
      
      // Avvia simulazione settimanale
      await this.scheduler.startWeeklySimulation();
      
      // Avvia simulazione mensile
      await this.scheduler.startMonthlySimulation();
      
      // Avvia pulizia dati
      await this.scheduler.startDataCleanup();
      
      logger.info('✅ Tutti i job simulazione avviati');
      
    } catch (error) {
      logger.error('❌ Errore nell\'avvio job simulazione:', error);
      throw error;
    }
  }

  /**
   * Ottiene lo stato del sistema di simulazione
   */
  getSystemStatus() {
    if (!this.isInitialized) {
      return {
        status: 'NOT_INITIALIZED',
        message: 'Sistema non ancora inizializzato',
        timestamp: new Date().toISOString()
      };
    }

    const schedulerStatus = this.scheduler.getSchedulerStatus();
    
    return {
      status: 'RUNNING',
      message: 'Sistema di simulazione attivo',
      timestamp: new Date().toISOString(),
      scheduler: schedulerStatus,
      database: {
        connected: sequelize.authenticate() ? 'YES' : 'NO',
        models: Object.keys(sequelize.models).length
      }
    };
  }

  /**
   * Esegue una simulazione manuale
   */
  async runManualSimulation(date = null) {
    if (!this.isInitialized) {
      throw new Error('Sistema non inizializzato. Esegui initialize() prima.');
    }

    logger.info('🎲 Esecuzione simulazione manuale...');
    
    try {
      const result = await this.scheduler.runManualSimulation(date);
      logger.info('✅ Simulazione manuale completata');
      return result;
    } catch (error) {
      logger.error('❌ Errore simulazione manuale:', error);
      throw error;
    }
  }

  /**
   * Ferma il sistema di simulazione
   */
  async shutdown() {
    logger.info('🛑 Arresto sistema di simulazione...');
    
    try {
      // Ferma tutti i job
      await this.scheduler.shutdown();
      
      // Chiudi connessioni database
      await sequelize.close();
      
      this.isInitialized = false;
      logger.info('✅ Sistema di simulazione arrestato');
      
    } catch (error) {
      logger.error('❌ Errore durante l\'arresto:', error);
      throw error;
    }
  }
}

// Esporta l'istanza singleton
const simulationInitializer = new SimulationInitializer();

// Gestione graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Segnale SIGINT ricevuto, arresto in corso...');
  await simulationInitializer.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Segnale SIGTERM ricevuto, arresto in corso...');
  await simulationInitializer.shutdown();
  process.exit(0);
});

module.exports = simulationInitializer;
