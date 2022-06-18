const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Review = require('../model/review.model')
const Order = require('../model/order.model')
const mongoose = require('mongoose')
const createHttpError = require('http-errors')
const createNewReview = async (req, res) => {
  // console.log(req.body)
  try {
    let reviewInfo = {
      book: req.body.book,
      account: req.body.account,
      content: req.body.content || '',
      rating: req.body.rating || -1
    }
    const existReview = await Review.findOne({
      book: reviewInfo.book,
      account: reviewInfo.account
    })
    if (existReview)
      throw createHttpError.Conflict('You have already reviewed ')
    const account = await Account.findById(reviewInfo.account)
    if (!account) throw createHttpError.NotFound('Account does not exist')
    const book = await Book.findById(reviewInfo.book)
    if (!book) throw createHttpError.NotFound('Book does not exist')
    const order = await Order.findOne({
      user: reviewInfo.account,
      'books.book': reviewInfo.book,
      status: { $in: [3, 4] }
    })
    if (!order) throw createHttpError.BadRequest('You have not purchased yet.')

    const newReview = new Review(reviewInfo)
    book.historicalReviewed++
    if (reviewInfo.rating != -1) {
      book.rating =
        (book.rating * book.reviews.length + newReview.rating) /
        (book.reviews.length + 1)
    } else {
      delete reviewInfo.rating
    }
    const savedReview = await newReview.save()
    account.reviews.push(savedReview._id)
    book.reviews.push(savedReview._id)

    await Promise.all([account.save(), book.save()])
    res.status(200).json({
      success: true,
      error: false,
      message: '',
      status: 200,
      review: savedReview
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      error: true,
      message: error.message,
      status: error.status,
      review: null
    })
  }
}
const updateReview = async (req, res) => {
  console.log('req body', req.body)
  try {
    const review = { rating: req.body.rating, content: req.body.content }
    const propNames = Object.getOwnPropertyNames(review)
    const updateProp = {}
    propNames.forEach(prop => {
      if (review[prop] != undefined) updateProp[prop] = review[prop]
    })
    const updatedReview = await Review.findOneAndUpdate(
      { book: req.body.book, account: req.body.account },
      updateProp,
      {
        new: true
      }
    )
    res
      .status(200)
      .json({ success: true, error: false, message: '', review: updatedReview })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, error: true, message: '', review: null })
  }
}

const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findOneAndDelete({
      book: req.body.book,
      account: req.body.account
    })
    const asyncUpdateAccount = Account.findOneAndUpdate(
      { reviews: deletedReview._id },
      {
        $pull: { reviews: deletedReview._id }
      }
    )
    const asyncUpdateBook = Book.findOneAndUpdate(
      { reviews: deletedReview._id },
      {
        $pull: { reviews: deletedReview._id },
        $inc: { historicalReviewed: -1 }
      }
    )
    await Promise.all([asyncUpdateAccount, asyncUpdateBook])
    res
      .status(200)
      .json({ success: true, error: false, message: '', deleted: true })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, error: true, message: '', deleted: false })
  }
}

const getReviewById = async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) throw new Error('Invalid review id')
    const review = await Review.findById(id)
      .populate('book')
      .populate({ path: 'account', select: 'username avatar_url' })
    res.status(200).json(review)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getReviewOfBookById = async (req, res) => {
  try {
    const bookId = req.params.bookId
    const reviews = await Review.find({ book: bookId })
      .populate('book')
      .populate({ path: 'account', select: 'username avatar_url' })
    
    // const reviews = await Review.findOneAndDelete({ book: bookId })
    
    res.status(200).json({
      reviews: reviews
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getReviewOfBook = async bookId => {
  const reviews = await Review.find({ book: bookId })
    .populate('book')
    .populate({ path: 'account', select: 'username avatar_url' })
  return reviews
}

const getReviewOfAccount = async accountId => {
  const reviews = await Review.find({ account: accountId })
    .populate('book')
    .populate({ path: 'account', select: 'username avatar_url' })
  return reviews
}

module.exports = {
  createNewReview,
  updateReview,
  getReviewOfBook,
  getReviewOfBookById,
  getReviewOfAccount,
  getReviewById,
  deleteReview
}
