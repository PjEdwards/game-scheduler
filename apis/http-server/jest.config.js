// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const path = require('path');
const packageName = require('./package.json').name.split('@nrel-gds/').pop();

module.exports = {
  name: packageName,
  displayName: packageName,
  clearMocks: true,
  setupFiles: [
    path.resolve(__dirname, 'jest.setup.js')
  ],
  testEnvironment: 'node'
};
