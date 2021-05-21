import { EndpointState, AppCache } from '../api-interfaces';
import { Retrier } from '@jsier/retrier';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { stringify } from 'querystring';

export class Manager {
  constructor() {
    this.cache_expiry = 30; //cache time to live in seconds
    this.last_call = null; //keeps track of date when last call attempt was made to see if the cache is still valid
    this.url_state = []; //Keeps track of urls called
    this.cache = {
      postId: null,
      name: null,
      id: null,
      email: null,
      body: null,
    }; //stores the result of the last call in cache
    this.delay = 1000; //delay in milli seconds
  }

  cache: AppCache | null;
  cache_expiry: number;
  last_call: Date | null;
  url_state: EndpointState[];
  delay: number;

  fetchData(url: string, params: string, delay: number, limit: number) {
    const options = {
      limit,
      delay,
      stopRetryingIf: (error: any, attempt: any) =>
        error.status.toString().startWith('4'),
    };
    const retrier = new Retrier(options);
    var results = retrier
      .resolve(
        (attempt) =>
          new Promise((resolve, reject) =>
            axios
              .get(url, { params: { postId: params } })
              .then((response: AxiosResponse<EndpointState>) =>
                resolve(response.data)
              )
              .catch((err: AxiosError) => reject(err))
          )
      )
      .then(
        (result) => {
          this.cache = result; //save result in cache
          this.last_call = new Date(); //save current time so it can be used to determine expiry of cache
          return result;
        },
        (error) => {
          // After limit of attempts, logs: error
          var idx = this.url_state.findIndex((x) => x.url === url);
          if (idx < 0)
            //first time encountering permanent error using this url therefore add it for tracking
            this.url_state.push({ url, num_tries: 1, num_calls: 1 });
          //store info about it
          else {
            this.url_state[idx].num_calls += 1;
            this.url_state[idx].num_tries += 1;
          }
          return (
            'Service unavailable, please try again later: ' + error.msessage
          );
        }
      );
    return results;
  }
}
