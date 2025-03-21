module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/'
    ],
    transform: {
      '^.+\\.js$': 'babel-jest'
    }
  };
  