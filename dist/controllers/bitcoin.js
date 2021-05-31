"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = void 0;
const manager_1 = require("./manager");
const manager = new manager_1.Manager();
const getPrice = (req, res, next) => {
    console.log(!req.params.coin || req.params.coin !== 'bth');
    if (!req.params.coin || req.params.coin !== 'bth')
        //attempt at sanitising input
        return res.status(400).json({
            success: false,
            error: 'Unsupported input received',
        });
    if (manager.last_call) {
        //check if we have data in cache
        var seconds = (new Date().getTime() - manager.last_call.getTime()) / 1000; //check if cache is still valid
        if (seconds < manager.cache_expiry) {
            console.log('from cache');
            return res.status(200).json({
                success: true,
                data: manager.cache,
            });
        }
    }
    manager
        .fetchData(req.params.coin, manager.delay, 3) //attempt to call api with delay and max 3 attempts
        .then((data) => {
        if (data.error) {
            console.log(data);
            return res.status(data.status).json({
                success: false,
                error: data.error,
            });
        }
        else {
            return res.json({ data });
        }
    })
        .catch((err) => {
        return res.status(400).json({
            success: false,
            error: err,
        });
    });
};
exports.getPrice = getPrice;
