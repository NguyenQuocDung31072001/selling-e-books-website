const mongoose = require('mongoose')

const AnonymousOrderSchema = new mongoose.Schema(
  {
    verifyToken: {
      type: String,
      // required: true,
      unique: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      required: true
    },
    customer: {
      type: String,
      required: true
    },
    books: [
      {
        book: {
          type: mongoose.Types.ObjectId,
          ref: 'Book'
        },
        amount: {
          type: Number
        },
        price: {
          type: Number
        }
      }
    ],
    payment: {
      type: Number, //0:COD, 1:ATM
      required: true
    },
    paypal: {
      _id: {
        type: String,
        default: ''
      },
      refund: {
        type: String,
        default: ''
      }
    },
    paid: {
      type: Boolean,
      required: true,
      default: false
    },
    refund: {
      type: Boolean,
      default: false
    },
    subTotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      required: true
    },
    voucher: {
      code: {
        type: String,
        uppercase: true
      },
      discount: {
        type: Number,
        min: 0
      }
    },
    total: {
      type: Number,
      required: true
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
    phone: {
      type: String,
      required: true,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model(
  'AnonymousOrder',
  AnonymousOrderSchema,
  'AnonymousOrder'
)
