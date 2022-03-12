const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      require: true
    },
    birthDate: {
      type: Date,
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

module.exports = mongoose.model('Author', AuthorSchema, 'Author')
