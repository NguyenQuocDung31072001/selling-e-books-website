const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
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
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Genre', GenreSchema, 'Genre')
