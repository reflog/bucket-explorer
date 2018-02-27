"use strict";

import { getAWS } from "./providers/aws";
import { getS3Compatible } from "./providers/s3compatible";
import { getDigitalOcean } from "./providers/digitalocean";
import { getWasabi } from "./providers/wasabi";
import { getGCS } from "./providers/gcs";
import { getAZURE } from "./providers/azure";
import { getRACKSPACE } from "./providers/rackspace";

export class SolidBucketError extends Error {
  status: number;
  constructor(data: { status: number; message: string }) {
    super(data.message);
    this.status = data.status;
  }
}

export class SolidBucket {
  constructor(provider, options) {
    if (provider === "aws") {
      if (!options.accessKeyId || !options.secretAccessKey) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getAWS(options);
    } else if (provider === "digitalocean") {
      if (!options.accessKeyId || !options.secretAccessKey) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getDigitalOcean(options);
    } else if (provider === "wasabi") {
      if (!options.accessKeyId || !options.secretAccessKey) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getWasabi(options);
    } else if (provider === "gcs") {
      if (!options.keyFilename) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getGCS(options);
    } else if (provider === "azure") {
      if (!options.accountName || !options.accountKey) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getAZURE(options);
    } else if (provider === "rackspace") {
      if (!options.username || !options.apiKey) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getRACKSPACE(options);
    }
    if (provider === "s3compatible") {
      if (
        !options.accessKeyId ||
        !options.secretAccessKey ||
        !options.endpoint
      ) {
        throw new SolidBucketError({
          status: 400,
          message: "Missing Auth options"
        });
      }
      return getS3Compatible(options);
    } else {
      throw new SolidBucketError({
        status: 400,
        message: "Missing Auth options"
      });
    }
  }
}
