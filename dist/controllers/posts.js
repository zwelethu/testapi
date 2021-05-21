"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manager_1 = require("./manager");
const manager = new manager_1.Manager();
exports.getPosts = (req, resp) => {
    console.log(!req.params.postId || parseInt(req.params.postId) > 100);
    if (!req.params.postId || parseInt(req.params.postId) > 100)
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
        .fetchData('https://jsonplaceholder.typicode.com/comments', req.params.postId, manager.delay, 3) //attempt to call api with delay and max 3 attempts
        .then((data) => {
        console.log('from actual call');
        return resp.status(200).json({
            success: true,
            data,
        });
    })
        .catch((err) => {
        return resp.status(400).json({
            success: false,
            error: err,
        });
    });
};
