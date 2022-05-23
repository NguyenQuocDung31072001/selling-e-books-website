const { number } = require('joi')
const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'account'
    },
    customer: {
      type: String,
      required: true
    },
    email: {
      type: String
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
    status: {
      type: Number, //-3 giao hang khong thanh cong,  -2 huy, -1 tu choi, 0 cho xac nhan, 1 xac nhan, 2 van chuyen, 3 giao thanh cong, 4 da nhan hang
      required: true
    },
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
      },
      totalExecute: {
        type: Number,
        min: 0
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

module.exports = mongoose.model('Order', orderSchema, 'Order')
