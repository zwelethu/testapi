import express from 'express';

const { getPrice } = require('../controllers/bitcoin');
const router = express.Router();

router.route('/:coin').get(getPrice);

module.exports = router;
