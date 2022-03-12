const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Types.ObjectId,
    ref: 'Book'
  },
  User: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
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
