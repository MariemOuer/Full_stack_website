// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
