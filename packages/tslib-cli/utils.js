const path = require('path');
const sync = require('child_process').execSync;

const paths = {
  app: (...p) => path.join(process.cwd(), ...p),
  bin: (...p) => path.join(process.cwd(), 'node_modules', '.bin', ...p),
  cli: (...p) => path.join(__dirname, ...p),
};

const run = (command, options) => sync(command, { stdio: 'inherit', ...options });

module.exports = {
  paths,
  run,
};
