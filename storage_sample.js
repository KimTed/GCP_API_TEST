'use strict';

require('dotenv').config();
const {Storage} = require('@google-cloud/storage');

const main = async () => {
    const storage = new Storage({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});

    try {
        const [buckets] = await storage.getBuckets();
        let bucketNm = '';
        let linkArr = [];

        for (const [idx, bucket] of Array.from(buckets).entries()) {
            
            bucketNm = bucket.name;
            if (bucketNm === 'comp_storage') break;
        };
        const [files] = await storage.bucket(bucketNm).getFiles();
        console.log(files)
        for (const [idx, file] of Array.from(files).entries()) {
            console.log(file.name);
            linkArr.push(file.name);
        }
        console.log(linkArr)
    } catch (err) {
        console.error('ERROR:', err);
    }
}

main().catch(console.error);