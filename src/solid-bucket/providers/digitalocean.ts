const AWS = require("aws-sdk");
import { AwsWrapper } from "./aws";

export function getDigitalOcean(options) {
  const region = options.region || "nyc3";
  const spacesEndpoint = new AWS.Endpoint(`${region}.digitaloceanspaces.com`);
  const digitalocean = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  });

  return new AwsWrapper(digitalocean);
}
