const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Review = require('../model/review.model')
const mongoose = require('mongoose')
const createNewReview = async (req, res) => {
  try {
    const reviewInfo = {
      book: req.body.book,
      account: req.body.account,
      content: req.body.content,
      rating: req.body.rating
    }
    const propNames = Object.getOwnPropertyNames(reviewInfo)
    propNames.forEach(prop => {
      if (reviewInfo[prop] == undefined || reviewInfo[prop] == null)
        throw new Error(`${prop} is null`)
    })
    const newReview = new Review(reviewInfo)
    const savedReview = await newReview.save()
    const updatedAccount = await Account.findByIdAndUpdate(
      savedReview.account,
      { $push: { reviews: savedReview._id } }
    )
    if (!updatedAccount) await Review.deleteOne({ _id: savedReview._id })

    const updatedBook = await Book.findByIdAndUpdate(savedReview.book, {
      $push: { reviews: savedReview._id }
    })
    if (!updatedBook) {
      const asyncUpdateAccount = Account.findByIdAndUpdate(
        savedReview.account,
        { $pull: { reviews: savedReview._id } }
      )
      const asyncDeleteReview = Review.deleteOne({ _id: savedReview._id })
      await Promise.all(asyncUpdateAccount, asyncDeleteReview)
    }

    res.status(200).json(savedReview)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateReview = async (req, res) => {
  try {
    const id = req.params.id
    const review = {
      book: req.body.book,
      account: req.body.account,
      rating: req.body.rating,
      content: req.body.content
    }
    const propNames = Object.getOwnPropertyNames(review)
    const updateProp = {}
    propNames.forEach(prop => {
      if (review[prop] != undefined) updateProp[prop] = review[prop]
    })
    const updatedReview = await Review.findByIdAndUpdate(id, updateProp, {
      new: true
    })
    res.status(500).json(updatedReview)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deleteReview = async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) throw new Error('invalid review id')
    const asyncDeleteReview = Review.deleteOne({ _id: id })
    const asyncUpdateAccount = Account.findOneAndUpdate(
      { reviews: id },
      {
        $pull: { reviews: id }
      }
    )
    const asyncUpdateBook = Book.findOneAndUpdate(
      { reviews: id },
      {
        $pull: { reviews: id }
      }
    )
    await Promise.all([asyncUpdateAccount, asyncDeleteReview, asyncUpdateBook])
    res.status(200).json({ deleted: true })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
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
    const pageLimit = 10
    const page = req.query.page ? req.query.page : 1
    const maxItem = await Review.count({ book: bookId })
    const maxPage = Math.ceil(maxItem / pageLimit)
    const reviews = await Review.find({ book: bookId })
      .skip((page - 1) * pageLimit)
      .limit(pageLimit)
      .populate('book')
      .populate({ path: 'account', select: 'username avatar_url' })
    res.status(200).json({
      currentPage: page,
      maxPage: maxPage,
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
