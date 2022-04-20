const { default: mongoose } = require('mongoose')
const { ORDER_STATUS_NAME, PAYMENT_METHOD } = require('../common/constant')
const updateOrderById = require('../common/updateOrder')
const Account = require('../model/account.model')
const Book = require('../model/book.model')
const order = require('../model/order.model')
const Order = require('../model/order.model')
const { createPayment, refundPayment } = require('./payment.controller')

const pageLimit = 10

const checkOut = async (req, res) => {
  try {
    const accountId = req.body.account
    const bookIds = req.body.books

    const account = await Account.findById(accountId)
    const books = await Book.find({ _id: { $in: bookIds } })
    const carts = account.cart.filter(cartItem => {
      return bookIds.indexOf(cartItem.book.toString()) != -1
    })

    let total = 0
    const ConfirmBooks = books.map(bookItem => {
      let book = carts.find(cartItem => {
        return cartItem.book.toString() === bookItem._id.toString()
      })
      item.amount = book.amount
      total += book.amount * item.price
      return item
    })
    const orderCheckOut = {
      account,
      order: ConfirmBooks,
      total: total
    }
    res.status(200).json(orderCheckOut)
  } catch (error) {
    console.log(error)
  }
}

const createNewOrder = async (req, res) => {
  try {
    const bookIds = req.body.books
    const accountId = req.body.account
    const district = req.body.district
    const ward = req.body.ward
    const province = req.body.province
    const paymentMethod = req.body.payment
    const phone = req.body.phone

    if (accountId !== req.params.userId)
      throw new Error(
        JSON.stringify({ code: 400, message: 'account not match' })
      )

    const account = await Account.findById(accountId).populate('cart.book')

    if (!account)
      throw new Error(
        JSON.stringify({ code: 404, message: 'Account does not exist' })
      )

    if (paymentMethod != 'cod' && paymentMethod != 'paypal')
      throw new Error(
        JSON.stringify({ code: 400, message: 'Invalid payment method' })
      )

    let total = 0
    const orderBooks = bookIds.map(bookId => {
      const cartItem = account.cart.find(
        item => item.book._id.toString() == bookId
      )

      if (!cartItem)
        throw new Error(
          JSON.stringify({
            code: 400,
            message: 'Book and account are not valid'
          })
        )
      if (cartItem.book.amount < cartItem.amount) throw new Error('Not enough')

      total += cartItem.book.price * cartItem.amount

      return {
        book: cartItem.book._id,
        amount: cartItem.amount,
        price: cartItem.book.price
      }
    })

    const newOrder = new Order({
      user: account._id,
      books: orderBooks,
      status: 0,
      paid: false,
      total: total,
      address: {
        district,
        ward,
        province
      },
      phone: phone
    })

    const asyncUpdateBooks = orderBooks.map(orderItem => {
      return Book.updateOne(
        { _id: orderItem.book },
        { $inc: { amount: -orderItem.amount } }
      )
    })

    const asyncUpdateCart = Account.updateOne(
      { _id: accountId },
      {
        $pull: {
          cart: {
            book: { $in: bookIds }
          }
        }
      }
    )

    //COD
    if (paymentMethod == 'cod') {
      newOrder.payment = 0
      await Promise.all([...asyncUpdateBooks, asyncUpdateCart])
      const savedOrder = await newOrder.save()
      res.json({ success: true, order: savedOrder })
    } else if (paymentMethod == 'paypal') {
      //Payment by Paypal
      newOrder.payment = 1
      await Promise.all([...asyncUpdateBooks, asyncUpdateCart])
      const savedOrder = await newOrder.save()
      await createPayment(savedOrder._id, res)
    } else
      throw new Error(
        JSON.stringify({ code: 400, message: 'Invalid payment method' })
      )
  } catch (error) {
    console.log(error)
    res.status(error.code || 500).json({ success: false, error: error })
  }
}

const getOrders = async (req, res) => {
  try {
    const statusQuery = req.query.status
    const page = req.body.page
    const sorterField = req.query.sorterField

    const queryObj = {}
    if (statusQuery != undefined) queryObj.status = statusQuery

    const sorter = {}
    if (sorterField && req.query.sorterOrder) {
      sorter[sorterField] = req.query.sorterOrder
    }
    const all = await Order.find(queryObj)
      .populate({
        path: 'user',
        select: 'username email avatar_url address',
        option: sorterField == 'user' ? sorter : {}
      })
      .populate({
        path: 'books.book',
        select: '_id slug name coverUrl'
      })
      .select(
        '_id user books status paid total address phone message payment createAt updateAt'
      )
      .sort(sorterField && sorterField != 'user' ? sorter : {})
      .lean()
    all.forEach(order => {
      order.statusName = ORDER_STATUS_NAME[order.status]
      order.paymentMethod = PAYMENT_METHOD[order.payment]
    })
    res.status(200).json(all)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id
    const order = await Order.findById(id)
      .populate({ path: 'user', select: 'username email avatar_url address' })
      .populate({ path: 'books.book', select: 'slug _id name avatarUrl' })
      .select(
        '_id user books status paid total address phone message payment createAt updateAt'
      )
      .lean()
    res.status(200).json(order)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getOrderOfUser = async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.params.userId
    const order = await Order.findOne({ _id: id, user: userId })
      .populate({ path: 'user', select: 'username email avatar_url' })
      .populate({ path: 'books.book', select: 'slug _id name avatarUrl' })
      .select(
        '_id user books status paid total address phone message payment createAt updateAt'
      )
    order.statusName = ORDER_STATUS_NAME[order.status]
    res.status(200).json(order)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateOrder = async (req, res) => {
  try {
    const id = req.parmas.id
    let currentStatus = parseInt(req.body.currentStatus)
    let newStatus = parseInt(req.body.newStatus)
    if (newStatus != -1) newStatus = currentStatus + 1
    if (newStatus > 0) {
      const result = await updateOrderById(id, newStatus)
      res.status(200).json(result)
    } else {
      await updateOrderById(id, newStatus, (error, order) => {
        if (error) {
          const errorObj = JSON.parse(error.message)
          return res.status(errorObj.code || 500).json(errorObj)
        } else {
          console.log(order)
          res.status(200).json(order)
        }
      })
    }
  } catch (error) {
    const errorObj = JSON.parse(error.message)
    return res.status(errorObj.code || 500).json(errorObj)
  }
}

const updateOrderByAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const newStatus = req.body.newStatus
    if (newStatus > 3 || newStatus < -3 || newStatus == -2)
      throw new Error(
        JSON.stringify({ code: 400, message: 'Invalid new status' })
      )
    await updateOrderById(id, newStatus, (error, order) => {
      if (error) {
        return res.status(errorObj.code || 500).json(error)
      } else {
        res.status(200).json(order)
      }
    })
  } catch (error) {
    const errorObj = JSON.parse(error.message)
    return res.status(errorObj.code || 500).json(errorObj)
  }
}

const updateOrderOfUser = async (req, res) => {
  try {
    const id = req.params.id
    let newStatus = parseInt(req.body.newStatus)
    if (newStatus !== 4 && newStatus !== -2) throw new Error('Invalid status')
    await updateOrderById(id, newStatus, (error, order) => {
      if (error) {
        const errorObj = JSON.parse(error.message)
        return res.status(errorObj.code || 500).json(errorObj)
      } else {
        res.status(200).json(order)
      }
    })
  } catch (error) {
    const errorObj = JSON.parse(error.message)
    return res.status(errorObj.code || 500).json(errorObj)
  }
}

const getAllOrderOfUser = async (req, res) => {
  try {
    const userID = req.params.id
    if (!mongoose.isValidObjectId(userID)) throw new Error('Invalid user id')
    const orders = await Order.find({ user: userID })
      .populate({ path: 'books.book', select: '_id slug name coverUrl' })
      .select(
        '_id user books status paid total address phone message payment createAt updateAt'
      )
      .lean()
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
  checkOut,
  createNewOrder,
  getOrders,
  getOrderOfUser,
  updateOrder,
  getAllOrderOfUser,
  updateOrderOfUser,
  updateOrderByAdmin,
  getOrderById
}
