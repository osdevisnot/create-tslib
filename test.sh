#!/usr/bin/env bash

yarn

cd ~/temp

rm -rf mylib

create-tslib mylib default link

cd mylib

yarn build
yarn coverage
yarn format
yarn lint

# test
# watch
# start
