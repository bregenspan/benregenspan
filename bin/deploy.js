const path = require('path');
const process = require('process');
const s3 = require('s3');
const AWS = require('aws-sdk');

const DEPLOY_FOLDER = path.join(__dirname, '..', 'dist');

// Cache base page, other unversioned files briefly
const UNVERSIONED_CACHE_SECONDS = 120;

// Cache all static assets (which should have hashes in filenames) up to 1 year
const DEFAULT_CACHE_SECONDS = 31536000;

// Versioned files match the pattern ${name}.${hash}.${extension}
const VERSIONED_FILE_REGEX = /^[^.]*\.\w+\.\w+$/;

// Pull shared credentials from ~/.aws/credentials
const creds = new AWS.SharedIniFileCredentials({ profile: 'default' });

const client = s3.createClient({
  maxAsyncS3: 20,
  s3RetryCount: 3,
  s3RetryDelay: 1000,
  s3Options: {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    region: 'us-east-1',
    sslEnabled: true
  }
});

const params = {
  localDir: DEPLOY_FOLDER,
  deleteRemoved: true,
  getS3Params: function getS3Params (localFile, stat, callback) {
    const extraParams = {};

    // Cache files that lack versions in filenames for shorter duration
    if (!localFile.match(VERSIONED_FILE_REGEX) && !localFile.endsWith('favicon.ico')) {
      extraParams.CacheControl = `max-age=${UNVERSIONED_CACHE_SECONDS}`;
    }

    callback(null, extraParams);
  },
  s3Params: {
    Bucket: 'ben.regenspan.com',
    CacheControl: `max-age=${DEFAULT_CACHE_SECONDS}`
  }
};

const uploader = client.uploadDir(params);

uploader.on('error', function (err) {
  console.error('Unable to sync:', err.stack);
  process.exit(1);
});

uploader.on('progress', function () {
  if (uploader.progressTotal) {
    console.log(`Progress: ${uploader.progressAmount} / ${uploader.progressTotal}`);
  }
});

uploader.on('end', function () {
  console.log('Done uploading');
  process.exit(0);
});
