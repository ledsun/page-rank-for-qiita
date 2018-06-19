#!/bin/bash
# 注意1：awsコマンドとjqコマンドが必要です。
# http://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-install-macos.html
# https://github.com/stedolan/jq/wiki/Installation
PEM=panq.pem

INSTANCE_ID=$(aws ec2 run-instances --image-id ami-2724cf58 --count 1 --instance-type t2.nano --key-name panq --security-group-ids sg-9e0de1e6 --subnet-id subnet-6bca3b1c --profile panq |jq -r .Instances[].InstanceId
)

echo $INSTANCE_ID was created

IP_ADDRESS=$(aws ec2 describe-instances --profile panq --instance-ids $INSTANCE_ID |jq -r .Reservations[].Instances[].PublicIpAddress
)

echo waiting for starting the ssh server
sleep 60s

echo ./setup/provisioning.sh $IP_ADDRESS $PEM
./setup/provisioning.sh $IP_ADDRESS $PEM

aws ec2 create-tags --profile panq --resources $INSTANCE_ID --tags Key=Name,Value=panq_rc

# その後の手順のナビゲーション
echo ssh login: ssh -i $PEM ec2-user@$IP_ADDRESS
echo open browser: open http://$IP_ADDRESS
echo delete the instance: aws ec2 terminate-instances --profile panq --instance-ids $INSTANCE_ID
echo enable the instance: ./setup/blue-green-deployment.sh $INSTANCE_ID
