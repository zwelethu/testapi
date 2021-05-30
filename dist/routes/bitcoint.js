"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getPrice } = require('../controllers/bitcoin');
const router = express_1.default.Router();
router.route('/:coin').get(getPrice);
module.exports = router;
