#!/usr/bin/env bash

pnpm run setup

cd ~/temp

rm -rf mylib

create-tslib mylib default link

cd mylib

npm run build
npm run coverage
npm run format
npm run lint

# test
# watch
# start
