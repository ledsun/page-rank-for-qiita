#!/bin/bash
PEM=panq.pem

IP_ADDRESS=$(aws ec2 describe-instances --profile panq | jq '.Reservations' | jq 'map(select(.Instances[0].Tags[0].Value == "panq"))' |jq -r '.[].Instances[].PublicIpAddress')
rsync -rav -e "ssh -i $PEM" ec2-user@$IP_ADDRESS:data .
