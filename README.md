# aws-cdk-private-subnet-ec2-and-s3-goofys-ubuntu

## 構成図

![](architecture.drawio.png)

## SSH アクセス

```bash
EC2_INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=AwsCdkTemplate-AwsCdkTemplateStack/AwsCdkTemplate-AwsCdkTemplateStack-general_purpose_ec2" \
    --query "Reservations[].Instances[?State.Name=='running'].InstanceId[]" \
    --output text)
ssh -i ~/.ssh/ec2/id_ed25519 admis@$EC2_INSTANCE_ID
```

## S3 との疎通確認

- AWS CLI でアクセスする場合
  ※ リージョン指定しないと通らない
  ```bash
  aws s3 --region ap-northeast-1 ls
  aws s3 --region ap-northeast-1 ls s3://test-private-2023-0511
  ```
- curl でアクセスする場合
  ```bash
  $ curl https://[ BUCKET_NAME ].s3.ap-northeast-1.amazonaws.com/test.txt
  $ curl https://test-private-2023-0511.s3.ap-northeast-1.amazonaws.com/test.txt


  ```


 ## AWS CLI のインストール

- インターネットゲートウェイがある場合
  ```bash
  sudo apt-get install -y zip
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  sudo ./aws/install
  rm ./awscliv2.zip
  rm -rf ./aws
  ```

- インターネットゲートウェイがない場合
  ```bash
  local-PC$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  local-PC$ unzip awscliv2.zip
  local-PC$ tar -Jcf awscliv2.tar.xz ./aws
  local-PC$ scp -i ~/.ssh/ec2/id_ed25519 awscliv2.tar.xz admis@$EC2_INSTANCE_ID:~/
  
  EC2$ tar -xf awscliv2.tar.xz
  EC2$ sudo ./aws/install
  ```

  結果
  ```bash
  $ aws configure list
        Name                    Value             Type    Location
        ----                    -----             ----    --------
     profile                <not set>             None    None
  access_key     ****************DXB7         iam-role    
  secret_key     ****************k5wf         iam-role    
      region           ap-northeast-1             imds 
  ```
  → iam-role も認識されている．`aws s3 ls` で bucket の状況も表示される．

- インストールの確認
  ```bash
  /usr/local/bin/aws --version
  aws --version
  ```

## 認証情報の確認
```
aws configure list
```

---

## 参考情報

### CDK で EC2 に IAM Role を割り当てる

1. CfnInstance で EC2 を作成する場合
   `EC2InstanceRole.create()` で role を作成して，CfnInstanceProfile を通した後，CfnInstance に渡す（らしい）．
  - [AWS CDKでEC2にIAMロールを割り当てる時の覚書](https://wp-kyoto.net/add-iam-role-to-ec2-instance-by-aws-cdk/)
2. ec2.Instance で EC2 を作成する場合
   ソースコード参照

### Ubuntu の AMI を調べる

- [Amazon EC2 AMI Locator](https://cloud-images.ubuntu.com/locator/ec2/)
- [AWS CDKでEC2をデプロイする](https://qiita.com/Brutus/items/bba6a49a1a05c3277673)


---

## 付録

### よく使うコマンド

#### プロジェクトの初期化

```bash
$ mkdir cdk-workshop && cd cdk-workshop
$ cdk init sample-app --language typescript
```

#### テスト
```bash
npx npm run test
```
```bash
npx npm run test -- -u
```

#### デプロイ
```bash
npx cdk synth
```
```bash
npx cdk deploy --all --require-approval never
```
```bash
npx cdk destroy --all --force
```
