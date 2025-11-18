#!/usr/bin/env node

/**
 * Script di test per il Sistema di Simulazione Finanziaria
 * 
 * Questo script dimostra come utilizzare il sistema di simulazione
 * per test e sviluppo.
 */

require('dotenv').config();
const { logger } = require('../utils/logger');
const SimulationScheduler = require('../services/SimulationScheduler');
const MarketSimulationService = require('../services/MarketSimulationService');

class SimulationTester {
  constructor() {
    this.scheduler = new SimulationScheduler();
    this.simulationService = new MarketSimulationService();
  }

  /**
   * Esegue tutti i test di simulazione
   */
  async runAllTests() {
    console.log('🧪 Avvio test sistema di simulazione finanziaria...\n');
    
    try {
      // Test 1: Inizializzazione
      await this.testInitialization();
      
      // Test 2: Simulazione manuale
      await this.testManualSimulation();
      
      // Test 3: Simulazioni storiche
      await this.testHistoricalSimulations();
      
      // Test 4: Performance asset
      await this.testAssetPerformance();
      
      // Test 5: Transazioni utente
      await this.testUserTransactions();
      
      // Test 6: Eventi di mercato
      await this.testMarketEvents();
      
      // Test 7: Report e statistiche
      await this.testReports();
      
      // Test 8: Dashboard
      await this.testDashboard();
      
      console.log('\n✅ Tutti i test completati con successo!');
      
    } catch (error) {
      console.error('\n❌ Errore durante i test:', error);
      process.exit(1);
    }
  }

  /**
   * Test 1: Inizializzazione del sistema
   */
  async testInitialization() {
    console.log('📋 Test 1: Inizializzazione sistema...');
    
    try {
      await this.scheduler.initialize();
      
      const status = this.scheduler.getSchedulerStatus();
      console.log(`   ✅ Scheduler inizializzato: ${status.activeJobs} job attivi`);
      
      // Verifica che tutti i job siano attivi
      for (const [name, job] of status.jobDetails) {
        if (job.scheduled) {
          console.log(`   ✅ Job ${name}: ATTIVO`);
        } else {
          console.log(`   ⚠️ Job ${name}: INATTIVO`);
        }
      }
      
    } catch (error) {
      throw new Error(`Inizializzazione fallita: ${error.message}`);
    }
  }

  /**
   * Test 2: Simulazione manuale
   */
  async testManualSimulation() {
    console.log('📋 Test 2: Simulazione manuale...');
    
    try {
      const result = await this.scheduler.runManualSimulation();
      
      console.log(`   ✅ Simulazione completata:`);
      console.log(`      - Asset simulati: ${result.marketSimulations}`);
      console.log(`      - Transazioni: ${result.userTransactions}`);
      console.log(`      - Eventi: ${result.marketEvents}`);
      
      if (result.dailySummary) {
        console.log(`      - Saldo totale: €${result.dailySummary.totalBalance}`);
        console.log(`      - Performance mercato: ${result.dailySummary.marketPerformance}%`);
      }
      
    } catch (error) {
      throw new Error(`Simulazione manuale fallita: ${error.message}`);
    }
  }

  /**
   * Test 3: Simulazioni storiche
   */
  async testHistoricalSimulations() {
    console.log('📋 Test 3: Simulazioni storiche...');
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 3); // Ultimi 3 giorni
      
      console.log(`   📅 Generazione simulazioni dal ${startDate.toISOString().split('T')[0]} al ${endDate.toISOString().split('T')[0]}...`);
      
      const results = await this.scheduler.runHistoricalSimulations(startDate, endDate);
      
      console.log(`   ✅ Simulazioni storiche completate: ${results.length} nuove simulazioni`);
      
      if (results.length > 0) {
        const totalTransactions = results.reduce((sum, r) => sum + r.userTransactions, 0);
        const totalAssets = results.reduce((sum, r) => sum + r.marketSimulations, 0);
        console.log(`      - Transazioni totali: ${totalTransactions}`);
        console.log(`      - Asset simulati: ${totalAssets}`);
      }
      
    } catch (error) {
      throw new Error(`Simulazioni storiche fallite: ${error.message}`);
    }
  }

  /**
   * Test 4: Performance asset
   */
  async testAssetPerformance() {
    console.log('📋 Test 4: Performance asset...');
    
    try {
      const assets = ['AAPL', 'BTC', 'SPY'];
      
      for (const symbol of assets) {
        const performance = await this.simulationService.getAssetPerformance(symbol, 7);
        
        if (performance.length > 0) {
          const latest = performance[performance.length - 1];
          const variation = parseFloat(latest.variation);
          const trend = variation > 0 ? '📈' : variation < 0 ? '📉' : '➡️';
          
          console.log(`   ${trend} ${symbol}: ${variation > 0 ? '+' : ''}${variation.toFixed(2)}% (${performance.length} giorni)`);
        } else {
          console.log(`   ⚠️ ${symbol}: Nessun dato disponibile`);
        }
      }
      
    } catch (error) {
      throw new Error(`Test performance asset fallito: ${error.message}`);
    }
  }

  /**
   * Test 5: Transazioni utente
   */
  async testUserTransactions() {
    console.log('📋 Test 5: Transazioni utente...');
    
    try {
      const users = ['user-001', 'user-002', 'user-003'];
      
      for (const userId of users) {
        const transactions = await this.simulationService.getUserTransactions(userId, new Date(), new Date(), 5);
        
        if (transactions.length > 0) {
          const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
          const incomeCount = transactions.filter(t => t.type === 'INCOME').length;
          const expenseCount = transactions.filter(t => t.type === 'EXPENSE').length;
          
          console.log(`   👤 ${userId}: ${transactions.length} transazioni (€${totalAmount.toFixed(2)})`);
          console.log(`      - Entrate: ${incomeCount}, Uscite: ${expenseCount}`);
        } else {
          console.log(`   ⚠️ ${userId}: Nessuna transazione disponibile`);
        }
      }
      
    } catch (error) {
      throw new Error(`Test transazioni utente fallito: ${error.message}`);
    }
  }

  /**
   * Test 6: Eventi di mercato
   */
  async testMarketEvents() {
    console.log('📋 Test 6: Eventi di mercato...');
    
    try {
      const events = await this.simulationService.getActiveEvents();
      
      if (events.length > 0) {
        console.log(`   🎲 Eventi attivi: ${events.length}`);
        
        events.slice(0, 3).forEach(event => {
          const impact = parseFloat(event.impact);
          const severity = event.severity;
          const icon = severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '⚠️' : severity === 'MEDIUM' ? '📊' : 'ℹ️';
          
          console.log(`      ${icon} ${event.title}: ${impact > 0 ? '+' : ''}${impact.toFixed(2)}% (${event.severity})`);
        });
        
        if (events.length > 3) {
          console.log(`      ... e altri ${events.length - 3} eventi`);
        }
      } else {
        console.log('   ℹ️ Nessun evento di mercato attivo');
      }
      
    } catch (error) {
      throw new Error(`Test eventi di mercato fallito: ${error.message}`);
    }
  }

  /**
   * Test 7: Report e statistiche
   */
  async testReports() {
    console.log('📋 Test 7: Report e statistiche...');
    
    try {
      // Statistiche recenti
      const stats = await this.simulationService.getSimulationStats(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Ultimi 7 giorni
        new Date()
      );
      
      if (stats.length > 0) {
        const avgPerformance = stats.reduce((sum, s) => sum + parseFloat(s.marketPerformance), 0) / stats.length;
        const totalBalance = stats[stats.length - 1].totalBalance;
        
        console.log(`   📊 Statistiche ultimi 7 giorni:`);
        console.log(`      - Performance media: ${avgPerformance.toFixed(2)}%`);
        console.log(`      - Saldo totale: €${totalBalance}`);
        console.log(`      - Giorni simulati: ${stats.length}`);
      }
      
      // Report mensile
      const monthlyReport = await this.generateMonthlyReport();
      if (monthlyReport) {
        console.log(`   📅 Report mensile: ${monthlyReport.period}`);
        console.log(`      - Performance media: ${monthlyReport.averageMarketPerformance}%`);
        console.log(`      - Transazioni totali: ${monthlyReport.totalTransactions}`);
      }
      
    } catch (error) {
      throw new Error(`Test report fallito: ${error.message}`);
    }
  }

  /**
   * Test 8: Dashboard
   */
  async testDashboard() {
    console.log('📋 Test 8: Dashboard...');
    
    try {
      // Simula chiamata API dashboard
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const recentStats = await this.simulationService.getSimulationStats(startDate, endDate);
      const activeEvents = await this.simulationService.getActiveEvents();
      
      if (recentStats.length > 0) {
        const totalBalance = recentStats[recentStats.length - 1].totalBalance;
        const avgMarketPerformance = recentStats.reduce((sum, stat) => sum + parseFloat(stat.marketPerformance), 0) / recentStats.length;
        const totalTransactions = recentStats.reduce((sum, stat) => sum + stat.totalTransactions, 0);
        
        console.log(`   🎛️ Dashboard dati:`);
        console.log(`      - Saldo corrente: €${totalBalance}`);
        console.log(`      - Performance media: ${avgMarketPerformance.toFixed(2)}%`);
        console.log(`      - Transazioni totali: ${totalTransactions}`);
        console.log(`      - Eventi attivi: ${activeEvents.length}`);
      }
      
    } catch (error) {
      throw new Error(`Test dashboard fallito: ${error.message}`);
    }
  }

  /**
   * Genera report mensile di test
   */
  async generateMonthlyReport() {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const monthlyStats = await this.simulationService.getSimulationStats(startOfMonth, endOfMonth);
      
      if (monthlyStats.length === 0) return null;
      
      const totalBalance = monthlyStats.reduce((sum, stat) => sum + parseFloat(stat.totalBalance), 0);
      const avgMarketPerformance = monthlyStats.reduce((sum, stat) => sum + parseFloat(stat.marketPerformance), 0) / monthlyStats.length;
      const totalTransactions = monthlyStats.reduce((sum, stat) => sum + stat.totalTransactions, 0);
      
      return {
        period: `${startOfMonth.toISOString().split('T')[0]} - ${endOfMonth.toISOString().split('T')[0]}`,
        totalBalance: totalBalance.toFixed(2),
        averageMarketPerformance: avgMarketPerformance.toFixed(2),
        totalTransactions,
        daysSimulated: monthlyStats.length
      };
      
    } catch (error) {
      return null;
    }
  }

  /**
   * Pulisce e arresta il sistema
   */
  async cleanup() {
    console.log('\n🧹 Pulizia sistema...');
    
    try {
      this.scheduler.stopAllJobs();
      console.log('   ✅ Scheduler arrestato');
    } catch (error) {
      console.log(`   ⚠️ Errore durante l'arresto: ${error.message}`);
    }
  }
}

// Esecuzione principale
async function main() {
  const tester = new SimulationTester();
  
  try {
    await tester.runAllTests();
  } finally {
    await tester.cleanup();
  }
}

// Esegui se chiamato direttamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Errore fatale:', error);
    process.exit(1);
  });
}

module.exports = SimulationTester;
