'use strict';

require('dotenv').config();
const {Storage} = require('@google-cloud/storage');
const directoryNm = 'comp_storage';
const subDirectoryNm = 'Comp_video/';
const gURㅣ = `gs://${directoryNm}/`;

const getVideos = async () => {
    const storage = new Storage({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});
    let bucketNm = '';
    const linkArr = [];

    try {
        const [buckets] = await storage.getBuckets();

        for (const [idx, bucket] of Array.from(buckets).entries()) {
            bucketNm = bucket.name;
            if (bucketNm === directoryNm) break;
        };
        const [files] = await storage.bucket(bucketNm).getFiles();
        for (const [idx, file] of Array.from(files).entries()) {
            if (file.id === subDirectoryNm || 
                file.name.split('.')[file.name.split('.').length -1] !== 'mp4') continue;
            linkArr.push(`${gURㅣ}${file.name}`);
        }
    } catch (err) {
        console.error('ERROR:', err);
    }
    return linkArr;
}

const main = async () => {
    console.dir(`${await getVideos()}`);
}

// main().catch(console.error);

module.exports = getVideos;