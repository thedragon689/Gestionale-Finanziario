const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DailySimulation = sequelize.define('DailySimulation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true,
    comment: 'Data della simulazione giornaliera'
  },
  totalUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Numero totale di utenti simulati'
  },
  totalAccounts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Numero totale di conti correnti'
  },
  totalAssets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Numero totale di asset simulati'
  },
  totalTransactions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Numero totale di transazioni simulate'
  },
  totalEvents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Numero totale di eventi simulati'
  },
  totalBalance: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Saldo totale aggregato di tutti i conti'
  },
  totalBalanceChange: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Variazione totale del saldo rispetto al giorno precedente'
  },
  totalBalanceChangePercent: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Variazione percentuale del saldo totale'
  },
  marketPerformance: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Performance media del mercato (variazione % media degli asset)'
  },
  bestPerformingAsset: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Asset con la migliore performance del giorno'
  },
  worstPerformingAsset: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Asset con la peggiore performance del giorno'
  },
  bestPerformingUser: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID dell\'utente con la migliore performance del giorno'
  },
  worstPerformingUser: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID dell\'utente con la peggiore performance del giorno'
  },
  totalIncome: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Totale entrate simulate del giorno'
  },
  totalExpenses: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Totale uscite simulate del giorno'
  },
  totalInvestments: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Totale investimenti simulati del giorno'
  },
  totalDividends: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Totale dividendi simulati del giorno'
  },
  totalFees: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Totale commissioni e tasse simulate del giorno'
  },
  marketVolatility: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: true,
    comment: 'Volatilità media del mercato del giorno'
  },
  activeEvents: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array degli eventi attivi del giorno'
  },
  alerts: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array degli alert generati (es. utenti con saldo negativo, asset in crisi)'
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Riepilogo testuale della giornata di simulazione'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Metadati aggiuntivi (es. statistiche dettagliate, trend)'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'daily_simulations',
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['totalBalanceChangePercent']
    },
    {
      fields: ['marketPerformance']
    },
    {
      fields: ['totalBalance']
    }
  ]
});

module.exports = DailySimulation;
