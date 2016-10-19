#!/bin/bash

source .ci/common.sh

info "Running build inside node:4.6 docker image..."

docker run -t --rm --name builder -v $PWD:/build -w /build node:4.6 .ci/docker-build.sh
