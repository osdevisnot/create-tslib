#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ncp = require('ncp');
const replaceStream = require('replacestream');
const sync = require('child_process').execSync;
const read = require('readline-sync');

const run = (command) => sync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
const exec = (command, options) => sync(command, { stdio: 'inherit', ...options });

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
    .pipe(write);

if (dest) {
  const cwd = path.join(process.cwd(), dest);
  if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    template = 'template-default'; // Running inside an existing project
  }
  ncp(path.join(__dirname, template), cwd, { transform, clobber: false }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Done !!');
    if (process.argv[4] === 'link') {
      exec(`npm install ${path.join(__dirname, '..', 'tslib-cli', 'tslib-cli-4.0.0.tgz')}`, { cwd });
    }
    exec('git init', { cwd });
    exec(`git config user.name ${username}`, { cwd });
    exec(`git config user.email ${email}`, { cwd });
    exec('git add .', { cwd });
    exec("git commit -am 'fist commit'", { cwd });
    exec('yarn', { cwd });
    process.exit(0);
  });
} else {
  console.error("That did't go well. Try adding a destination parameter?");
}