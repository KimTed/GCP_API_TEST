'use strict'

require('dotenv').config();

module.exports = {
    reqFunc: obj => {
        let resultJSON;
        try {
            resultJSON = JSON.parse(JSON.stringify(obj, Object.getOwnPropertyNames(obj)));
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
};