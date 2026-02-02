import { Stack, RemovalPolicy, StackProps, CfnOutput } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class S3Stack extends Stack {
  public readonly imageBucket: Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.imageBucket = new Bucket(this, "ImageBucket", {
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    new CfnOutput(this, "ImageBucketName", {
      value: this.imageBucket.bucketName,
    });
  }
}
