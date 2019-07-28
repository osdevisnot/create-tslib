#!/usr/bin/env node

const { paths, run } = require('./utils');

let command;

while ((command = process.argv.pop())) {
  switch (command) {
    case 'build':
      process.env.NODE_ENV = 'production';
      run(`${paths.bin('rollup')} -c`);
      break;
    case 'start':
      process.env.NODE_ENV = 'development';
      run(`${paths.bin('rollup')} -wc`);
      break;
    case 'watch':
      process.env.NODE_ENV = 'production';
      run(`${paths.bin('rollup')} -wc`);
      break;
    case 'test':
      process.env.NODE_ENV = 'test';
      run(`${paths.bin('jest')} --watch`);
      break;
    case 'coverage':
      process.env.NODE_ENV = 'test';
      run(`${paths.bin('jest')} --coverage`);
      break;
    case 'format':
      run(`${paths.bin('prettier')} --write '{src,public,tests}/*.{ts,tsx}'`);
      break;
    case 'lint':
      run(`${paths.bin('tslint')} --fix -t codeFrame -p tsconfig.json`);
      break;
    case 'deploy':
      process.env.NODE_ENV = 'production';
      run(`${paths.bin('rollup')} -c`);
      const ncp = require('ncp');
      ncp(paths.app('public'), paths.app('dist'), { clobber: false }, (err) => {
        if (err) console.log(err);
      });
      run('surge', { cwd: paths.app('dist') });
      break;
  }
}
