const path = require('path');
const fs = require('fs');
const del = require('del');
const sync = require('child_process').execSync;

const paths = {
  app: (...p) => path.join(process.cwd(), ...p),
  bin: (...p) => path.join(process.cwd(), 'node_modules', '.bin', ...p),
  cli: (...p) => path.join(__dirname, ...p),
};

const run = (command, options) =>
  sync(command, { stdio: 'inherit', ...options });

const clean = dir => del.sync([paths.app(dir)]);

const exists = (file, fallback) => (fs.existsSync(file) ? file : fallback);

module.exports = {
  paths,
  run,
  clean,
  exists,
};
