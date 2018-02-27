# Bucket Explorer

## Features

This extension provides you with an easy access to all your cloud storage account, from the comfort of VSCode.

The following cloud providers are supported:

* AWS
* Azure
* DigitalOcean
* GCS
* Rackspace
* Wasabi
* Any S3 Compatible service

Please see the configuration section with details on how to add your buckets.

## Configuration

This extension contributes the following settings:

* `bucketExplorer.enabled`: enable/disable this extension
* `bucketExplorer.buckets`: array of bucket definitions
* bucket definition is provided in the following format:

```js
{
  "name": "bucket-path", // bucket name without prefix. For example, if your S3 bucket is s3://some-bucket - just write "some-bucket"
  "provider": "provider-name", // one of supported providers: "aws", "digitalocean", "gcs", "azure", "wasabi", "s3compatible", "rackspace"
  "configuration": {
    // provider specific parameters
  }
}
```

### Provider specific parameters

#### Amazon AWS S3

```
{
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
    region: 'us-east-1' // Optional: "us-east-1" by default
}
```

#### Google Cloud Storage

How to generate a credentials JSON file: https://cloud.google.com/storage/docs/authentication (To generate a private key in JSON format)

```
{
    keyFilename: 'keyFilename'
}
```

#### Microsoft Azure Blob Storage

```
{
accountName: 'accountName',
accountKey: 'accountKey'
}
```

#### DigitalOcean Spaces

```
{
accessKeyId: 'accessKeyId',
secretAccessKey: 'secretAccessKey',
region: 'nyc3' // Optional: "nyc3" by default
})
```

#### Rackspace Cloud Storage

```
{
username: 'username',
apiKey: 'apiKey',
region: 'IAD' // Optional: 'IAD' by default
})
```

#### Wasabi Object Storage

```
{
accessKeyId: 'accessKeyId',
secretAccessKey: 'secretAccessKey',
}
```

#### Any S3 Compatible Storage (e.g Minio)

```
{
endpoint: 'endpoint',
accessKeyId: 'accessKeyId',
secretAccessKey: 'secretAccessKey',
}
```

## Acknowledgments

Bucket access code is largely based on [solid-bucket](https://bitbucket.org/javidgon/solid-bucket) by José Vidal

## Known Issues

* Only text files are supported.
* Read only access

## Release Notes

### 1.0.0

Initial release of the extension
