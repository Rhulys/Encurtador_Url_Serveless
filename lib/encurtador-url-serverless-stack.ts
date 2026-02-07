import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as lambda_nodejs from 'aws-cdk-lib/aws-lambda-nodejs'

export class EncurtadorUrlServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'UrlsTable', {
      partitionKey: {name: 'shortCode', type: dynamodb.AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    new cdk.CfnOutput(this, 'TableName', { value: table.tableName})


    const encurtadorLambda = new lambda_nodejs.NodejsFunction(this, 'EncurtadorHandler', {
      entry: path.join(__dirname, '../lambda/handler.ts'),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName,
        AWS_ENDPOINT_URL: 'http://localhost.localstack.cloud:4566'
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['@aws-sdk/*'],
      }
    })

    table.grantReadWriteData(encurtadorLambda)

    const api = new apigateway.LambdaRestApi(this, 'EncurtadorAPI', {
      handler: encurtadorLambda,
      proxy: true,
    })

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url})
  }
}