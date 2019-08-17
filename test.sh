#!/usr/bin/env bash

set -x

pnpm run setup

cd ~/temp

rm -rf mylib

create-tslib mylib default link

cd mylib

pnpm run build
pnpm run coverage
pnpm run format
pnpm run lint


cd ~/temp

rm -rf mymono

create-tslib mymono monorepo link

cd mymono

create-tslib mylib default link

pnpm run build
pnpm run coverage
pnpm run format
pnpm run lint
