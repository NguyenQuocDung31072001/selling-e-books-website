const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Types.ObjectId,
    ref: 'Book'
  },
  account: {
    type: mongoose.Types.ObjectId,
    ref: 'account'
  },
  rating: {
    type: Number,
    required: true
  },
  content: {
    type: String
  }
})

module.exports = mongoose.model('Review', ReviewSchema, 'Review')
