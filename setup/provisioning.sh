#!/bin/bash

PEM=panq.pem
HOST=$1

ssh -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  # Install Node.js.
  sudo yum update -y
  curl --silent --location https://rpm.nodesource.com/setup_9.x | sudo bash -
  sudo yum -y install nodejs
  sudo yum -y install git
  sudo yum -y install gcc-c++

  sudo npm i -g forever
  # Create application directory
  mkdir panq
EOF

# Setup node app
export RSYNC_RSH="ssh  -oStrictHostKeyChecking=no -i $PEM"
rsync -rav --delete --exclude .git --exclude .gitignore --exclude node_modules --exclude README.md --exclude .DS_Store --exclude setup $(pwd)/ ec2-user@$HOST:panq

ssh  -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  cd panq
  npm i
  source .env
  sudo -E forever start bin/panq-server
EOF

echo If you want ssh login the instance:
echo ssh -i $PEM ec2-user@$HOST
