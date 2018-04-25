#!/bin/bash

NEW_INSTANCE=$1
TARGET_GROUP=arn:aws:elasticloadbalancing:ap-northeast-1:016753510962:targetgroup/panq/a4a4b48314297cc1

# 新インスタンスをELBのターゲットグループに追加
aws elbv2 register-targets --target-group-arn $TARGET_GROUP --targets Id=$NEW_INSTANCE

# panqタグのついた古いインスタンスをELBのターゲットグループから削除して、インスタンス自体も削除
OLD_INSTANCE=$(aws ec2 describe-instances --profile panq | jq '.Reservations' | jq 'map(select(.Instances[0].Tags[0].Value == "panq"))' |jq -r '.[].Instances[].InstanceId')
aws elbv2 deregister-targets --target-group-arn $TARGET_GROUP --targets Id=$OLD_INSTANCE
aws ec2 terminate-instances --profile panq --instance-ids $OLD_INSTANCE
aws ec2 create-tags --profile panq --resources $OLD_INSTANCE --tags Key=Name,Value=panq_old

# 新インスタンスにpanqタグをつける
aws ec2 create-tags --profile panq --resources $NEW_INSTANCE --tags Key=Name,Value=panq
