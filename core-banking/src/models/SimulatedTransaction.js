const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SimulatedTransaction = sequelize.define('SimulatedTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Data della transazione simulata'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID dell\'utente simulato'
  },
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'ID del conto corrente'
  },
  type: {
    type: DataTypes.ENUM(
      'INCOME',           // Entrate (stipendio, bonus, interessi)
      'EXPENSE',          // Uscite (spese, prelievi)
      'TRANSFER',         // Bonifici, trasferimenti
      'INVESTMENT',       // Investimenti, acquisti titoli
      'DIVIDEND',         // Dividendi
      'FEE',              // Commissioni, tasse
      'LOAN_PAYMENT',     // Pagamenti prestiti
      'REFUND',           // Rimborsi
      'MARKET_CRASH',     // Perdite per crisi di mercato
      'MARKET_BOOM'       // Guadagni per boom di mercato
    ),
    allowNull: false,
    comment: 'Tipo di transazione simulata'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Categoria della transazione'
  },
  subcategory: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Sottocategoria della transazione'
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Importo della transazione (positivo per entrate, negativo per uscite)'
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'EUR',
    comment: 'Valuta della transazione'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Descrizione dettagliata della transazione'
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Se la transazione si ripete periodicamente'
  },
  recurringFrequency: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'),
    allowNull: true,
    comment: 'Frequenza di ripetizione se ricorrente'
  },
  balanceBefore: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Saldo del conto prima della transazione'
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Saldo del conto dopo la transazione'
  },
  counterparty: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Controparte della transazione (es. datore di lavoro, negozio)'
  },
  reference: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Riferimento esterno della transazione'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Metadati aggiuntivi (es. coordinate bancarie, causale)'
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
  tableName: 'simulated_transactions',
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['accountId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['date', 'userId']
    },
    {
      fields: ['userId', 'type']
    }
  ]
});

module.exports = SimulatedTransaction;
