module.exports = {
   preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', 
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
},
};