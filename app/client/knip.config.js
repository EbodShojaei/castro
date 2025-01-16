export default {
  ignore: [
    'src/app/middleware.ts', // Explicitly ignore middleware file
  ],
  dependencies: {
    include: [
      'eslint-config-next', // Explicitly mark eslint-config-next as a dependency
    ],
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.data',
    '.next/', // Ignore Next.js build files
  ],
  moduleResolution: 'node',
};
