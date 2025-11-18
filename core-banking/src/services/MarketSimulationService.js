const { 
  MarketSimulation, 
  SimulatedTransaction, 
  SimulatedEvent, 
  DailySimulation,
  Account,
  Transaction 
} = require('../models');
const { logger } = require('../utils/logger');

class MarketSimulationService {
  constructor() {
    this.assets = this.initializeAssets();
    this.users = this.initializeUsers();
    this.events = this.initializeEvents();
    this.isRunning = false;
  }

  /**
   * Inizializza gli asset finanziari da simulare
   */
  initializeAssets() {
    return [
      // Azioni USA
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'STOCK', initialValue: 150.00, sector: 'Technology', country: 'USA', volatility: 0.25 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'STOCK', initialValue: 300.00, sector: 'Technology', country: 'USA', volatility: 0.22 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'STOCK', initialValue: 120.00, sector: 'Technology', country: 'USA', volatility: 0.28 },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'STOCK', initialValue: 200.00, sector: 'Automotive', country: 'USA', volatility: 0.45 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'STOCK', initialValue: 130.00, sector: 'E-commerce', country: 'USA', volatility: 0.30 },
      
      // Azioni Europee
      { symbol: 'ASML', name: 'ASML Holding', type: 'STOCK', initialValue: 600.00, sector: 'Technology', country: 'Netherlands', volatility: 0.35 },
      { symbol: 'NOVO', name: 'Novo Nordisk', type: 'STOCK', initialValue: 400.00, sector: 'Healthcare', country: 'Denmark', volatility: 0.20 },
      { symbol: 'NESN', name: 'Nestlé SA', type: 'STOCK', initialValue: 100.00, sector: 'Consumer Goods', country: 'Switzerland', volatility: 0.15 },
      
      // ETF
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', initialValue: 400.00, sector: 'Index', country: 'USA', volatility: 0.18 },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', initialValue: 350.00, sector: 'Technology Index', country: 'USA', volatility: 0.25 },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', initialValue: 200.00, sector: 'Total Market', country: 'USA', volatility: 0.20 },
      
      // Criptovalute
      { symbol: 'BTC', name: 'Bitcoin', type: 'CRYPTO', initialValue: 45000.00, sector: 'Cryptocurrency', country: 'Global', volatility: 0.80 },
      { symbol: 'ETH', name: 'Ethereum', type: 'CRYPTO', initialValue: 2500.00, sector: 'Cryptocurrency', country: 'Global', volatility: 0.75 },
      { symbol: 'ADA', name: 'Cardano', type: 'CRYPTO', initialValue: 0.50, sector: 'Cryptocurrency', country: 'Global', volatility: 0.90 },
      
      // Fondi
      { symbol: 'FIDELITY', name: 'Fidelity Growth Fund', type: 'FUND', initialValue: 25.00, sector: 'Growth Fund', country: 'USA', volatility: 0.22 },
      { symbol: 'VANGUARD', name: 'Vanguard 500 Index Fund', type: 'FUND', initialValue: 350.00, sector: 'Index Fund', country: 'USA', volatility: 0.18 },
      
      // Obbligazioni
      { symbol: 'BOND_US', name: 'US Treasury Bond', type: 'BOND', initialValue: 100.00, sector: 'Government Bond', country: 'USA', volatility: 0.08 },
      { symbol: 'BOND_EU', name: 'European Government Bond', type: 'BOND', initialValue: 100.00, sector: 'Government Bond', country: 'EU', volatility: 0.10 }
    ];
  }

  /**
   * Inizializza gli utenti simulati
   */
  initializeUsers() {
    return [
      { id: 'user-001', name: 'Mario Rossi', initialBalance: 50000, riskProfile: 'CONSERVATIVE' },
      { id: 'user-002', name: 'Giulia Bianchi', initialBalance: 75000, riskProfile: 'MODERATE' },
      { id: 'user-003', name: 'Luca Verdi', initialBalance: 120000, riskProfile: 'AGGRESSIVE' },
      { id: 'user-004', name: 'Anna Neri', initialBalance: 30000, riskProfile: 'CONSERVATIVE' },
      { id: 'user-005', name: 'Marco Gialli', initialBalance: 90000, riskProfile: 'MODERATE' }
    ];
  }

  /**
   * Inizializza gli eventi di mercato possibili
   */
  initializeEvents() {
    return [
      {
        type: 'MARKET_CRASH',
        title: 'Crisi di Mercato Globale',
        description: 'Forti vendite su tutti i mercati finanziari',
        severity: 'CRITICAL',
        scope: 'GLOBAL',
        impact: -15.0,
        probability: 0.05
      },
      {
        type: 'MARKET_BOOM',
        title: 'Boom di Mercato',
        description: 'Forte crescita su tutti i mercati finanziari',
        severity: 'HIGH',
        scope: 'GLOBAL',
        impact: 12.0,
        probability: 0.08
      },
      {
        type: 'SECTOR_CRASH',
        title: 'Crisi Settoriale',
        description: 'Crisi specifica in un settore industriale',
        severity: 'HIGH',
        scope: 'SECTORAL',
        impact: -25.0,
        probability: 0.15
      },
      {
        type: 'INTEREST_RATE_CHANGE',
        title: 'Variazione Tassi di Interesse',
        description: 'Cambiamento nei tassi di interesse centrali',
        severity: 'MEDIUM',
        scope: 'GLOBAL',
        impact: -5.0,
        probability: 0.20
      },
      {
        type: 'TECHNOLOGY_BREAKTHROUGH',
        title: 'Breakthrough Tecnologico',
        description: 'Innovazione tecnologica che rivoluziona il mercato',
        severity: 'HIGH',
        scope: 'SECTORAL',
        impact: 20.0,
        probability: 0.10
      },
      {
        type: 'BONUS_PAYMENT',
        title: 'Pagamento Bonus',
        description: 'Bonus aziendali per i dipendenti',
        severity: 'LOW',
        scope: 'INDIVIDUAL',
        impact: 8.0,
        probability: 0.30
      },
      {
        type: 'TAX_CHANGE',
        title: 'Variazione Fiscale',
        description: 'Cambiamento nelle politiche fiscali',
        severity: 'MEDIUM',
        scope: 'NATIONAL',
        impact: -3.0,
        probability: 0.25
      }
    ];
  }

  /**
   * Genera una variazione realistica per un asset
   */
  generateAssetVariation(asset, baseVolatility = null) {
    const volatility = baseVolatility || asset.volatility;
    
    // Simula una distribuzione normale per le variazioni
    let variation = 0;
    for (let i = 0; i < 12; i++) {
      variation += (Math.random() - 0.5) * 2;
    }
    variation = variation / 12 * volatility * 100;
    
    // Limita la variazione massima
    variation = Math.max(-50, Math.min(50, variation));
    
    return variation;
  }

  /**
   * Genera transazioni simulate per un utente
   */
  generateUserTransactions(user, date) {
    const transactions = [];
    const baseBalance = user.currentBalance || user.initialBalance;
    
    // Stipendio mensile (primo del mese)
    if (date.getDate() === 1) {
      const salary = 2500 + Math.random() * 1000;
      transactions.push({
        date,
        userId: user.id,
        accountId: `account-${user.id}`,
        type: 'INCOME',
        category: 'Salary',
        subcategory: 'Monthly Salary',
        amount: salary,
        currency: 'EUR',
        description: `Stipendio mensile - ${user.name}`,
        balanceBefore: baseBalance,
        balanceAfter: baseBalance + salary,
        counterparty: 'Azienda S.p.A.',
        reference: `SAL-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      });
    }
    
    // Spese ricorrenti
    const expenses = [
      { category: 'Housing', amount: -800, description: 'Affitto mensile' },
      { category: 'Utilities', amount: -150, description: 'Bollette luce, gas, acqua' },
      { category: 'Food', amount: -400, description: 'Spesa alimentare' },
      { category: 'Transport', amount: -200, description: 'Trasporti pubblici e carburante' },
      { category: 'Entertainment', amount: -100, description: 'Intrattenimento e svago' }
    ];
    
    expenses.forEach(expense => {
      if (Math.random() < 0.8) { // 80% probabilità di spesa
        const amount = expense.amount * (0.8 + Math.random() * 0.4); // ±20% variazione
        const balanceBefore = transactions.length > 0 ? 
          transactions[transactions.length - 1].balanceAfter : baseBalance;
        
        transactions.push({
          date,
          userId: user.id,
          accountId: `account-${user.id}`,
          type: 'EXPENSE',
          category: expense.category,
          amount: amount,
          currency: 'EUR',
          description: expense.description,
          balanceBefore,
          balanceAfter: balanceBefore + amount,
          isRecurring: true,
          recurringFrequency: 'MONTHLY'
        });
      }
    });
    
    // Eventi casuali
    if (Math.random() < 0.15) { // 15% probabilità di evento casuale
      const eventTypes = ['INCOME', 'EXPENSE', 'INVESTMENT', 'DIVIDEND'];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      let amount, description, category;
      switch (eventType) {
        case 'INCOME':
          amount = 100 + Math.random() * 500;
          description = 'Bonus occasionale';
          category = 'Bonus';
          break;
        case 'EXPENSE':
          amount = -(50 + Math.random() * 200);
          description = 'Spesa imprevista';
          category = 'Unexpected';
          break;
        case 'INVESTMENT':
          amount = -(200 + Math.random() * 800);
          description = 'Investimento in titoli';
          category = 'Investment';
          break;
        case 'DIVIDEND':
          amount = 20 + Math.random() * 100;
          description = 'Dividendo da investimenti';
          category = 'Dividend';
          break;
      }
      
      const balanceBefore = transactions.length > 0 ? 
        transactions[transactions.length - 1].balanceAfter : baseBalance;
      
      transactions.push({
        date,
        userId: user.id,
        accountId: `account-${user.id}`,
        type: eventType,
        category,
        amount,
        currency: 'EUR',
        description,
        balanceBefore,
        balanceAfter: balanceBefore + amount
      });
    }
    
    return transactions;
  }

  /**
   * Genera eventi di mercato casuali
   */
  generateMarketEvents(date) {
    const events = [];
    
    this.events.forEach(eventTemplate => {
      if (Math.random() < eventTemplate.probability) {
        const actualImpact = eventTemplate.impact * (0.7 + Math.random() * 0.6); // ±30% variazione
        
        events.push({
          date,
          type: eventTemplate.type,
          severity: eventTemplate.severity,
          scope: eventTemplate.scope,
          title: eventTemplate.title,
          description: eventTemplate.description,
          impact: actualImpact,
          absoluteImpact: Math.abs(actualImpact),
          source: this.getRandomSource(),
          probability: eventTemplate.probability,
          isActive: true,
          duration: Math.floor(Math.random() * 7) + 1 // 1-7 giorni
        });
      }
    });
    
    return events;
  }

  /**
   * Ottiene una fonte casuale per gli eventi
   */
  getRandomSource() {
    const sources = ['BCE', 'FED', 'Governo Italiano', 'Commissione Europea', 'Banca d\'Italia', 'Wall Street'];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  /**
   * Esegue la simulazione giornaliera completa
   */
  async runDailySimulation(date = new Date()) {
    if (this.isRunning) {
      logger.warn('Simulazione già in corso');
      return;
    }

    this.isRunning = true;
    const simulationDate = new Date(date);
    simulationDate.setHours(0, 0, 0, 0);
    
    try {
      logger.info(`Avvio simulazione giornaliera per ${simulationDate.toISOString().split('T')[0]}`);
      
      // 1. Simula variazioni degli asset di mercato
      const marketSimulations = await this.simulateMarketMovements(simulationDate);
      
      // 2. Genera eventi di mercato
      const marketEvents = await this.simulateMarketEvents(simulationDate);
      
      // 3. Simula transazioni per ogni utente
      const userTransactions = await this.simulateUserTransactions(simulationDate);
      
      // 4. Calcola performance e saldi
      const dailySummary = await this.calculateDailySummary(simulationDate, {
        marketSimulations,
        marketEvents,
        userTransactions
      });
      
      // 5. Genera report e alert
      await this.generateDailyReport(dailySummary);
      
      logger.info(`Simulazione giornaliera completata per ${simulationDate.toISOString().split('T')[0]}`);
      
      return {
        date: simulationDate,
        marketSimulations: marketSimulations.length,
        marketEvents: marketEvents.length,
        userTransactions: userTransactions.length,
        dailySummary
      };
      
    } catch (error) {
      logger.error('Errore durante la simulazione giornaliera:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Simula i movimenti del mercato
   */
  async simulateMarketMovements(date) {
    const simulations = [];
    
    for (const asset of this.assets) {
      const variation = this.generateAssetVariation(asset);
      const initialValue = parseFloat(asset.initialValue);
      const finalValue = initialValue * (1 + variation / 100);
      const absoluteVariation = finalValue - initialValue;
      
      // Aggiorna il valore iniziale per il prossimo giorno
      asset.initialValue = finalValue;
      
      const simulation = await MarketSimulation.create({
        date,
        asset: asset.name,
        assetType: asset.type,
        symbol: asset.symbol,
        initialValue,
        finalValue,
        variation,
        absoluteVariation,
        volume: Math.random() * 1000000,
        marketCap: finalValue * (1000000 + Math.random() * 9000000),
        volatility: asset.volatility,
        sector: asset.sector,
        country: asset.country,
        metadata: {
          previousValue: initialValue,
          marketSentiment: variation > 0 ? 'BULLISH' : 'BEARISH'
        }
      });
      
      simulations.push(simulation);
    }
    
    return simulations;
  }

  /**
   * Simula eventi di mercato
   */
  async simulateMarketEvents(date) {
    const events = this.generateMarketEvents(date);
    const createdEvents = [];
    
    for (const event of events) {
      const createdEvent = await SimulatedEvent.create(event);
      createdEvents.push(createdEvent);
    }
    
    return createdEvents;
  }

  /**
   * Simula transazioni per tutti gli utenti
   */
  async simulateUserTransactions(date) {
    const allTransactions = [];
    
    for (const user of this.users) {
      // Aggiorna il saldo corrente dell'utente
      if (!user.currentBalance) {
        user.currentBalance = user.initialBalance;
      }
      
      const transactions = this.generateUserTransactions(user, date);
      
      for (const transaction of transactions) {
        const createdTransaction = await SimulatedTransaction.create(transaction);
        allTransactions.push(createdTransaction);
        
        // Aggiorna il saldo corrente
        user.currentBalance = transaction.balanceAfter;
      }
    }
    
    return allTransactions;
  }

  /**
   * Calcola il riepilogo giornaliero
   */
  async calculateDailySummary(date, data) {
    const { marketSimulations, marketEvents, userTransactions } = data;
    
    // Calcola statistiche aggregate
    const totalBalance = this.users.reduce((sum, user) => sum + (user.currentBalance || user.initialBalance), 0);
    const previousTotalBalance = this.users.reduce((sum, user) => sum + user.initialBalance, 0);
    const totalBalanceChange = totalBalance - previousTotalBalance;
    const totalBalanceChangePercent = previousTotalBalance > 0 ? (totalBalanceChange / previousTotalBalance) * 100 : 0;
    
    const marketPerformance = marketSimulations.length > 0 ? 
      marketSimulations.reduce((sum, sim) => sum + parseFloat(sim.variation), 0) / marketSimulations.length : 0;
    
    const bestAsset = marketSimulations.reduce((best, current) => 
      parseFloat(current.variation) > parseFloat(best.variation) ? current : best, marketSimulations[0]);
    
    const worstAsset = marketSimulations.reduce((worst, current) => 
      parseFloat(current.variation) < parseFloat(worst.variation) ? current : worst, marketSimulations[0]);
    
    const totalIncome = userTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = userTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    const totalInvestments = userTransactions
      .filter(t => t.type === 'INVESTMENT')
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    const dailySummary = await DailySimulation.create({
      date,
      totalUsers: this.users.length,
      totalAccounts: this.users.length,
      totalAssets: this.assets.length,
      totalTransactions: userTransactions.length,
      totalEvents: marketEvents.length,
      totalBalance,
      totalBalanceChange,
      totalBalanceChangePercent,
      marketPerformance,
      bestPerformingAsset: bestAsset?.asset,
      worstPerformingAsset: worstAsset?.asset,
      totalIncome,
      totalExpenses,
      totalInvestments,
      marketVolatility: this.calculateAverageVolatility(),
      activeEvents: marketEvents.map(e => ({ id: e.id, type: e.type, impact: e.impact })),
      alerts: this.generateAlerts(userTransactions, marketSimulations),
      summary: this.generateSummaryText(data),
      metadata: {
        assetPerformance: marketSimulations.map(s => ({
          symbol: s.symbol,
          variation: s.variation,
          finalValue: s.finalValue
        })),
        userPerformance: this.users.map(u => ({
          id: u.id,
          name: u.name,
          balanceChange: (u.currentBalance || u.initialBalance) - u.initialBalance
        }))
      }
    });
    
    return dailySummary;
  }

  /**
   * Calcola la volatilità media del mercato
   */
  calculateAverageVolatility() {
    return this.assets.reduce((sum, asset) => sum + asset.volatility, 0) / this.assets.length;
  }

  /**
   * Genera alert basati sui dati simulati
   */
  generateAlerts(transactions, marketSimulations) {
    const alerts = [];
    
    // Alert per utenti con saldo negativo
    const negativeBalances = transactions.filter(t => t.balanceAfter < 0);
    if (negativeBalances.length > 0) {
      alerts.push({
        type: 'NEGATIVE_BALANCE',
        severity: 'HIGH',
        message: `${negativeBalances.length} utenti con saldo negativo`,
        affectedUsers: negativeBalances.map(t => t.userId)
      });
    }
    
    // Alert per asset in forte perdita
    const crashingAssets = marketSimulations.filter(s => parseFloat(s.variation) < -20);
    if (crashingAssets.length > 0) {
      alerts.push({
        type: 'ASSET_CRASH',
        severity: 'MEDIUM',
        message: `${crashingAssets.length} asset in forte perdita (>20%)`,
        affectedAssets: crashingAssets.map(s => s.symbol)
      });
    }
    
    // Alert per asset in forte crescita
    const boomingAssets = marketSimulations.filter(s => parseFloat(s.variation) > 20);
    if (boomingAssets.length > 0) {
      alerts.push({
        type: 'ASSET_BOOM',
        severity: 'LOW',
        message: `${boomingAssets.length} asset in forte crescita (>20%)`,
        affectedAssets: boomingAssets.map(s => s.symbol)
      });
    }
    
    return alerts;
  }

  /**
   * Genera un riepilogo testuale della giornata
   */
  generateSummaryText(data) {
    const { marketSimulations, marketEvents, userTransactions } = data;
    
    const avgMarketVariation = marketSimulations.length > 0 ? 
      marketSimulations.reduce((sum, sim) => sum + parseFloat(sim.variation), 0) / marketSimulations.length : 0;
    
    const totalIncome = userTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = userTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    return `Simulazione del ${new Date().toLocaleDateString('it-IT')}: 
    Mercato: ${avgMarketVariation > 0 ? '+' : ''}${avgMarketVariation.toFixed(2)}% di variazione media. 
    ${marketEvents.length} eventi di mercato generati. 
    ${userTransactions.length} transazioni simulate per ${this.users.length} utenti. 
    Entrate totali: €${totalIncome.toFixed(2)}, Uscite totali: €${totalExpenses.toFixed(2)}.`;
  }

  /**
   * Genera il report giornaliero
   */
  async generateDailyReport(dailySummary) {
    logger.info('=== REPORT GIORNALIERO SIMULAZIONE ===');
    logger.info(`Data: ${dailySummary.date}`);
    logger.info(`Performance mercato: ${dailySummary.marketPerformance.toFixed(2)}%`);
    logger.info(`Variazione saldo totale: ${dailySummary.totalBalanceChangePercent.toFixed(2)}%`);
    logger.info(`Asset migliore: ${dailySummary.bestPerformingAsset}`);
    logger.info(`Asset peggiore: ${dailySummary.worstPerformingAsset}`);
    logger.info(`Eventi attivi: ${dailySummary.totalEvents}`);
    logger.info(`Alert generati: ${dailySummary.alerts.length}`);
    logger.info('=====================================');
    
    return dailySummary;
  }

  /**
   * Ottiene le statistiche delle simulazioni
   */
  async getSimulationStats(startDate, endDate) {
    const stats = await DailySimulation.findAll({
      where: {
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
    
    return stats;
  }

  /**
   * Ottiene le performance degli asset
   */
  async getAssetPerformance(symbol, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const performance = await MarketSimulation.findAll({
      where: {
        symbol,
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
    
    return performance;
  }

  /**
   * Ottiene le transazioni di un utente
   */
  async getUserTransactions(userId, startDate, endDate) {
    const transactions = await SimulatedTransaction.findAll({
      where: {
        userId,
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
    
    return transactions;
  }

  /**
   * Ottiene gli eventi di mercato attivi
   */
  async getActiveEvents() {
    const events = await SimulatedEvent.findAll({
      where: { isActive: true },
      order: [['date', 'DESC']]
    });
    
    return events;
  }
}

module.exports = MarketSimulationService;
