'use strict'
// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
async function main() {
    const storage = new Storage({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});

    try {
    // Makes an authenticated API request.
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach(bucket => {
        console.log(bucket.name);
    });
    } catch (err) {
    console.error('ERROR:', err);
    }
}

main().catch(console.error);