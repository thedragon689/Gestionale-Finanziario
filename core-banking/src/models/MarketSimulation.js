const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MarketSimulation = sequelize.define('MarketSimulation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Data della simulazione'
  },
  asset: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nome dell\'asset (es. AAPL, BTC, ETF_SP500)'
  },
  assetType: {
    type: DataTypes.ENUM('STOCK', 'ETF', 'CRYPTO', 'FUND', 'BOND', 'COMMODITY'),
    allowNull: false,
    comment: 'Tipo di asset finanziario'
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Simbolo dell\'asset'
  },
  initialValue: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    comment: 'Valore iniziale dell\'asset'
  },
  finalValue: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    comment: 'Valore finale dell\'asset'
  },
  variation: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    comment: 'Variazione percentuale'
  },
  absoluteVariation: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
    comment: 'Variazione assoluta in valore'
  },
  volume: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
    comment: 'Volume di scambio simulato'
  },
  marketCap: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: true,
    comment: 'Capitalizzazione di mercato'
  },
  volatility: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: true,
    comment: 'Volatilità dell\'asset'
  },
  sector: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Settore di appartenenza'
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Paese di origine'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Metadati aggiuntivi (es. indici di rischio, rating)'
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
  tableName: 'market_simulations',
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['asset']
    },
    {
      fields: ['assetType']
    },
    {
      fields: ['symbol']
    },
    {
      fields: ['date', 'asset']
    }
  ]
});

module.exports = MarketSimulation;
