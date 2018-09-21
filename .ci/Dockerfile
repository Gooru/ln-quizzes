#
# Gooru FE Builder Dockerfile
#
# https://github.com/dockerfile/ubuntu/blob/master/Dockerfile
# https://docs.docker.com/examples/nodejs_web_app/
#

# Pull base image.
FROM ubuntu:16.04

# Install Node.js
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g yarn
RUN npm install -g ember-cli@2.9.1
RUN npm install -g bower
RUN apt-get install -y libfontconfig
RUN npm install -g stubby@0.2.13
RUN npm install -g grunt-cli@0.1.13
RUN npm install -g  graceful-fs@4.1.4
RUN apt-get install -y git-core
RUN npm install -g phantomjs-prebuilt@2.1.3

# Add the user UID:500, GID:501, home at /build
RUN groupadd -r bamboo -g 501 && useradd -m -u 500 -r -g bamboo  -s /sbin/nologin -c "App user" bamboo

# Set the working directory to build home directory
WORKDIR /build
 
#Changing ownership for build folder
RUN chown -R bamboo:bamboo /build
RUN chmod 755 /build

# Specify the bamboo user to execute all commands below
USER bamboo
