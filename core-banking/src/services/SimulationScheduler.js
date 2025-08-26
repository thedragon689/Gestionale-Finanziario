const cron = require('node-cron');
const { logger } = require('../utils/logger');
const MarketSimulationService = require('./MarketSimulationService');

class SimulationScheduler {
  constructor() {
    this.simulationService = new MarketSimulationService();
    this.jobs = new Map();
    this.isInitialized = false;
  }

  /**
   * Inizializza il scheduler
   */
  async initialize() {
    if (this.isInitialized) {
      logger.warn('Scheduler già inizializzato');
      return;
    }

    try {
      logger.info('Inizializzazione Simulation Scheduler...');
      
      // Verifica che il database sia pronto
      await this.checkDatabaseConnection();
      
      // Imposta i job schedulati
      this.setupScheduledJobs();
      
      this.isInitialized = true;
      logger.info('Simulation Scheduler inizializzato con successo');
      
    } catch (error) {
      logger.error('Errore durante l\'inizializzazione del scheduler:', error);
      throw error;
    }
  }

  /**
   * Verifica la connessione al database
   */
  async checkDatabaseConnection() {
    try {
      const { sequelize } = require('../models');
      await sequelize.authenticate();
      logger.info('Connessione al database verificata');
    } catch (error) {
      logger.error('Errore di connessione al database:', error);
      throw error;
    }
  }

  /**
   * Imposta i job schedulati
   */
  setupScheduledJobs() {
    // Simulazione giornaliera alle 00:01 (dopo la mezzanotte)
    this.scheduleDailySimulation();
    
    // Simulazione di mercato ogni ora durante l'orario di trading (9:00-17:00)
    this.scheduleHourlyMarketSimulation();
    
    // Simulazione settimanale ogni domenica alle 23:00
    this.scheduleWeeklySimulation();
    
    // Simulazione mensile il primo del mese alle 00:05
    this.scheduleMonthlySimulation();
    
    // Pulizia dati vecchi ogni mese
    this.scheduleDataCleanup();
    
    logger.info('Job schedulati configurati');
  }

  /**
   * Schedula la simulazione giornaliera
   */
  scheduleDailySimulation() {
    const job = cron.schedule('1 0 * * *', async () => {
      logger.info('Esecuzione simulazione giornaliera programmata');
      
      try {
        const result = await this.simulationService.runDailySimulation();
        logger.info(`Simulazione giornaliera completata: ${result.marketSimulations} asset, ${result.userTransactions} transazioni`);
        
        // Invia notifiche se configurato
        await this.sendDailyNotifications(result);
        
      } catch (error) {
        logger.error('Errore durante la simulazione giornaliera programmata:', error);
        await this.sendErrorNotification('Simulazione giornaliera fallita', error);
      }
    }, {
      timezone: 'Europe/Rome',
      scheduled: true
    });
    
    this.jobs.set('dailySimulation', job);
    logger.info('Simulazione giornaliera schedulata per le 00:01');
  }

  /**
   * Schedula la simulazione oraria del mercato
   */
  scheduleHourlyMarketSimulation() {
    // Simulazione ogni ora dalle 9:00 alle 17:00 (orario di trading)
    const job = cron.schedule('0 9-17 * * 1-5', async () => {
      logger.info('Esecuzione simulazione oraria del mercato');
      
      try {
        // Simula solo movimenti di mercato (più veloce)
        await this.simulationService.simulateMarketMovements(new Date());
        logger.info('Simulazione oraria del mercato completata');
        
      } catch (error) {
        logger.error('Errore durante la simulazione oraria del mercato:', error);
      }
    }, {
      timezone: 'Europe/Rome',
      scheduled: true
    });
    
    this.jobs.set('hourlyMarketSimulation', job);
    logger.info('Simulazione oraria del mercato schedulata per le 9:00-17:00 (Lun-Ven)');
  }

  /**
   * Schedula la simulazione settimanale
   */
  scheduleWeeklySimulation() {
    const job = cron.schedule('0 23 * * 0', async () => {
      logger.info('Esecuzione simulazione settimanale programmata');
      
      try {
        // Esegue simulazioni per gli ultimi 7 giorni se non sono state fatte
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        
        await this.runHistoricalSimulations(startDate, endDate);
        logger.info('Simulazione settimanale completata');
        
      } catch (error) {
        logger.error('Errore durante la simulazione settimanale:', error);
        await this.sendErrorNotification('Simulazione settimanale fallita', error);
      }
    }, {
      timezone: 'Europe/Rome',
      scheduled: true
    });
    
    this.jobs.set('weeklySimulation', job);
    logger.info('Simulazione settimanale schedulata per le 23:00 di domenica');
  }

  /**
   * Schedula la simulazione mensile
   */
  scheduleMonthlySimulation() {
    const job = cron.schedule('5 0 1 * *', async () => {
      logger.info('Esecuzione simulazione mensile programmata');
      
      try {
        // Genera report mensile aggregato
        await this.generateMonthlyReport();
        logger.info('Simulazione mensile completata');
        
      } catch (error) {
        logger.error('Errore durante la simulazione mensile:', error);
        await this.sendErrorNotification('Simulazione mensile fallita', error);
      }
    }, {
      timezone: 'Europe/Rome',
      scheduled: true
    });
    
    this.jobs.set('monthlySimulation', job);
    logger.info('Simulazione mensile schedulata per le 00:05 del primo del mese');
  }

  /**
   * Schedula la pulizia dei dati vecchi
   */
  scheduleDataCleanup() {
    const job = cron.schedule('0 2 1 * *', async () => {
      logger.info('Esecuzione pulizia dati vecchi programmata');
      
      try {
        await this.cleanupOldData();
        logger.info('Pulizia dati vecchi completata');
        
      } catch (error) {
        logger.error('Errore durante la pulizia dei dati vecchi:', error);
      }
    }, {
      timezone: 'Europe/Rome',
      scheduled: true
    });
    
    this.jobs.set('dataCleanup', job);
    logger.info('Pulizia dati vecchi schedulata per le 02:00 del primo del mese');
  }

  /**
   * Esegue simulazioni storiche per un periodo specifico
   */
  async runHistoricalSimulations(startDate, endDate) {
    logger.info(`Esecuzione simulazioni storiche dal ${startDate.toISOString().split('T')[0]} al ${endDate.toISOString().split('T')[0]}`);
    
    const currentDate = new Date(startDate);
    const results = [];
    
    while (currentDate <= endDate) {
      try {
        // Verifica se esiste già una simulazione per questa data
        const existingSimulation = await this.simulationService.getSimulationStats(currentDate, currentDate);
        
        if (existingSimulation.length === 0) {
          logger.info(`Esecuzione simulazione per ${currentDate.toISOString().split('T')[0]}`);
          const result = await this.simulationService.runDailySimulation(currentDate);
          results.push(result);
        } else {
          logger.info(`Simulazione già esistente per ${currentDate.toISOString().split('T')[0]}`);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
        
      } catch (error) {
        logger.error(`Errore durante la simulazione storica per ${currentDate.toISOString().split('T')[0]}:`, error);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    logger.info(`Simulazioni storiche completate: ${results.length} nuove simulazioni`);
    return results;
  }

  /**
   * Genera report mensile aggregato
   */
  async generateMonthlyReport() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    try {
      const monthlyStats = await this.simulationService.getSimulationStats(startOfMonth, endOfMonth);
      
      if (monthlyStats.length === 0) {
        logger.warn('Nessuna statistica mensile disponibile');
        return;
      }
      
      // Calcola statistiche aggregate mensili
      const totalBalance = monthlyStats.reduce((sum, stat) => sum + parseFloat(stat.totalBalance), 0);
      const avgMarketPerformance = monthlyStats.reduce((sum, stat) => sum + parseFloat(stat.marketPerformance), 0) / monthlyStats.length;
      const totalTransactions = monthlyStats.reduce((sum, stat) => sum + stat.totalTransactions, 0);
      const totalEvents = monthlyStats.reduce((sum, stat) => sum + stat.totalEvents, 0);
      
      const monthlyReport = {
        period: `${startOfMonth.toISOString().split('T')[0]} - ${endOfMonth.toISOString().split('T')[0]}`,
        totalBalance: totalBalance.toFixed(2),
        averageMarketPerformance: avgMarketPerformance.toFixed(2),
        totalTransactions,
        totalEvents,
        daysSimulated: monthlyStats.length,
        bestDay: monthlyStats.reduce((best, current) => 
          parseFloat(current.marketPerformance) > parseFloat(best.marketPerformance) ? current : best, monthlyStats[0]),
        worstDay: monthlyStats.reduce((worst, current) => 
          parseFloat(current.marketPerformance) < parseFloat(worst.marketPerformance) ? current : worst, monthlyStats[0])
      };
      
      logger.info('=== REPORT MENSILE SIMULAZIONE ===');
      logger.info(`Periodo: ${monthlyReport.period}`);
      logger.info(`Saldo totale medio: €${monthlyReport.totalBalance}`);
      logger.info(`Performance media mercato: ${monthlyReport.averageMarketPerformance}%`);
      logger.info(`Transazioni totali: ${monthlyReport.totalTransactions}`);
      logger.info(`Eventi totali: ${monthlyReport.totalEvents}`);
      logger.info(`Giorni simulati: ${monthlyReport.daysSimulated}`);
      logger.info(`Miglior giorno: ${monthlyReport.bestDay?.date} (${monthlyReport.bestDay?.marketPerformance}%)`);
      logger.info(`Peggior giorno: ${monthlyReport.worstDay?.date} (${monthlyReport.worstDay?.marketPerformance}%)`);
      logger.info('==================================');
      
      return monthlyReport;
      
    } catch (error) {
      logger.error('Errore durante la generazione del report mensile:', error);
      throw error;
    }
  }

  /**
   * Pulisce i dati vecchi (più di 1 anno)
   */
  async cleanupOldData() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    try {
      const { MarketSimulation, SimulatedTransaction, SimulatedEvent, DailySimulation } = require('../models');
      
      // Elimina simulazioni di mercato vecchie
      const deletedMarketSims = await MarketSimulation.destroy({
        where: {
          date: {
            [require('sequelize').Op.lt]: oneYearAgo
          }
        }
      });
      
      // Elimina transazioni simulate vecchie
      const deletedTransactions = await SimulatedTransaction.destroy({
        where: {
          date: {
            [require('sequelize').Op.lt]: oneYearAgo
          }
        }
      });
      
      // Elimina eventi vecchi (mantieni solo quelli attivi)
      const deletedEvents = await SimulatedEvent.destroy({
        where: {
          date: {
            [require('sequelize').Op.lt]: oneYearAgo
          },
          isActive: false
        }
      });
      
      // Elimina riepiloghi giornalieri vecchi
      const deletedDailySims = await DailySimulation.destroy({
        where: {
          date: {
            [require('sequelize').Op.lt]: oneYearAgo
          }
        }
      });
      
      logger.info(`Pulizia completata: ${deletedMarketSims} simulazioni mercato, ${deletedTransactions} transazioni, ${deletedEvents} eventi, ${deletedDailySims} riepiloghi giornalieri`);
      
    } catch (error) {
      logger.error('Errore durante la pulizia dei dati vecchi:', error);
      throw error;
    }
  }

  /**
   * Invia notifiche giornaliere
   */
  async sendDailyNotifications(result) {
    // Qui puoi implementare l'invio di notifiche via email, Slack, etc.
    logger.info('Notifiche giornaliere inviate');
  }

  /**
   * Invia notifiche di errore
   */
  async sendErrorNotification(message, error) {
    // Qui puoi implementare l'invio di notifiche di errore
    logger.error(`Notifica di errore: ${message}`, error);
  }

  /**
   * Avvia manualmente una simulazione
   */
  async runManualSimulation(date = new Date()) {
    try {
      logger.info(`Avvio simulazione manuale per ${date.toISOString().split('T')[0]}`);
      const result = await this.simulationService.runDailySimulation(date);
      logger.info('Simulazione manuale completata con successo');
      return result;
    } catch (error) {
      logger.error('Errore durante la simulazione manuale:', error);
      throw error;
    }
  }

  /**
   * Ottiene lo stato del scheduler
   */
  getSchedulerStatus() {
    const status = {
      isInitialized: this.isInitialized,
      activeJobs: this.jobs.size,
      jobDetails: {}
    };
    
    for (const [name, job] of this.jobs) {
      status.jobDetails[name] = {
        scheduled: job.scheduled,
        running: job.running
      };
    }
    
    return status;
  }

  /**
   * Ferma tutti i job schedulati
   */
  stopAllJobs() {
    logger.info('Arresto di tutti i job schedulati...');
    
    for (const [name, job] of this.jobs) {
      job.stop();
      logger.info(`Job ${name} arrestato`);
    }
    
    this.jobs.clear();
    this.isInitialized = false;
    logger.info('Tutti i job sono stati arrestati');
  }

  /**
   * Riavvia il scheduler
   */
  async restart() {
    logger.info('Riavvio del Simulation Scheduler...');
    
    this.stopAllJobs();
    await this.initialize();
    
    logger.info('Simulation Scheduler riavviato con successo');
  }
}

module.exports = SimulationScheduler;
