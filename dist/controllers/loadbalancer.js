"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndPoint = void 0;
const CURL_1 = require("./CURL");
const urls = [
    new CURL_1.CURLState(1, 'http://localhost:5000/api/v1/test/test1'),
    new CURL_1.CURLState(2, 'http://localhost:5000/api/v1/test/test2'),
    new CURL_1.CURLState(3, 'http://localhost:5000/api/v1/test/test3'),
];
const getEndPoint = () => {
    console.log(`urls[0].available`, urls[0].available);
    console.log(`urls[1].available`, urls[1].available);
    console.log(`urls[2].available`, urls[2].available);
    if (urls[0].available) {
        console.log('using 1');
        return urls[0];
    }
    else if (urls[1].available) {
        console.log('using 2');
        return urls[1];
    }
    else {
        console.log('using 3');
        return urls[2];
    }
};
exports.getEndPoint = getEndPoint;
