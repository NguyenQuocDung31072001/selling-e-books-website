const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'account'
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
    shippingCost: {
      type: Number,
      required: true
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
