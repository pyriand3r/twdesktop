#!/bin/sh

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
    npm run build:wl
fi
if [[ "$TRAVIS_OS_NAME" == "darwin" ]]; then
    npm run build:osx
fi