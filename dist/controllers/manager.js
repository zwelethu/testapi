"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const retrier_1 = require("@jsier/retrier");
const axios_1 = __importDefault(require("axios"));
const loadbalancer_1 = require("./loadbalancer");
class Manager {
    constructor() {
        this.mapper = (obj) => {
            return { zar: obj.data.zar, eur: obj.data.usd };
        };
        this.cache_expiry = 30; //cache time to live in seconds
        this.last_call = null;
        this.cache = {
            usd: null,
            zar: null,
        }; //stores the result of the last call in cache
        this.delay = 1000; //delay in milli seconds
    }
    //if the endpoint require login, I would do it like this:
    //const tok = 'my_username:my_password';
    //const encoded = btoa(tok);
    //const Basic = 'Basic ' + encoded;
    //axios.get('http://endpoint_url/', {headers : { 'Authorization' : Basic }})
    //OR
    //axios.get('https:/endpoint_url/', {
    //  auth: {
    //    username: 'foo',
    //    password: 'bar'
    //  }
    //});
    fetchData(params, delay, limit) {
        const endpoint = loadbalancer_1.getEndPoint();
        const options = {
            limit,
            delay,
            stopRetryingIf: (error, attempt) => error.response.status < 500,
        };
        const retrier = new retrier_1.Retrier(options);
        var results = retrier
            .resolve((attempt) => new Promise((resolve, reject) => axios_1.default
            .get(endpoint.endpURL, { params: { coin: params } })
            .then((response) => {
            console.log(`reponse without mapper`, response.data);
            console.log(`reponse`, this.mapper(response.data));
            return resolve(this.mapper(response.data));
        })
            .catch((err) => {
            var _a;
            console.log(`${attempt}`);
            console.log((_a = err.response) === null || _a === void 0 ? void 0 : _a.status);
            return reject(err);
        })))
            .then((result) => {
            console.log(`endpoint.num_calls`, endpoint.num_calls);
            endpoint.updateStatus(true, 200);
            this.cache = result; //save result in cache
            this.last_call = new Date(); //save current time so it can be used to determine expiry of cache
            return result;
        }, (error) => {
            // After limit of attempts, logs: error
            console.log(`error`, error.response.status);
            endpoint.updateStatus(false, 500);
            console.log(`endpoint.num_calls`, endpoint.num_calls);
            switch (error.response.status) {
                case 400:
                    return {
                        status: 400,
                        success: false,
                        error: 'Please check your input and try again',
                    };
                case 401:
                    return {
                        status: 401,
                        success: false,
                        error: 'Please check your credentials and try again',
                    };
                case 403:
                    return {
                        status: 404,
                        success: false,
                        error: 'Access to this resource is not allowed',
                    };
                case 404:
                    return {
                        status: 404,
                        success: false,
                        error: 'This resource was not found',
                    };
                case 500:
                    return {
                        status: 500,
                        success: false,
                        error: 'service unavailable',
                    };
                default:
                    return {
                        status: error.response.status,
                        success: false,
                        error: 'Service unavailable, please try again later: ' +
                            error.response.statusText,
                    };
            }
        });
        return results;
    }
    getProperty(obj, key) {
        return obj[key];
    }
}
exports.Manager = Manager;
