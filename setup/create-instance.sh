#!/bin/bash
# 注意1：awsコマンドとjqコマンドが必要です。
# http://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-install-macos.html
# https://github.com/stedolan/jq/wiki/Installation
INSTANCE_ID=$(aws ec2 run-instances --image-id ami-8fbab2f3 --count 1 --instance-type t2.micro --key-name panq --security-group-ids sg-9e0de1e6 --subnet-id subnet-6bca3b1c --profile panq |jq -r .Instances[].InstanceId
)

echo $INSTANCE_ID was created

PUBLIC_DNS=$(aws ec2 describe-instances --profile panq --instance-ids $INSTANCE_ID |jq -r .Reservations[].Instances[].PublicDnsName
)

echo waiting for starting the ssh server
sleep 60s

echo ./setup/provisioning.sh $PUBLIC_DNS
./setup/provisioning.sh $PUBLIC_DNS

echo If you want to delete the instance:
echo aws ec2 terminate-instances --profile panq --instance-ids $INSTANCE_ID
