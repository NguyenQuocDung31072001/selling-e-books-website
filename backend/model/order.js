const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'account'
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
      type: Number, // -2 huy, -1 tu choi, 0 cho xac nhan, 1 xac nhan, 2 van chuyen, 3 giao thanh cong, 4 da nhan hang
      required: true
    },
    payment: {
      type: Number, //0:COD, 1:ATM
      required: true
    },
    paid: {
      type: Boolean,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema, 'Order')
