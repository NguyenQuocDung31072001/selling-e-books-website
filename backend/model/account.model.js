const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const accountUser = new mongoose.Schema(
  {
    username: {
      type: String
      // lowercase: true,
      // required: true,
      // unique: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true
    },
    verifyToken: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
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
        type: String
      },
      ward: {
        WardCode: {
          type: Number
        },
        WardName: {
          type: String,
          default: ''
        }
      },
      district: {
        DistrictID: {
          type: Number
        },
        DistrictName: {
          type: String,
          default: ''
        }
      },
      province: {
        ProvinceID: {
          type: Number
        },
        ProvinceName: {
          type: String,
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

accountUser.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    console.log(error)
  }
}
module.exports = mongoose.model('account', accountUser, 'account')
