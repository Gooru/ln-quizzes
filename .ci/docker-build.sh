#!/bin/bash

source .ci/common.sh

if [ $UID -eq 0 ]; then
  info "Running as root dropping privileges"
  /usr/local/bin/su-exec builder $0
  exit $?
fi

GIT_COMMIT_HASH=$(git rev-parse HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD | sed 's/\//-/')
VERSION=${GIT_BRANCH}-${GIT_COMMIT_HASH}

info "Installing npm dependencies..."
silent yarn install --ignore-engines

info "Installing bower dependencies..."
silent bower install

info "Running eslint..."
silent grunt bamboo-eslint

info "Running tests..."
silent grunt bamboo-test
