module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: [
    '**/__tests__/**/*.{js,ts,tsx}',
    '**/?(*.)+(spec|test).{js,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
}
