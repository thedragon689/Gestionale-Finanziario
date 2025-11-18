const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'gestionale_finanziario',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME_TEST || 'gestionale_finanziario_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Override con variabili d'ambiente se presenti
if (process.env.DB_HOST) dbConfig.host = process.env.DB_HOST;
if (process.env.DB_PORT) dbConfig.port = process.env.DB_PORT;
if (process.env.DB_USER) dbConfig.username = process.env.DB_USER;
if (process.env.DB_PASSWORD) dbConfig.password = process.env.DB_PASSWORD;
if (process.env.DB_NAME) dbConfig.database = process.env.DB_NAME;

// Configurazione Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test della connessione
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connessione al database stabilita con successo.');
    return true;
  } catch (error) {
    console.error('❌ Impossibile connettersi al database:', error);
    return false;
  }
};

// Sincronizzazione dei modelli
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Modelli del database sincronizzati.');
    return true;
  } catch (error) {
    console.error('❌ Errore nella sincronizzazione dei modelli:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  config: dbConfig,
  testConnection,
  syncModels
};
