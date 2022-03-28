const express = require('express')
const router = express.Router()
const ReviewController = require('../controller/review.controller')

router.route('/').post(ReviewController.createNewReview)

router
  .route('/:id')
  .get(ReviewController.getReviewById)
  .put(ReviewController.updateReview)
  .delete(ReviewController.deleteReview)

router.route('/book/:bookId').get(ReviewController.getReviewOfBookById)

module.exports = router
