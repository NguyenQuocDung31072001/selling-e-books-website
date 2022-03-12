const mongoose = require('mongoose')

const DetailSchema = new mongoose.Schema({
  format: {
    //Format == 0 => Ebook
    //format == 1 => Hardcover
    type: Number,
    required: true
  },
  language: {
    type: mongoose.Types.ObjectId,
    ref: 'Language'
  },
  pages: {
    type: Number,
    required: true
  },
  publishedBy: {
    type: String,
    required: true
  },
  publishedDate: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const Book = new mongoose.Schema(
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
    cover: {
      type: String,
      required: true
    },
    genres: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Genre'
      }
    ],
    authors: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Author'
      }
    ],
    description: {
      type: String,
      required: true
    },
    detail: {
      type: DetailSchema,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Review'
      }
    ],
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Book', Book, 'Book')
