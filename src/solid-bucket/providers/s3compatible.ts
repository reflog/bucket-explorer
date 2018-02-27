const AWS = require("aws-sdk");
import { AwsWrapper } from "./aws";

export function getS3Compatible(options) {
  const endpoint = new AWS.Endpoint(options.endpoint);
  const s3Compatible = new AWS.S3({
    endpoint: endpoint,
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  });

  return new AwsWrapper(s3Compatible);
}
