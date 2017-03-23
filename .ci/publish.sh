#!/bin/bash
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD | sed 's/\//-/')

if [ "$GIT_BRANCH" = "develop" ] || [ "$GIT_BRANCH" =~ ^Nile-release.* ]; then
  set -e

  source .ci/common.sh

  VERSION=$(docker run -v $PWD:/app \
    --workdir /app \
    --user node node:6 node -e "console.log(require('./package.json').version);")

  if [ -z "$S3_BUCKET" ]; then
    error "No S3 bucket specified."
    exit 1
  fi

  if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_DEFAULT_REGION" ]; then
    error "No AWS credentials provided."
    exit 1
  fi

  info "Creating NPM tgz bundle..."

  docker run -v $PWD:/app --workdir /app node:6 npm pack

  info "Publishing version ${VERSION} to S3..."

  aws s3 cp quizzes-addon-${VERSION}.tgz \
    s3://${S3_BUCKET}/quizzes-addon/${VERSION}/quizzes-addon-${VERSION}.tgz

  info "Done publishing."

  docker run -v $PWD:/app --workdir /app node:6 rm quizzes-addon-${VERSION}.tgz
fi
