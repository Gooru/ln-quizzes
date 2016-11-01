#!/bin/bash

source .ci/common.sh

if [ $UID -eq 0 ]; then
  info "Running as root creating builder user and dropping privileges"
  groupadd -r -g 501 builder && useradd -m -r -g builder -u 500 builder
  curl -sL https://github.com/ncopa/su-exec/archive/v0.2.tar.gz | tar xz -C /tmp
  CURDIR=$PWD
  cd /tmp/su-exec-0.2
  make
  cd $CURDIR
  /tmp/su-exec-0.2/su-exec builder $0
  exit $?
fi

GIT_COMMIT_HASH=$(git rev-parse HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD | sed 's/\//-/')
VERSION=${GIT_BRANCH}-${GIT_COMMIT_HASH}

info "Installing global npm dependencies..."
npm config set prefix '~/.npm-packages'
export PATH=~/.npm-packages/bin:$PATH
silent npm -q install -g ember-cli@2.5.1 bower@1.7.9 phantomjs-prebuilt@2.1.3 stubby@0.3.1 grunt-cli@1.2.0 npm@latest

info "Installing npm dependencies..."
silent npm -q install

info "Installing bower dependencies..."
silent bower install

info "Running eslint..."
silent grunt bamboo-eslint

info "Running tests..."
silent grunt bamboo-test

info "Building..."
silent grunt build:prod-bamboo
echo $VERSION > quizzes/version.html
tar czf quizzes.tar.gz quizzes
