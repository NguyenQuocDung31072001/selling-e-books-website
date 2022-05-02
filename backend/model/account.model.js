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
    phoneNumber: {
      type: String
    },
    address: {
      street: {
        type: String,
        required: true
      },
      ward: {
        WardCode: {
          type: Number,
          required: true
        },
        WardName: {
          type: String,
          required: true,
          default: ''
        }
      },
      district: {
        DistrictID: {
          type: Number,
          required: true
        },
        DistrictName: {
          type: String,
          required: true,
          default: ''
        }
      },
      province: {
        ProvinceID: {
          type: Number,
          required: true
        },
        ProvinceName: {
          type: String,
          required: true,
          default: ''
        }
      }
    },
    birthDate: {
      type: Date
    },
    cart: {
      type: [
        {
          book: {
            type: mongoose.Types.ObjectId,
            ref: 'Book'
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
        ref: 'Book'
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
    reviews: {
      type: [
        {
          type: mongoose.ObjectId,
          ref: 'Review'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('account', accountUser, 'account')
