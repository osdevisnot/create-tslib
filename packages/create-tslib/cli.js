#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ncp = require('ncp');
const replaceStream = require('replacestream');
const sync = require('child_process').execSync;
const read = require('readline-sync');

const run = (command) => sync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
const exec = (command, options) => sync(command, { stdio: 'inherit', ...options });
const pkg = require('./package.json');

let username, email;

try {
  username = run('git config --get user.name').trim();
  email = run('git config --get user.email').trim();
} catch (e) {
  username = process.env.USER;
  email = `${process.env.USER}@gmail.com`;
}

console.log('');
username = read.question(`Enter your username : [${username}] `) || username;
email = read.question(`Enter your email : [${email}] `) || email;
console.log('');

const dest = process.argv[2];
let template = 'template-' + (process.argv[3] || 'default');

const transform = (read, write) =>
  read
    .pipe(replaceStream(template, dest))
    .pipe(replaceStream('username', username))
    .pipe(replaceStream('useremail', email))
    .pipe(replaceStream('<version>', `^${pkg.version}`))
    .pipe(write);

const localLinkCommands = ({ cwd }) => {
  console.log('Done !!');
  if (process.argv[4] === 'link') {
    exec(`npm install ${path.join(__dirname, '..', 'tslib-cli', 'osdevisnot-tslib-cli-v*.tgz')}`, { cwd });
  }
};

const moroRepoCommands = ({ cwd, monowd }) => {
  ['gitignore', 'gitattributes'].map((file) => fs.unlinkSync(path.join(monowd, file)));
  localLinkCommands({ cwd: monowd });
  exec(process.argv[4] === 'link' ? 'npm install' : 'yarn --prefer-offline', { cwd });
};

const bareRepoCommands = ({ dest, cwd }) => {
  ['gitignore', 'gitattributes'].map((file) => fs.renameSync(path.join(process.cwd(), dest, file), path.join(process.cwd(), dest, `.${file}`)));
  localLinkCommands({ cwd });
  exec('git init', { cwd });
  exec(`git config user.name ${username}`, { cwd });
  exec(`git config user.email ${email}`, { cwd });
  exec(process.argv[4] === 'link' ? 'npm install' : 'yarn --prefer-offline', { cwd });
  exec('git add .', { cwd });
  exec("git commit -am 'fist commit'", { cwd });
};

if (dest) {
  const isMonorepo = fs.existsSync(path.join(process.cwd(), 'lerna.json'));
  let cwd = isMonorepo ? path.join(process.cwd(), 'packages', dest) : path.join(process.cwd(), dest);
  ncp(path.join(__dirname, template), cwd, { transform, clobber: false }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (isMonorepo && template !== 'template-monorepo') {
      cwd = path.join(process.cwd());
      const monowd = path.join(process.cwd(), 'packages', dest);
      moroRepoCommands({ dest, cwd, monowd });
    } else bareRepoCommands({ dest, cwd });
    process.exit(0);
  });
} else {
  console.error("That did't go well. Try adding a destination parameter?");
}
