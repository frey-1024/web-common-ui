// module.exports = {
//   // 达到错误条数，终止执行
//   bail: 2,
//   // 允许mock数据
//   automock: true,
//   // 在每次运行test时，清除mock
//   clearMocks: true,
//   collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**', '!**/examples/**'],
//   setupFiles: ['./tests/setup.js'],
//   snapshotSerializers: [require.resolve('enzyme-to-json/serializer')]
// };

const libDir = process.env.LIB_DIR;

module.exports = {
  preset: 'ts-jest',
  verbose: true,
  setupFiles: ['./tests/setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  // modulePathIgnorePatterns: ['/_site/'],
  // moduleNameMapper: {
  //   '^dnd-core$': 'dnd-core/dist/cjs',
  //   '^react-dnd$': 'react-dnd/dist/cjs',
  //   '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
  //   '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
  //   '^react-dnd-tests-backend$': 'react-dnd-tests-backend/dist/cjs',
  //   '^react-dnd-tests-utils$': 'react-dnd-tests-utils/dist/cjs'
  // },
  // testPathIgnorePatterns: ['/node_modules/', 'node'],
  // transform: {
  //   '\\.tsx?$': './node_modules/@ant-design/tools/lib/jest/codePreprocessor',
  //   '\\.js$': './node_modules/@ant-design/tools/lib/jest/codePreprocessor',
  //   '\\.md$': './node_modules/@ant-design/tools/lib/jest/demoPreprocessor',
  //   '\\.(jpg|png|gif|svg)$': './node_modules/@ant-design/tools/lib/jest/imagePreprocessor'
  // },
  testMatch: [
    '<rootDir>/tests/*.{spec,test}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/*/style/index.tsx',
    '!src/*/__tests__/type.tests.tsx',
    '!src/**/*/interface.{ts,tsx}'
  ],
  transform: {
    // 将.js后缀的文件使用babel-jest处理
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  // 不忽略 lodash-es, other-es-lib 这些es库, 从而使babel-jest去处理它们
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash-es|other-es-lib))'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json'
    }
  },
  testURL: 'http://localhost'
};
