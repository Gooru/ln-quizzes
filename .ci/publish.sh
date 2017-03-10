#!/bin/bash

set -e

source .ci/common.sh

VERSION=$(node -e "console.log(require('./package.json').version);")

if [ -z "$S3_BUCKET" ]; then
  error "No S3 bucket specified."
  exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_DEFAULT_REGION" ]; then
  error "No AWS credentials provided."
  exit 1
fi

info "Creating CodeDeploy bundle..."

npm pack

info "Publishing version ${VERSION} to S3..."

aws s3 cp quizzes-addon-${VERSION}.tgz \
  s3://${S3_BUCKET}/quizzes-addon/${VERSION}/quizzes-addon-${VERSION}.tgz

info "Done publishing."

