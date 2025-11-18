module.exports = {
  // Ambiente di test
  testEnvironment: 'node',
  
  // Directory di test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Directory da ignorare
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/test-server.js'
  ],
  
  // Directory coverage
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // Setup file
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout test
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks
  clearMocks: true,
  
  // Restore mocks
  restoreMocks: true,
  
  // Test environment variables
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  
  // Module name mapper
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Transform
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  

};
