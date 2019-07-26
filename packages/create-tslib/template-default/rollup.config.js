const pkg = require('./package.json');
const bundles = require('tslib-cli');
const isDev = !!process.env.ROLLUP_WATCH;

const packs = isDev
  ? [{ input: 'public/index.tsx', output: { file: pkg.module, format: 'es' } }]
  : [{ input: pkg.source, output: { file: pkg.module, format: 'es' } }, { input: pkg.source, output: { file: pkg.main, format: 'cjs' } }];

export default bundles(packs);
