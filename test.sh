#!/usr/bin/env bash

set -x

yarn run setup

cd ~/temp

rm -rf mylib

create-tslib mylib default link

cd mylib

yarn build
yarn coverage
yarn format
yarn lint


cd ~/temp

rm -rf mymono

create-tslib mymono monorepo link

cd mymono

create-tslib mylib default link

yarn build
yarn coverage
yarn format
yarn lint
