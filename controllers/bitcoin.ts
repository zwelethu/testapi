import { Request, Response } from 'express';
import { Manager } from './manager';
import { TResponse } from '../api-interfaces';

const manager = new Manager();

exports.getPrice = (req: Request, resp: Response) => {
  console.log(!req.params.coin || req.params.coin !== 'bth');
  if (!req.params.coin || req.params.coin !== 'bth')
    //attempt at sanitising input
    return resp.status(400).json({
      success: false,
      error: 'Unsupported input received',
    });
  if (manager.last_call) {
    //check if we have data in cache
    var seconds = (new Date().getTime() - manager.last_call.getTime()) / 1000; //check if cache is still valid
    if (seconds < manager.cache_expiry) {
      console.log('from cache');
      return resp.status(200).json({
        success: true,
        data: manager.cache,
      });
    }
  }

  manager
    .fetchData(req.params.coin, manager.delay, 3) //attempt to call api with delay and max 3 attempts
    .then((data: TResponse) => {
      if (data.error) {
        console.log(data);

        return resp.status(data.status).json({
          success: false,
          error: data.error,
        });
      } else {
        return resp.json({ data });
      }
    })
    .catch((err) => {
      return resp.status(400).json({
        success: false,
        error: err,
      });
    });
};
