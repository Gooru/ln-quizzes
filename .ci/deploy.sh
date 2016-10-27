#!/bin/bash

# This script is not going to be run from the source code since Bamboo deployments don't contain the source code only artifacts.
# But it would be the reference script to be copy&paste into Bamboo.

#Ensure that we run in bash not sh
if [ "$(ps -p "$$" -o comm=)" != "bash" ]; then
  # Taken from http://unix-linux.questionfor.info/q_unix-linux-programming_85038.html
  bash "$0" "$@"
  exit "$?"
fi

set -e

RED="\e[31m"
GREEN="\e[32m"
NORMAL="\e[0m"

function error() {
  echo -e "\n$RED-------> $1 $NORMAL"
}

function info() {
  echo -e "\n$GREEN-------> $1 $NORMAL"
}


if [ -z "$S3_BUCKET" ]; then
  error "No S3 bucket specified."
  exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_DEFAULT_REGION" ]; then
  error "No AWS credentials provided."
  exit 1
fi

info "Uncompressing artifact..."
tar xzf quizzes.tar.gz

VERSION=$(cat quizzes/version.html)
info "Deploying version $VERSION to S3..."

cd quizzes
aws s3 sync --delete . s3://${S3_BUCKET}/

info "Done deploying."

