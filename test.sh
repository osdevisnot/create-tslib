#!/usr/bin/env bash

set -x

npm run setup

cd ~/temp

rm -rf mylib

create-tslib mylib default link

cd mylib

npm run build
npm run coverage
npm run format
npm run lint


cd ~/temp

rm -rf mymono

create-tslib mymono monorepo link

cd mymono

create-tslib mylib default link

npm run build
npm run coverage
npm run format
npm run lint
