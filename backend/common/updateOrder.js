const { default: mongoose } = require('mongoose')
const {
  updateAccount,
  updateAccountLibrary
} = require('../controller/account.controller')
const { refundPayment } = require('../controller/payment.controller')
const Book = require('../model/book.model')
const Order = require('../model/order.model')
const { ORDER_STATUS_NAME, PAYMENT_METHOD } = require('./constant')

const updateOrderById = async (id, status, callback = null) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      const error = new Error('invalid order id')
      error.status = 8
      throw error
    }

    const currentOrder = await Order.findById(id)
    if (!currentOrder) {
      const error = new Error('Order does not exist')
      error.status = 7
      throw error
    }

    if (checkValidNewStatus(currentOrder.status, status)) {
      if (
        (status == -1 || status == -2 || status == -3) &&
        currentOrder.payment === 1 &&
        currentOrder.paid
      ) {
        refundPayment(currentOrder.paypal.refund, async (error, response) => {
          if (error) {
            if (callback != null) callback(error, null)
          } else {
            await restoreBooks(currentOrder.books)
            const updatedOrder = await Order.findOneAndUpdate(
              { _id: id },
              { status: status, refund: true },
              { new: true }
            )
              .populate({
                path: 'user',
                select: 'username email avatar_url address'
              })
              .populate({
                path: 'books.book',
                select: 'slug _id name avatarUrl'
              })
              .select(
                '_id user books status paid total address phone message payment createAt updateAt email customer'
              )
              .lean()
            updatedOrder.statusName = ORDER_STATUS_NAME[updatedOrder.status]
            updatedOrder.paymentMethod = PAYMENT_METHOD[updatedOrder.payment]
            if (callback != null) callback(null, updatedOrder)
          }
        })
      } else {
        try {
          if (status == -1 || status == -2 || status == -3)
            await restoreBooks(currentOrder.books)
          if (status == 3) {
            updateBooks(currentOrder.books)
            updateAccountLibrary(currentOrder.user, currentOrder.books)
          }
          const updatedOrder = await Order.findOneAndUpdate(
            { _id: id },
            { status: status },
            { new: true }
          )
            .populate({
              path: 'user',
              select: 'username email avatar_url address'
            })
            .populate({
              path: 'books.book',
              select: 'slug _id name avatarUrl'
            })
            .select(
              '_id user books status paid total address phone message payment createAt updateAt email customer'
            )
            .lean()

          updatedOrder.statusName = ORDER_STATUS_NAME[updatedOrder.status]
          updatedOrder.paymentMethod = PAYMENT_METHOD[updatedOrder.payment]
          if (callback != null) callback(null, updatedOrder)
        } catch (error) {
          if (callback != null) callback(error, null)
        }
      }
    }
  } catch (error) {
    if (callback != null) callback(error, null)
  }
}

const checkValidNewStatus = (currentStatus, newStatus) => {
  if (newStatus < -3 || newStatus > 4 || parseInt(newStatus) != newStatus) {
    const error = new Error('invalid new status')
    error.status = 6
    throw error
  } else if (newStatus == currentStatus) {
    const error = new Error('Invalid new status')
    error.status = 6
    throw error
  } else if (newStatus > 0 && newStatus != currentStatus + 1) {
    const error = new Error('Invalid new status')
    error.status = 6
    throw error
  } else if (currentStatus < 0 || currentStatus == 4) {
    const error = new Error('Can not change order status')
    error.status = 9
    throw error
  } else if (currentStatus < 0) {
    const error = new Error('Can not change order status')
    error.status = 9
    throw error
  } else if (currentStatus > 0 && newStatus < 0 && newStatus != -3) {
    const error = new Error('Invalid new status')
    error.status = 6
    throw error
  } else if (newStatus == -3 && currentStatus != 2) {
    const error = new Error('Invalid new status')
    error.status = 6
    throw error
  } else return true
}

const restoreBooks = async books => {
  try {
    const asyncUpdateBooks = books.map(bookItem => {
      return Book.findByIdAndUpdate(bookItem.book, {
        $inc: { amount: bookItem.amount }
      })
    })
    return await Promise.all(asyncUpdateBooks)
  } catch (error) {
    throw error
  }
}

const updateBooks = async books => {
  try {
    const asyncUpdateBooks = books.map(bookItem => {
      return Book.findByIdAndUpdate(bookItem.book, {
        $inc: { historicalSold: bookItem.amount }
      })
    })
    return await Promise.all(asyncUpdateBooks)
  } catch (error) {
    throw error
  }
}

module.exports = updateOrderById
