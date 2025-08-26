const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const SimulatedEvent = sequelize.define('SimulatedEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Data dell\'evento simulato'
  },
  type: {
    type: DataTypes.ENUM(
      'MARKET_CRASH',         // Crisi di mercato globale
      'MARKET_BOOM',          // Boom di mercato
      'SECTOR_CRASH',         // Crisi settoriale
      'SECTOR_BOOM',          // Boom settoriale
      'ECONOMIC_RECESSION',   // Recessione economica
      'ECONOMIC_GROWTH',      // Crescita economica
      'INTEREST_RATE_CHANGE', // Variazione tassi di interesse
      'INFLATION_SPIKE',      // Picco inflazionistico
      'DEFLATION',            // Deflazione
      'CURRENCY_CRASH',       // Crollo valuta
      'CURRENCY_BOOM',        // Forte apprezzamento valuta
      'REGULATORY_CHANGE',    // Cambiamento normativo
      'POLITICAL_CRISIS',     // Crisi politica
      'NATURAL_DISASTER',     // Disastro naturale
      'TECHNOLOGY_BREAKTHROUGH', // Breakthrough tecnologico
      'CORPORATE_SCANDAL',    // Scandalo aziendale
      'MERGER_ACQUISITION',   // Fusione/acquisizione
      'IPO_SUCCESS',          // IPO di successo
      'BANKRUPTCY',           // Fallimento aziendale
      'BONUS_PAYMENT',        // Pagamento bonus
      'TAX_CHANGE',           // Variazione fiscale
      'SUBSIDY',              // Sussidio governativo
      'PENALTY'               // Penalità/sanzione
    ),
    allowNull: false,
    comment: 'Tipo di evento simulato'
  },
  severity: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    allowNull: false,
    comment: 'Gravità dell\'evento'
  },
  scope: {
    type: DataTypes.ENUM('GLOBAL', 'REGIONAL', 'NATIONAL', 'SECTORAL', 'INDIVIDUAL'),
    allowNull: false,
    comment: 'Portata dell\'evento'
  },
  affectedAssets: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array di asset influenzati dall\'evento'
  },
  affectedUsers: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array di utenti influenzati dall\'evento'
  },
  impact: {
    type: DataTypes.DECIMAL(8, 4),
    allowNull: false,
    comment: 'Impatto percentuale dell\'evento (-100 a +100)'
  },
  absoluteImpact: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Impatto assoluto in valore monetario'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durata dell\'evento in giorni'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Descrizione dettagliata dell\'evento'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Titolo sintetico dell\'evento'
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Fonte dell\'evento (es. BCE, FED, governo)'
  },
  probability: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: true,
    comment: 'Probabilità di occorrenza dell\'evento (0-1)'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Metadati aggiuntivi (es. coordinate geografiche, settori specifici)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Se l\'evento è ancora attivo'
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
  tableName: 'simulated_events',
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['type']
    },
    {
      fields: ['severity']
    },
    {
      fields: ['scope']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['date', 'type']
    },
    {
      fields: ['severity', 'scope']
    }
  ]
});

module.exports = SimulatedEvent;
