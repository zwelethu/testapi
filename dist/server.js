"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
//app.use("/orders", orderRouter);
app.get('/api/v1', (req, res) => {
    res.send('<H1>Hi from express</H1>');
});
const post = require('./routes/posts');
app.use('/api/v1/posts', post);
app.listen(4500, () => {
    console.log('Node server started running');
});
