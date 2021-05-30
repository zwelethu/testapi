"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const http = require('http');
const servers = ['http://localhost', 'http://localhost', 3000, 3001];
let cur = 0;
const handler = (req, res) => {
    // Pipe the vanilla node HTTP request (a readable stream) into `request`
    // to the next server URL. Then, since `res` implements the writable stream
    // interface, you can just `pipe()` into `res`.
    req
        .pipe(http.request({ hostname: servers[cur], port: servers[cur + 2] }))
        .pipe(res);
    cur = (cur + 1) % servers.length;
};
exports.handler = handler;
