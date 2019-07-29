#!/usr/bin/env node

const { paths, run, clean } = require('./utils');

let command;

const build = (flags) => run(`${paths.bin('rollup')} ${flags} ${paths.cli('rollup.config.js')}`);

while ((command = process.argv.pop())) {
  switch (command) {
    case 'build':
      process.env.NODE_ENV = 'production';
      clean('dist');
      build('-c');
      break;
    case 'start':
      process.env.NODE_ENV = 'development';
      build('-wc');
      break;
    case 'watch':
      process.env.NODE_ENV = 'production';
      build('-wc');
      break;
    case 'test':
      process.env.NODE_ENV = 'test';
      run(`${paths.bin('jest')} --preset="ts-jest" --testEnvironment="jsdom" --watch`);
      break;
    case 'coverage':
      clean('coverage');
      process.env.NODE_ENV = 'test';
      run(`${paths.bin('jest')} --preset="ts-jest" --testEnvironment="jsdom" --coverage`);
      break;
    case 'format':
      run(`${paths.bin('prettier')} --write '{src,public,tests}/*.{ts,tsx}'`);
      break;
    case 'lint':
      run(`${paths.bin('tslint')} --fix -t codeFrame -p tsconfig.json -c ${paths.cli('tslint.json')}`);
      break;
    case 'deploy':
      clean('dist');
      process.env.NODE_ENV = 'production';
      build('-c');
      const ncp = require('ncp');
      ncp(paths.app('public'), paths.app('dist'), { clobber: false }, (err) => {
        if (err) console.log(err);
      });
      run('surge', { cwd: paths.app('dist') });
      break;
  }
}
