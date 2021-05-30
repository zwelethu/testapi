import { TData, TResponse } from '../api-interfaces';
import { Retrier } from '@jsier/retrier';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { getEndPoint } from './loadbalancer';

export class Manager {
  constructor() {
    this.cache_expiry = 30; //cache time to live in seconds
    this.last_call = null;
    this.cache = {
      usd: null,
      zar: null,
    }; //stores the result of the last call in cache
    this.delay = 1000; //delay in milli seconds
  }

  cache: TData | null;
  cache_expiry: number;
  last_call: Date | null;
  delay: number;
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

  fetchData(params: string, delay: number, limit: number) {
    const endpoint = getEndPoint();
    const options = {
      limit,
      delay,
      stopRetryingIf: (error: any, attempt: number) =>
        error.response.status < 500,
    };
    const retrier = new Retrier(options);
    var results = retrier
      .resolve(
        (attempt) =>
          new Promise((resolve, reject) =>
            axios
              .get(endpoint.endpURL, { params: { coin: params } })
              .then((response: AxiosResponse<TResponse>) => {
                console.log(`reponse without mapper`, response.data);
                console.log(`reponse`, this.mapper(response.data));
                return resolve(this.mapper(response.data));
              })
              .catch((err: AxiosError) => {
                console.log(`${attempt}`);
                console.log(err.response?.status);
                return reject(err);
              })
          )
      )
      .then(
        (result) => {
          console.log(`endpoint.num_calls`, endpoint.num_calls);
          endpoint.updateStatus(true, 200);
          this.cache = result; //save result in cache
          this.last_call = new Date(); //save current time so it can be used to determine expiry of cache
          return result;
        },
        (error) => {
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
                error:
                  'Service unavailable, please try again later: ' +
                  error.response.statusText,
              };
          }
        }
      );
    return results;
  }

  mapper = <T extends { data: TData }>(obj: T) => {
    return { zar: obj.data.zar, eur: obj.data.usd };
  };

  getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }
  //const zar = getProperty(data, "zar");
}
