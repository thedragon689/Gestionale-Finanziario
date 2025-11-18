// Usa l'istanza sequelize da config/database.js per evitare dipendenze circolari
const { sequelize } = require('../config/database');
const { logger } = require('../utils/logger');

// Import models esistenti
const Account = require('./Account');
const Transaction = require('./Transaction');

// Import simulation models
const MarketSimulation = require('./MarketSimulation');
const SimulatedTransaction = require('./SimulatedTransaction');
const SimulatedEvent = require('./SimulatedEvent');
const DailySimulation = require('./DailySimulation');

// Define associations solo per modelli esistenti
const defineAssociations = () => {
  try {
    // Account associations
    Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });
    Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
    
    // Transaction associations - counterparty (se esiste)
    if (Transaction.rawAttributes.counterpartyAccountId) {
      Transaction.belongsTo(Account, { foreignKey: 'counterpartyAccountId', as: 'counterpartyAccount' });
    }

    // Simulation associations
    MarketSimulation.hasMany(SimulatedTransaction, { foreignKey: 'simulationId', as: 'transactions' });
    MarketSimulation.hasMany(SimulatedEvent, { foreignKey: 'simulationId', as: 'events' });
    MarketSimulation.hasMany(DailySimulation, { foreignKey: 'simulationId', as: 'dailySimulations' });
    
    SimulatedTransaction.belongsTo(MarketSimulation, { foreignKey: 'simulationId', as: 'simulation' });
    SimulatedEvent.belongsTo(MarketSimulation, { foreignKey: 'simulationId', as: 'simulation' });
    DailySimulation.belongsTo(MarketSimulation, { foreignKey: 'simulationId', as: 'simulation' });

    logger.info('Database models associations defined successfully');
  } catch (error) {
    logger.error('Error defining associations:', error);
    // Non lanciare errore, continua comunque
  }
};

// Initialize models
const initializeModels = async () => {
  try {
    defineAssociations();
    logger.info('Database models initialized successfully');
  } catch (error) {
    logger.error('Error initializing models:', error);
    // Non lanciare errore per permettere al server di avviarsi anche senza DB
  }
};

module.exports = {
  sequelize,
  Account,
  Transaction,
  MarketSimulation,
  SimulatedTransaction,
  SimulatedEvent,
  DailySimulation,
  initializeModels
};
