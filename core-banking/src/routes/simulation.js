const express = require('express');
const router = express.Router();
const MarketSimulationService = require('../services/MarketSimulationService');
const SimulationScheduler = require('../services/SimulationScheduler');
const { logger } = require('../utils/logger');

// Inizializza i servizi in modo lazy per evitare errori all'avvio
let simulationService = null;
let scheduler = null;

function getSimulationService() {
  if (!simulationService) {
    try {
      simulationService = new MarketSimulationService();
    } catch (error) {
      logger.error('Errore nell\'inizializzazione di MarketSimulationService:', error);
      throw error;
    }
  }
  return simulationService;
}

function getScheduler() {
  if (!scheduler) {
    try {
      scheduler = new SimulationScheduler();
    } catch (error) {
      logger.error('Errore nell\'inizializzazione di SimulationScheduler:', error);
      throw error;
    }
  }
  return scheduler;
}

/**
 * @route GET /api/simulation/status
 * @desc Ottiene lo stato del sistema di simulazione
 * @access Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = getScheduler().getSchedulerStatus();
    
    res.json({
      success: true,
      data: {
        scheduler: status,
        lastSimulation: await getLastSimulationInfo(),
        systemHealth: await getSystemHealth()
      }
    });
  } catch (error) {
    logger.error('Errore nel recupero dello stato:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero dello stato del sistema'
    });
  }
});

/**
 * @route POST /api/simulation/start
 * @desc Avvia manualmente una simulazione
 * @access Public
 */
router.post('/start', async (req, res) => {
  try {
    const { date } = req.body;
    const simulationDate = date ? new Date(date) : new Date();
    
    logger.info(`Avvio simulazione manuale richiesta per ${simulationDate.toISOString().split('T')[0]}`);
    
    const result = await getScheduler().runManualSimulation(simulationDate);
    
    res.json({
      success: true,
      message: 'Simulazione avviata con successo',
      data: result
    });
  } catch (error) {
    logger.error('Errore nell\'avvio della simulazione:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nell\'avvio della simulazione',
      details: error.message
    });
  }
});

/**
 * @route POST /api/simulation/initialize
 * @desc Inizializza il sistema di simulazione
 * @access Public
 */
router.post('/initialize', async (req, res) => {
  try {
    logger.info('Inizializzazione sistema di simulazione richiesta');
    
    await getScheduler().initialize();
    
    res.json({
      success: true,
      message: 'Sistema di simulazione inizializzato con successo',
      data: getScheduler().getSchedulerStatus()
    });
  } catch (error) {
    logger.error('Errore nell\'inizializzazione del sistema:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nell\'inizializzazione del sistema',
      details: error.message
    });
  }
});

/**
 * @route POST /api/simulation/restart
 * @desc Riavvia il sistema di simulazione
 * @access Public
 */
router.post('/restart', async (req, res) => {
  try {
    logger.info('Riavvio sistema di simulazione richiesto');
    
    await getScheduler().restart();
    
    res.json({
      success: true,
      message: 'Sistema di simulazione riavviato con successo',
      data: getScheduler().getSchedulerStatus()
    });
  } catch (error) {
    logger.error('Errore nel riavvio del sistema:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel riavvio del sistema',
      details: error.message
    });
  }
});

/**
 * @route POST /api/simulation/stop
 * @desc Ferma tutti i job schedulati
 * @access Public
 */
router.post('/stop', async (req, res) => {
  try {
    logger.info('Arresto sistema di simulazione richiesto');
    
    getScheduler().stopAllJobs();
    
    res.json({
      success: true,
      message: 'Sistema di simulazione arrestato con successo',
      data: getScheduler().getSchedulerStatus()
    });
  } catch (error) {
    logger.error('Errore nell\'arresto del sistema:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nell\'arresto del sistema',
      details: error.message
    });
  }
});

/**
 * @route GET /api/simulation/stats
 * @desc Ottiene le statistiche delle simulazioni
 * @access Public
 */
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - parseInt(limit));
    }
    
    const stats = await getSimulationService().getSimulationStats(start, end);
    
    res.json({
      success: true,
      data: {
        period: `${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`,
        totalDays: stats.length,
        stats: stats
      }
    });
  } catch (error) {
    logger.error('Errore nel recupero delle statistiche:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero delle statistiche',
      details: error.message
    });
  }
});

/**
 * @route GET /api/simulation/assets
 * @desc Ottiene le performance degli asset
 * @access Public
 */
router.get('/assets', async (req, res) => {
  try {
    const { symbol, days = 30 } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Parametro symbol richiesto'
      });
    }
    
    const performance = await getSimulationService().getAssetPerformance(symbol, parseInt(days));
    
    res.json({
      success: true,
      data: {
        symbol,
        days: parseInt(days),
        performance: performance
      }
    });
  } catch (error) {
    logger.error('Errore nel recupero delle performance degli asset:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero delle performance degli asset',
      details: error.message
    });
  }
});

/**
 * @route GET /api/simulation/transactions
 * @desc Ottiene le transazioni simulate di un utente
 * @access Public
 */
router.get('/transactions', async (req, res) => {
  try {
    const { userId, startDate, endDate, limit = 100 } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Parametro userId richiesto'
      });
    }
    
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - parseInt(limit));
    }
    
    const transactions = await getSimulationService().getUserTransactions(userId, start, end);
    
    res.json({
      success: true,
      data: {
        userId,
        period: `${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`,
        totalTransactions: transactions.length,
        transactions: transactions
      }
    });
  } catch (error) {
    logger.error('Errore nel recupero delle transazioni:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero delle transazioni',
      details: error.message
    });
  }
});

/**
 * @route GET /api/simulation/events
 * @desc Ottiene gli eventi di mercato attivi
 * @access Public
 */
router.get('/events', async (req, res) => {
  try {
    const { active = true, limit = 50 } = req.query;
    
    let events;
    if (active === 'true') {
      events = await getSimulationService().getActiveEvents();
    } else {
      // Qui puoi implementare la logica per ottenere tutti gli eventi
      events = [];
    }
    
    res.json({
      success: true,
      data: {
        totalEvents: events.length,
        events: events.slice(0, parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Errore nel recupero degli eventi:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero degli eventi',
      details: error.message
    });
  }
});

/**
 * @route POST /api/simulation/historical
 * @desc Esegue simulazioni storiche per un periodo specifico
 * @access Public
 */
router.post('/historical', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Parametri startDate e endDate richiesti'
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    logger.info(`Esecuzione simulazioni storiche richiesta dal ${start.toISOString().split('T')[0]} al ${end.toISOString().split('T')[0]}`);
    
    const results = await getScheduler().runHistoricalSimulations(start, end);
    
    res.json({
      success: true,
      message: 'Simulazioni storiche completate con successo',
      data: {
        period: `${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`,
        totalSimulations: results.length,
        results: results
      }
    });
  } catch (error) {
    logger.error('Errore nell\'esecuzione delle simulazioni storiche:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nell\'esecuzione delle simulazioni storiche',
      details: error.message
    });
  }
});

/**
 * @route GET /api/simulation/report/monthly
 * @desc Genera il report mensile
 * @access Public
 */
router.get('/report/monthly', async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let targetMonth, targetYear;
    if (month && year) {
      targetMonth = parseInt(month) - 1; // JavaScript mesi sono 0-based
      targetYear = parseInt(year);
    } else {
      const now = new Date();
      targetMonth = now.getMonth();
      targetYear = now.getFullYear();
    }
    
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    
    const monthlyStats = await getSimulationService().getSimulationStats(startOfMonth, endOfMonth);
    
    if (monthlyStats.length === 0) {
      return res.json({
        success: true,
        message: 'Nessuna statistica disponibile per il periodo richiesto',
        data: {
          period: `${startOfMonth.toISOString().split('T')[0]} - ${endOfMonth.toISOString().split('T')[0]}`,
          totalDays: 0,
          stats: []
        }
      });
    }
    
    // Calcola statistiche aggregate
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
        parseFloat(current.marketPerformance) < parseFloat(worst.marketPerformance) ? current : worst, monthlyStats[0]),
      dailyStats: monthlyStats
    };
    
    res.json({
      success: true,
      data: monthlyReport
    });
    
  } catch (error) {
    logger.error('Errore nella generazione del report mensile:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nella generazione del report mensile',
      details: error.message
    });
  }
});

/**
 * @route GET /api/simulation/dashboard
 * @desc Ottiene i dati per la dashboard di simulazione
 * @access Public
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Ottieni statistiche recenti
    const recentStats = await getSimulationService().getSimulationStats(startDate, endDate);
    
    // Ottieni eventi attivi
    const activeEvents = await getSimulationService().getActiveEvents();
    
    // Calcola metriche aggregate
    const totalBalance = recentStats.length > 0 ? 
      recentStats[recentStats.length - 1].totalBalance : 0;
    
    const avgMarketPerformance = recentStats.length > 0 ? 
      recentStats.reduce((sum, stat) => sum + parseFloat(stat.marketPerformance), 0) / recentStats.length : 0;
    
    const totalTransactions = recentStats.reduce((sum, stat) => sum + stat.totalTransactions, 0);
    const totalEvents = recentStats.reduce((sum, stat) => sum + stat.totalEvents, 0);
    
    const dashboardData = {
      period: `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`,
      currentBalance: totalBalance,
      averageMarketPerformance: avgMarketPerformance.toFixed(2),
      totalTransactions,
      totalEvents,
      daysSimulated: recentStats.length,
      activeEvents: activeEvents.length,
      recentPerformance: recentStats.map(stat => ({
        date: stat.date,
        marketPerformance: stat.marketPerformance,
        totalBalance: stat.totalBalance,
        totalTransactions: stat.totalTransactions
      })),
      alerts: recentStats.length > 0 ? recentStats[recentStats.length - 1].alerts : []
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    logger.error('Errore nel recupero dei dati della dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Errore nel recupero dei dati della dashboard',
      details: error.message
    });
  }
});

// Funzioni helper
async function getLastSimulationInfo() {
  try {
    const { DailySimulation } = require('../models');
    const lastSimulation = await DailySimulation.findOne({
      order: [['date', 'DESC']]
    });
    
    return lastSimulation ? {
      date: lastSimulation.date,
      marketPerformance: lastSimulation.marketPerformance,
      totalBalance: lastSimulation.totalBalance
    } : null;
  } catch (error) {
    logger.error('Errore nel recupero dell\'ultima simulazione:', error);
    return null;
  }
}

async function getSystemHealth() {
  try {
    const { sequelize } = require('../models');
    await sequelize.authenticate();
    
    return {
      database: 'HEALTHY',
      scheduler: getScheduler().isInitialized ? 'RUNNING' : 'STOPPED',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      database: 'ERROR',
      scheduler: 'UNKNOWN',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

module.exports = router;
