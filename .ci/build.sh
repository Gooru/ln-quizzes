#!/bin/bash

source .ci/common.sh

info "Running build inside custom docker image..."

mkdir /tmp/yarn-cache-bamboo
chmod 0777 /tmp/yarn-cache-bamboo

docker login \
  -u $ARTIFACTORY_USERNAME \
  -p $ARTIFACTORY_PASSWORD edify-dkr.jfrog.io

docker run -t --rm \
  -v $PWD:/build \
  -v /tmp/yarn-cache-bamboo:/tmp/yarn-cache \
  -w /build edify-dkr.jfrog.io/gooru-fe-builder ./.ci/docker-build.sh
