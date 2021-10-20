const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/getReviews/:pgcnt/:pgsize',reviewController.getReviews);

module.exports = router; 