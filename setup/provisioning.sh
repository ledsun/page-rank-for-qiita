#!/bin/bash

HOST=$1
PEM=$2

ssh -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  # Install Node.js.
  sudo yum update -y
  curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
  sudo yum -y install nodejs
  sudo yum -y install git
  sudo yum -y install gcc-c++

  sudo npm i -g forever
EOF

# Send secrets
scp -i $PEM .env ec2-user@$HOST:.

# Setup the server
ssh -oStrictHostKeyChecking=no -i $PEM ec2-user@$HOST << EOF
  source .env

  # websocketパッケージを使っているとglobalインストールできない
  npm i page-rank-for-qiita
  sudo -E forever start -o out.log -e err.log \$(npm bin)/panq-server
EOF
