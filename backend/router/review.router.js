const express = require('express')
const router = express.Router()
const ReviewController = require('../controller/review.controller')

router
  .route('/')
  .post(ReviewController.createNewReview)
  .put(ReviewController.updateReview)
  .delete(ReviewController.deleteReview)

router.route('/delete').post(ReviewController.deleteReview)
router.route('/:id').get(ReviewController.getReviewById)

router.route('/book/:bookId').get(ReviewController.getReviewOfBookById)

module.exports = router
