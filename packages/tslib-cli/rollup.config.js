const { paths } = require('./utils');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('rollup-plugin-commonjs');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');

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
      tsconfigOverride: { include: [isDeploy ? 'public' : 'src'] },
      typescript: require('typescript'),
    }),
    commonjs(),
    isDev && serve({ contentBase: ['dist', 'public'], historyApiFallback: true, port: 1234 }),
    isDev && livereload('dist'),
    isDeploy &&
      terser({
        ecma: 6,
        mangle: {
          properties: { regex: new RegExp('^_') },
        },
      }),
    !isDev && filesize(),
  ].filter(Boolean),
});

module.exports = (bundles) => bundles.map((option) => config(option));
