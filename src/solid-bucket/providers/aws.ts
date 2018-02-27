const AWS = require("aws-sdk");

export function getAWS(options) {
  let s3 = new AWS.S3({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    region: options.region || "us-east-1"
  });

  return new AwsWrapper(s3);
}

export class AwsWrapper {
  constructor(private s3) {
    this.s3 = s3;
  }
  createBucket(name) {
    if (!name) {
      return new Promise((resolve, reject) => {
        reject({
          status: 400,
          message: "Invalid parameters"
        });
      });
    }

    return new Promise((resolve, reject) => {
      this.s3.createBucket({ Bucket: name }, (err, data) => {
        if (!err) {
          resolve({
            status: 201,
            message: `Bucket "${name}" was created successfully`
          });
        } else {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
    });
  }

  deleteBucket(name) {
    if (!name) {
      return new Promise((resolve, reject) => {
        reject({
          status: 400,
          message: "Invalid parameters"
        });
      });
    }

    return new Promise((resolve, reject) => {
      this.s3.deleteBucket({ Bucket: name }, (err, data) => {
        if (!err) {
          resolve({
            status: 200,
            message: `Bucket "${name}" was deleted successfully`
          });
        } else {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
    });
  }

  saveObjectIntoBucket(bucketName, filename, object) {
    if (!bucketName || !filename || !object) {
      return new Promise((resolve, reject) => {
        reject({
          status: 400,
          message: "Invalid parameters"
        });
      });
    }

    let params = {
      Bucket: bucketName,
      Key: filename,
      Body: JSON.stringify(object)
    };
    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err, data) => {
        if (!err) {
          resolve({
            status: 200,
            message: `Object "${filename}" was saved successfully in bucket "${bucketName}"`
          });
        } else {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
    });
  }

  getListOfObjectsFromBucket(bucketName) {
    if (!bucketName) {
      return new Promise((resolve, reject) => {
        reject({
          status: 400,
          message: "Invalid parameters"
        });
      });
    }

    let params = {
      Bucket: bucketName
    };
    return new Promise((resolve, reject) => {
      this.s3.listObjectsV2(params, (err, data) => {
        if (!err) {
          let objects = [];
          data.Contents.forEach(element => {
            objects.push({
              filename: element.Key
            });
          });
          resolve({
            status: 200,
            data: objects,
            message: `The list of objects was fetched successfully from bucket "${bucketName}"`
          });
        } else {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
    });
  }

  deleteObjectFromBucket(bucketName, filename) {
    if (!bucketName || !filename) {
      return new Promise((resolve, reject) => {
        reject({
          status: 400,
          message: "Invalid parameters"
        });
      });
    }

    let params = {
      Bucket: bucketName,
      Key: filename
    };

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(params, (err, data) => {
        if (!err) {
          resolve({
            status: 200,
            message: `Object "${filename}" was deleted successfully from bucket "${bucketName}"`
          });
        } else {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
    });
  }

  getObjectFromBucket(bucketName, filename) {
    if (!bucketName || !filename) {
      return new Promise((resolve, reject) => {
        reject({
          status: 400,
          message: "Invalid parameters"
        });
      });
    }

    let params = {
      Bucket: bucketName,
      Key: filename
    };
    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (!err) {
          resolve({
            status: 200,
            data: data.Body.toString("utf-8"),
            message: `Object "${filename}" was fetched successfully from bucket "${bucketName}"`
          });
        } else {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
    });
  }
}
