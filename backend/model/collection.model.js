const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Types.ObjectId,
      ref: 'account',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    books: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Book'
        }
      ],
      default: []
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Collection', CollectionSchema, 'Collection')
