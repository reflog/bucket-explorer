const fs = require("fs");
const pkgcloud = require("pkgcloud");
const Readable = require("stream").Readable;

export function getRACKSPACE(options) {
  let rackspace = pkgcloud.storage.createClient({
    provider: "rackspace",
    username: options.username,
    apiKey: options.apiKey,
    region: options.region || "IAD"
  });
  return new RackspaceWrapper(rackspace);
}

export class RackspaceWrapper {
  constructor(private rackspace) {}
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
      this.rackspace.createContainer(
        {
          name: name
        },
        function(err, data) {
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
      this.rackspace.destroyContainer(name, err => {
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
      let stream = new Readable();
      stream.push(JSON.stringify(object));
      stream.push(null);

      // create a writeable stream for our destination
      let dest = this.rackspace.upload({
        container: bucketName,
        remote: filename
      });

      dest.on("error", err => {
        reject({
          status: 400,
          message: err.message
        });
      });

      dest.on("success", file => {
        resolve({
          status: 200,
          message: `Object "${filename}" was saved successfully in bucket "${bucketName}"`
        });
      });

      // pipe the source to the destination
      stream.pipe(dest);
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
      this.rackspace.getFiles(bucketName, (err, data) => {
        if (!err) {
          let objects = [];
          data.forEach(element => {
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
      this.rackspace.removeFile(bucketName, filename, (err, data) => {
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
      let source = this.rackspace.download(
        {
          container: bucketName,
          remote: filename
        },
        function(err, data) {
          if (err) {
            reject({
              status: 400,
              message: err.message
            });
          }
        }
      );

      source.on("data", data => {
        objectData = data;
      });
      source.on("end", () => {
        resolve({
          status: 200,
          data: objectData.toString("utf8"),
          message: `Object "${filename}" was fetched successfully from bucket "${bucketName}"`
        });
      });
    });
  }
}
