const mongoose = require('mongoose')

const GoodsReceivedSchema = new mongoose.Schema({
  book: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Book'
  },
  quantity: {
    required: true,
    type: Number
  },
  price: {
    required: true,
    type: Number
  },
  date: {
    required: true,
    type: Date
  }
})

module.exports = mongoose.model(
  'GoodsReceived',
  GoodsReceivedSchema,
  'GoodsReceived'
)
