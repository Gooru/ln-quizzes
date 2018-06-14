#!/bin/bash

source .ci/common.sh

info "Running build inside custom docker image..."

mkdir /tmp/yarn-cache-bamboo
chmod 0777 /tmp/yarn-cache-bamboo

docker login \
  -u $ARTIFACTORY_USERNAME \
  -p $ARTIFACTORY_PASSWORD

docker run -t --rm \
  -v $PWD:/build \
  -v /tmp/yarn-cache-bamboo:/tmp/yarn-cache \
  -w /build dockergooru/fe-build ./.ci/docker-build.sh
