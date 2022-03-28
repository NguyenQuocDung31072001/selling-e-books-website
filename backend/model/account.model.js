const mongoose = require('mongoose')

const accountUser = new mongoose.Schema(
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
    role: {
      type: String,
      required: true
    },
    id_avatar: {
      type: String
    },
    avatar_url: {
      type: String
    },
    phone_number: {
      type: String
    },
    address: {
      type: String
    },
    birthDate: {
      type: Date
    },
    cart: {
      type: [
        {
          book: {
            type: mongoose.Types.ObjectId,
            ref: 'book'
          },
          amount: { type: Number, required: true }
        }
      ],
      default: []
    },
    collections: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Collection'
      }
    ],
    library: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'book'
      }
    ],
    message: {
      type: [
        {
          title: { type: String, required: true },
          content: { type: String, required: true },
          createdAt: { type: Date, default: Date.now() }
        }
      ],
      default: []
    },
    newMessage: { type: Boolean, default: false },
    reviews: { type: mongoose.ObjectId, ref: 'Review' }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('account', accountUser, 'account')
