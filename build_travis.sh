#!/bin/sh

echo "Building on ${TRAVIS_OS_NAME}"
if [[ "${TRAVIS_OS_NAME}" == "linux" ]]; then
    echo "Building win and linux packages"
    npm run build:wl
fi
if [[ "${TRAVIS_OS_NAME}" == "darwin" ]]; then
    echo "Building osx package"
    npm run build:osx
fi