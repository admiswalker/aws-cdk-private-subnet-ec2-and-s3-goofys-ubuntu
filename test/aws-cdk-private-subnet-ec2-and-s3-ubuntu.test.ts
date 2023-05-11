import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as AwsCdkPrivateSubnetEc2AndS3Ubuntu from '../lib/aws-cdk-private-subnet-ec2-and-s3-ubuntu-stack';

test('SQS Queue and SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsCdkPrivateSubnetEc2AndS3Ubuntu.AwsCdkPrivateSubnetEc2AndS3UbuntuStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
  template.resourceCountIs('AWS::SNS::Topic', 1);
});
