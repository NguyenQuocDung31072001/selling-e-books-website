const { default: mongoose } = require('mongoose')
const { updateAccount } = require('../controller/account.controller')
const { refundPayment } = require('../controller/payment.controller')
const Book = require('../model/book.model')
const Order = require('../model/order.model')
const { ORDER_STATUS_NAME, PAYMENT_METHOD } = require('./constant')

const updateOrderById = async (id, status, callback = null) => {
  try {
    if (!mongoose.isValidObjectId(id))
      throw new Error(
        JSON.stringify({ code: 400, message: 'invalid order id' })
      )

    const currentOrder = await Order.findById(id)
    if (!currentOrder)
      throw new Error(
        JSON.stringify({ code: 404, message: 'Order does not exist' })
      )

    if (checkValidNewStatus(currentOrder.status, status)) {
      if (
        (status == -1 || status == -2 || status == -3) &&
        currentOrder.payment === 1 &&
        currentOrder.paid
      ) {
        refundPayment(currentOrder.paypal.refund, async (error, response) => {
          if (error) {
            callback(error, null)
          } else {
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
                '_id user books status paid total address phone message payment createAt updateAt'
              )
              .lean()
            await restoreBooks(currentOrder.books)
            updatedOrder.statusName = ORDER_STATUS_NAME[updatedOrder.status]
            updatedOrder.paymentMethod = PAYMENT_METHOD[updatedOrder.payment]
            callback(null, updatedOrder)
          }
        })
      } else {
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
            '_id user books status paid total address phone message payment createAt updateAt'
          )
          .lean()
        if (status == -1 || status == -2 || status == -3)
          await restoreBooks(currentOrder.books)
        updatedOrder.statusName = ORDER_STATUS_NAME[updatedOrder.status]
        updatedOrder.paymentMethod = PAYMENT_METHOD[updatedOrder.payment]
        callback(null, updatedOrder)
      }
    }
  } catch (error) {
    callback(error, null)
  }
}

const checkValidNewStatus = (currentStatus, newStatus) => {
  if (newStatus < -2 || newStatus > 4 || parseInt(newStatus) != newStatus)
    throw new Error(JSON.stringify({ code: 400, message: 'invalid status' }))
  else if (newStatus == currentStatus) throw new Error('Invalid new status')
  else if (newStatus > 0 && newStatus != currentStatus + 1)
    throw new Error(
      JSON.stringify({ code: 400, message: 'Invalid new status' })
    )
  else if (currentStatus < 0 || currentStatus == 4)
    throw new Error(
      JSON.stringify({ code: 400, message: 'Can not change order status' })
    )
  else if (currentStatus < 0)
    throw new Error(
      JSON.stringify({ code: 400, message: 'Can not change order status' })
    )
  else if (currentStatus > 0 && newStatus < 0 && newStatus != -3)
    throw new Error(
      JSON.stringify({ code: 400, message: 'Invalid new status' })
    )
  else if (newStatus == -3 && currentStatus != 2)
    throw new Error(
      JSON.stringify({ code: 400, message: 'Invalid new status' })
    )
  else return true
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
    throw new Error(JSON.stringify(error))
  }
}

module.exports = updateOrderById
