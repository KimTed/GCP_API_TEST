'use strict';
// const sharp = require('sharp');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});
// const request = require('request').defaults({ encoding: null });

const detectImg = async (imgURL, returnObj) => {
/**
    // vision test
let tmp = await client.labelDetection("http://image.gsshop.com/image/31/68/31689345_L1.jpg")
tmp = await client.safeSearchDetection("http://image.gsshop.com/image/31/68/31689345_L1.jpg")
tmp= await client.imageProperties("http://image.gsshop.com/image/31/68/31689345_L1.jpg")
tmp= await client.logoDetection("http://image.gsshop.com/image/31/68/31689345_L1.jpg")

tmp = await client.asyncBatchAnnotateImages("http://image.gsshop.com/image/31/68/31689345_L1.jpg")
console.log("##################################")
*/

/* 
let imgEncode = await new Promise(function (resolve, reject) {
    request(imgURL, (error, res, body) => {
        if (!error && res.statusCode == 200) {
            resolve(new Buffer(body).toString('base64'));
        } else {
            reject(error);
        }
    });
  });

  const param = [
    {
      image:{content: imgEncode},
      features: [{type: "LABEL_DETECTION", maxResults:1}]
    }
  ];
  */
    return client.documentTextDetection(imgURL)
    .then(result => {
        if (result && !!result[0].fullTextAnnotation && !!result[0].fullTextAnnotation.text) {
            returnObj.isContTxt = true;
            returnObj.text = result[0].fullTextAnnotation.text;
        }
    })
    .catch(err => {
        return reqFunc(err)
    });
}
 
const reqFunc = obj => {
    let resultJSON;
    try {
        resultJSON = JSON.parse(JSON.stringify(obj, Object.getOwnPropertyNames(obj)))   ;
    } catch (e) {
        let tmpObj = {};
        console.log(e)
        if (obj.message) {
            tmpObj.message = obj.message;
        } else {
            tmpObj.message = '에러 발생';
        }
        resultJSON = JSON.parse(JSON.stringify(tmpObj));
    }
    return resultJSON;
}

// text가 있는 상품: 35220021
// text가 하나도 없는 상품: 34489415
// (async ()=>{
// console.log(process.argv);
// const prdCd = process.argv[2];

// const imgURL = makeImgUrl(prdCd);
// const returnObj = {prdCd, imgURL, isContTxt: false};
// const detectResult = await detectImg(imgURL, returnObj);

// return returnObj;
// console.log("#############################");
// })()

/**
 * //추가 본상품 toesat...
 * http://image.gsshop.com/image/31/68/31689345_L1.jpg
 * 
 * 
 * //신발 AS98
 * http://image.gsshop.com/image/30/60/30609638_L1.jpg
 * 
 * 
 * //반지
 * http://image.gsshop.com/image/33/63/33639994_L1.jpg
 * 
 * 
 * //넥카라 니트
 * http://image.gsshop.com/image/35/22/35220021_L1.jpg
 * 
 */
const analysisImg = async prdCd => {
    await detectImg('http://www.sbclub.co.kr/goods_sub/0704_infor.jpg', {});
    // await detectImg(imgURL, returnObj);
    return returnObj;
}

analysisImg(process.argv[2]);
module.exports = analysisImg;