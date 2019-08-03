import { paths } from './utils';

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  rootDir: paths.app(),
  testEnvironment: 'jsdom',
};
