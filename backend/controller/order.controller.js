const { default: mongoose } = require('mongoose')
const { ORDER_STATUS_NAME, PAYMENT_METHOD } = require('../common/constant')
const updateOrderById = require('../common/updateOrder')
const Account = require('../model/account.model')
const Book = require('../model/book.model')
const order = require('../model/order.model')
const Order = require('../model/order.model')
const { createPayment, refundPayment } = require('./payment.controller')
const {
  calShippingCost,
  getProvince,
  getDistrict,
  getWard
} = require('../controller/shipping.controller')

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
    const addressTo = req.body.address
    const customer = req.body.customer
    const paymentMethod = req.body.payment
    const phone = req.body.phone

    if (accountId !== req.params.userId) throw new Error('account not match')

    const account = await Account.findById(accountId).populate('cart.book')

    if (!account) throw new Error('Account does not exist')

    if (paymentMethod != 'cod' && paymentMethod != 'paypal')
      throw new Error('Invalid payment method')

    let total = 0
    const orderBooks = bookIds.map(bookId => {
      const cartItem = account.cart.find(
        item => item.book._id.toString() == bookId
      )

      if (!cartItem) throw new Error('Book and account are not valid')
      if (cartItem.book.amount < cartItem.amount) throw new Error('Not enough')

      total += cartItem.book.price * cartItem.amount

      return {
        book: cartItem.book._id,
        amount: cartItem.amount,
        price: cartItem.book.price
      }
    })

    let shippingCost = await calShippingCost(accountId, addressTo, bookIds)
    total += shippingCost.total
    const province = await getProvince(addressTo.ProvinceID)
    if (!province) throw new Error('Invalid address')
    const district = await getDistrict(
      addressTo.ProvinceID,
      addressTo.DistrictID
    )
    if (!district) throw new Error('Invalid address')
    const ward = await getWard(addressTo.DistrictID, addressTo.WardCode)
    if (!ward) throw new Error('Invalid address')

    const newOrder = new Order({
      user: account._id,
      customer: customer ? customer : account.username,
      books: orderBooks,
      status: 0,
      paid: false,
      shippingCost: shippingCost.total,
      total: total,
      address: {
        street: addressTo.street,
        ward: {
          WardCode: ward.WardCode,
          WardName: ward.WardName
        },
        district: {
          DistrictID: district.DistrictID,
          DistrictName: district.DistrictName
        },
        province: {
          ProvinceID: province.ProvinceID,
          ProvinceName: province.ProvinceName
        }
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
      const savedOrder = await newOrder.save()
      await Promise.all([...asyncUpdateBooks, asyncUpdateCart])
      res.json({
        success: true,
        redirect: true,
        redirectTo: 'http://localhost:3000/user/purchase',
        order: savedOrder
      })
    } else if (paymentMethod == 'paypal') {
      //Payment by Paypal
      newOrder.payment = 1
      const savedOrder = await newOrder.save()
      await Promise.all([...asyncUpdateBooks, asyncUpdateCart])
      await createPayment(savedOrder._id, res)
    } else throw new Error('Invalid payment method')
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
        '_id user books status paid shippingCost total address phone message payment createAt updateAt'
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
        '_id user books status paid shippingCost total address phone message payment createAt updateAt'
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
        '_id user books status paid shippingCost total address phone message payment createAt updateAt'
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
          return res.status(500).json(error)
        } else {
          console.log(order)
          res.status(200).json(order)
        }
      })
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

const updateOrderByAdmin = async (req, res) => {
  try {
    const id = req.params.id
    const newStatus = req.body.newStatus
    if (newStatus > 3 || newStatus < -3 || newStatus == -2)
      throw new Error('Invalid new status')

    await updateOrderById(id, newStatus, (error, order) => {
      if (error) {
        return res.status(500).json(error)
      } else {
        res.status(200).json(order)
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json(errorObj)
  }
}

const updateOrderOfUser = async (req, res) => {
  try {
    const id = req.params.id
    let newStatus = parseInt(req.body.newStatus)
    if (newStatus !== 4 && newStatus !== -2) throw new Error('Invalid status')
    await updateOrderById(id, newStatus, (error, order) => {
      if (error) {
        return res.status(500).json(error)
      } else {
        res.status(200).json(order)
      }
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}

const getAllOrderOfUser = async (req, res) => {
  try {
    const userId = req.params.id
    const statusQuery = req.query.status
    const page = req.body.page
    const sorterField = req.query.sorterField

    const queryObj = { user: new mongoose.Types.ObjectId(userId) }
    if (statusQuery != undefined) {
      const status = parseInt(statusQuery)
      if (statusQuery <= -1) {
        queryObj.status = { $lte: status }
      } else if (status >= 3) {
        queryObj.status = { $gte: status }
      } else queryObj.status = status
    }

    const sorter = {}
    if (sorterField && req.query.sorterOrder) {
      sorter[sorterField] = req.query.sorterOrder
    }

    console.log(queryObj)

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
        '_id user books status paid shippingCost total address phone message payment createAt updateAt'
      )
      .sort({ createdAt: 'descending' })
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
