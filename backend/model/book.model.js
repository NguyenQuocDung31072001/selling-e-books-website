const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema(
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
    coverId: {
      type: String,
      required: true
    },
    coverUrl: {
      type: String,
      require: true
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
    format: {
      //Format == 0 => Ebook
      //format == 1 => Hardcover
      type: Number,
      required: true
    },
    language: {
      type: mongoose.Types.ObjectId,
      ref: 'Language',
      required: true
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
    },
    amount: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Book', BookSchema, 'Book')
