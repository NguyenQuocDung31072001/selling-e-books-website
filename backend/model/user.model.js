const mongoose = require('mongoose')

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true,
      default: Date.now()
    },
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Book'
      }
    ],
    collections: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Collection'
      }
    ],
    library: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Book'
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', User, 'User')
