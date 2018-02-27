const azure = require("azure-storage");

export function getAZURE(options) {
  let blobService = azure.createBlobService(
    options.accountName,
    options.accountKey
  );
  return new AzureWrapper(blobService);
}

export class AzureWrapper {
  constructor(private blobService) {}
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
      this.blobService.createContainerIfNotExists(
        name,
        {
          publicAccessLevel: "blob"
        },
        (err, data) => {
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
        }
      );
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
      this.blobService.deleteContainerIfExists(name, (err, data) => {
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

    return new Promise((resolve, reject) => {
      this.blobService.createBlockBlobFromText(
        bucketName,
        filename,
        JSON.stringify(object),
        (err, data) => {
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
        }
      );
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

    return new Promise((resolve, reject) => {
      this.blobService.listBlobsSegmented(bucketName, null, (err, data) => {
        if (!err) {
          let objects = [];
          data.entries.forEach(element => {
            objects.push({
              filename: element.name
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

    return new Promise((resolve, reject) => {
      this.blobService.deleteBlob(bucketName, filename, (err, data) => {
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

    return new Promise((resolve, reject) => {
      this.blobService.getBlobToText(bucketName, filename, (err, data) => {
        if (!err) {
          resolve({
            status: 200,
            data: data,
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
