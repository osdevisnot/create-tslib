const { paths } = require('./utils');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');
const replace = require('rollup-plugin-replace');

const isDev = !!process.env.ROLLUP_WATCH;
const isDeploy = !!process.env.ROLLUP_DEPLOY;

const pkg = require(paths.app('package.json'));

let external = Object.keys({
  ...(pkg.devDependencies || {}),
  ...(pkg.peerDependencies || {}),
});

const config = (options) => ({
  input: options.input,
  output: options.output,
  external: options.external || external,
  plugins: [
    ...(options.plugins || []),
    json(),
    nodeResolve({
      mainFields: ['module', 'main'],
    }),
    typescript({
      tsconfigOverride: { include: [isDeploy ? 'public' : 'src'], compilerOptions: { declaration: !isDev && !isDeploy } },
      typescript: require('typescript'),
    }),
    commonjs(),
    options.replace && replace({ 'process.env.NODE_ENV': isDev ? JSON.stringify('development') : JSON.stringify('production') }),
    isDev && serve({ contentBase: ['dist', 'public'], historyApiFallback: true, port: 1234 }),
    isDev && livereload('dist'),
    (isDeploy || options.minify) &&
      terser({
        ecma: 6,
        mangle: {
          properties: { regex: new RegExp('^_') },
        },
      }),
    !isDev && filesize(),
  ].filter(Boolean),
});

const bundles = isDev
  ? [{ input: 'public/index.tsx', output: { file: pkg.module, format: 'es' } }]
  : [
      { input: pkg.source, output: { file: pkg.browser, format: 'es' }, minify: true, replace: true },
      { input: pkg.source, output: { file: pkg.module, format: 'es' } },
      { input: pkg.source, output: { file: pkg.main, format: 'cjs' } },
    ];

module.exports = bundles.map((option) => config(option));
