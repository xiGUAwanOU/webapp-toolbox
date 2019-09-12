module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  setupFiles: ['./test/setup.js'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: [
    '**/test/**/*.spec.ts'
  ],
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/node_modules/**"
  ],
  testEnvironment: 'node'
}
