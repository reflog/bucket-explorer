const Storage = require("@google-cloud/storage");

export function getGCS(options) {
  let storage = new Storage({
    keyFilename: options.keyFilename
  });
  return new GcsWrapper(storage);
}

export class GcsWrapper {
  constructor(private storage) {}
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
      this.storage.createBucket(name, (err, data) => {
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

    let bucket = this.storage.bucket(name);

    return new Promise((resolve, reject) => {
      bucket.delete((err, data) => {
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

    let bucket = this.storage.bucket(bucketName);
    let file = bucket.file(filename);

    return new Promise((resolve, reject) => {
      file.save(JSON.stringify(object), (err, data) => {
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

    return new Promise((resolve, reject) => {
      let bucket = this.storage.bucket(bucketName, err => {
        if (err) {
          reject({
            status: 400,
            message: err.message
          });
        }
      });

      bucket.getFiles((err, data) => {
        if (!err) {
          let objects = [];
          data.forEach(element => {
            objects.push({
              filename: element.id
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
      let bucket = this.storage.bucket(bucketName, err => {
        if (err) {
          reject({
            status: 400,
            message: err.message
          });
        }
      });

      let file = bucket.file(filename, err => {
        if (err) {
          reject({
            status: 400,
            message: err.message
          });
        }
      });

      file.delete((err, data) => {
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

    let objectData;
    return new Promise((resolve, reject) => {
      let bucket = this.storage.bucket(bucketName, err => {
        if (err) {
          reject({
            status: 400,
            message: err.message
          });
        }
      });
      let file = bucket.file(filename, err => {
        if (err) {
          reject({
            status: 400,
            message: err.message
          });
        }
      });

      file
        .createReadStream()
        .on("error", err => {
          reject({
            status: 400,
            message: err.message
          });
        })
        .on("response", response => {
          // Server connected and responded with the specified status and headers.
        })
        .on("data", data => {
          objectData = data;
        })
        .on("end", () => {
          resolve({
            status: 200,
            data: objectData.toString("utf8"),
            message: `Object "${filename}" was fetched successfully from bucket "${bucketName}"`
          });
        });
    });
  }
}
