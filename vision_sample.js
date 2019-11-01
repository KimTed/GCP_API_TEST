'use strict';

require('dotenv').config();
const vision = require('@google-cloud/vision');
const request = require('request')
const client = new vision.ImageAnnotatorClient({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});
const {reqFunc} = require('./common')

const main = async imgURL => {
    const imgObj = await new Promise((resolve, reject) => {
        request(imgURL, (error, res, body) => {
            if (!error && res.statusCode == 200) {
                resolve(new Buffer(body).toString('base64'));
            } else {
                reject(error);
            }
        });
    });


    // {
    //     image:{content:"/9j/7QBEUGhvdG9zaG9...image contents...fXNWzvDEeYxxxzj/Coa6Bax//Z"},
    //     features:[{type:"FACE_DETECTION",maxResults:10}]
    //   }
    const tmp = await client.documentTextDetection(imgURL);

    console.log(tmp);
}


main('http://www.sbclub.co.kr/goods_sub/0704_infor.jpg').catch(console.error);