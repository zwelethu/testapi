import express from 'express';

const { getPosts } = require('../controllers/posts');
const router = express.Router();

router.route('/:postId').get(getPosts);

module.exports = router;
