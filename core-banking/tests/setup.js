// Setup globale per i test
require('dotenv').config({ path: '.env.test' });

// Mock delle variabili d'ambiente per i test
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'gestionale_finanziario_test';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.REDIS_URL = 'redis://localhost:6379';

// Mock del logger per i test
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

// Mock di console per i test
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Timeout globale per i test
jest.setTimeout(30000);

// Setup prima di tutti i test
beforeAll(async () => {
  console.log('🚀 Setup ambiente di test...');
});

// Cleanup dopo tutti i test
afterAll(async () => {
  console.log('🧹 Cleanup ambiente di test...');
});

// Setup prima di ogni test
beforeEach(() => {
  // Reset di tutti i mock
  jest.clearAllMocks();
});

// Cleanup dopo ogni test
afterEach(() => {
  // Cleanup specifico se necessario
});
