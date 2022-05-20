const { default: mongoose } = require('mongoose')
const { ORDER_STATUS_NAME, PAYMENT_METHOD } = require('../common/constant')
const { updateOrderById } = require('../common/updateOrder')
const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Order = require('../model/order.model')
const crypto = require('crypto')
const {
  createPayment,
  refundPayment,
  createAnonymousPayment
} = require('./payment.controller')
const {
  calShippingCost,
  getProvince,
  getDistrict,
  getWard,
  calAnonymousShippingCost
} = require('../controller/shipping.controller')
const { orderValidate, anonymousOrderValidate } = require('../utils/validation')
const createHttpError = require('http-errors')
const AnonymousOrder = require('../model/anonymousOrder.model')
const { sendConfirmOrderEmail } = require('../utils/senEmail')
const { applyVoucher } = require('./voucher.controller')

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

const newOrder = async (req, res) => {
  try {
    if (req.body.account) {
      await createNewOrder(req, res)
    } else {
      await createAnonymousOrder(req, res)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const createNewOrder = async (req, res) => {
  try {
    const {
      books,
      address,
      email,
      customer,
      payment,
      phoneNumber,
      voucherCode
    } = req.body

    const accountId = req.body.account
    const account = await Account.findById(accountId).populate('cart.book')

    const { error } = orderValidate({
      user: accountId,
      customer: customer,
      books: books,
      status: 0,
      payment: payment,
      street: address.street,
      ward: address.WardCode,
      district: address.DistrictID,
      province: address.ProvinceID,
      phone: phoneNumber
    })

    if (error) throw createHttpError.BadRequest(error)

    if (!account) {
      const error = new Error('Account does not exist')
      error.status = 1
      throw error
    }

    if (payment != 'cod' && payment != 'paypal') {
      const error = new Error('Invalid payment method')
      error.status = 2
      throw error
    }

    const bookIDs = books.map(item => item.book)
    const existBooks = await Book.find({ _id: { $in: bookIDs } })
    if (existBooks.length != bookIDs.length) {
      const error = new Error('Invalid book ID')
      error.status = 9
      throw error
    }

    let subTotal = 0

    const orderBooks = books.map(bookItem => {
      const cartItem = account.cart.find(
        item => item.book._id.toString() == bookItem.book
      )

      if (!cartItem) {
        const error = new Error('Book and account are not valid')
        error.status = 3
        throw error
      }

      if (bookItem.amount != cartItem.amount) {
        const error = new Error(`Cart have changed`)
        error.status = 4
        throw error
      }

      if (cartItem.book.amount < cartItem.amount) {
        const error = new Error(`Books does not enough`)
        error.status = 4
        throw error
      }

      subTotal += cartItem.book.price * cartItem.amount

      return {
        book: cartItem.book._id,
        amount: cartItem.amount,
        price: cartItem.book.price
      }
    })

    let shippingCost = await calShippingCost(accountId, address, bookIDs)

    const province = await getProvince(address.ProvinceID)
    if (!province) {
      const error = new Error('Invalid address')
      error.status = 5
      throw error
    }
    const district = await getDistrict(address.ProvinceID, address.DistrictID)
    if (!district) {
      const error = new Error('Invalid address')
      error.status = 5
      throw error
    }

    const ward = await getWard(address.DistrictID, address.WardCode)
    if (!ward) {
      const error = new Error('Invalid address')
      error.status = 5
      throw error
    }

    const newOrder = new Order({
      user: account._id,
      email: email ? email : account.email,
      customer: customer ? customer : account.username,
      books: orderBooks,
      status: 0,
      paid: false,
      shippingCost: shippingCost.total,
      subTotal: subTotal,
      total: shippingCost.total + subTotal,
      address: {
        street: address.street,
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
      phone: phoneNumber
    })
    if (typeof voucherCode !== 'undefined') {
      const voucher = await applyVoucher(newOrder, voucherCode)
      if (voucher) {
        newOrder.voucher = voucher
        let total = newOrder.subTotal + newOrder.shippingCost - voucher.discount
        newOrder.total = total
      }
    }

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
            book: { $in: bookIDs }
          }
        }
      }
    )

    //COD
    if (payment == 'cod') {
      newOrder.payment = 0
      const savedOrder = await newOrder.save()
      await Promise.all([...asyncUpdateBooks, asyncUpdateCart])
      res.json({
        success: true,
        redirect: true,
        redirectTo: `${process.env.FRONT_END_HOST}/user/purchase`,
        order: savedOrder
      })
    } else if (payment == 'paypal') {
      //Payment by Paypal
      newOrder.payment = 1
      const savedOrder = await newOrder.save()
      await Promise.all([...asyncUpdateBooks, asyncUpdateCart])
      await createPayment(savedOrder._id, res)
    }
  } catch (error) {
    /*
      Error status: 
      + 0 - ID trong req.params và ID Account trong body không trùng khớp 
      + 1 - Không tìm thấy account tương ứng với ID
      + 2 - Phương thức thanh toán không phù hợp
      + 3 - Sách không nằm trong giỏ hàng của account
      + 4 - Số lượng sách còn lại không đủ
      + 5 - Địa chỉ đặt hàng không phù hợp
    */

    console.log(error)
    if (error.status) {
      res.json({
        success: false,
        error: true,
        status: error.status,
        message: error.message
      })
    } else {
      res.status(500).json({ success: false, error: true })
    }
  }
}

const createAnonymousOrder = async (req, res) => {
  try {
    const {
      books,
      address,
      email,
      customer,
      payment,
      phoneNumber,
      voucherCode
    } = req.body

    if (payment != 'cod' && payment != 'paypal') {
      const error = new Error('Invalid payment method')
      error.status = 2
      throw error
    }

    const bookIDs = books.map(item => item.book)
    const existBooks = await Book.find({ _id: { $in: bookIDs } })
    if (existBooks.length != bookIDs.length) {
      const error = new Error('Invalid book ID')
      error.status = 9
      throw error
    }

    const { error } = anonymousOrderValidate({
      customer: customer,
      books: bookIDs,
      status: 0,
      payment: payment,
      street: address.street,
      ward: address.WardCode,
      district: address.DistrictID,
      province: address.ProvinceID,
      phone: phoneNumber
    })

    let subTotal = 0

    const orderBooks = books.map(item => {
      const book = existBooks.find(book => book._id.toString() === item.book)
      if (book.amount < item.amount) throw new Error('Book sold out')
      subTotal += book.price * item.amount
      return {
        book: item.book,
        amount: item.amount,
        price: book.price
      }
    })

    if (error) throw createHttpError.BadRequest(error)

    let shippingCost = await calAnonymousShippingCost(address, orderBooks)
    const province = await getProvince(address.ProvinceID)
    if (!province) {
      const error = new Error('Invalid address')
      error.status = 5
      throw error
    }
    const district = await getDistrict(address.ProvinceID, address.DistrictID)
    if (!district) {
      const error = new Error('Invalid address')
      error.status = 5
      throw error
    }

    const ward = await getWard(address.DistrictID, address.WardCode)
    if (!ward) {
      const error = new Error('Invalid address')
      error.status = 5
      throw error
    }

    const newOrder = new AnonymousOrder({
      customer: customer,
      email: email,
      books: orderBooks,
      status: 0,
      paid: false,
      subTotal: subTotal,
      shippingCost: shippingCost.total,
      total: subTotal + shippingCost.total,
      address: {
        street: address.street,
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
      phone: phoneNumber
    })

    if (typeof voucherCode !== 'undefined') {
      const voucher = await applyVoucher(newOrder, voucherCode)
      if (voucher) {
        newOrder.voucher = voucher
        let total = newOrder.subTotal + newOrder.shippingCost - voucher.discount
        newOrder.total = total
      }
    }

    const asyncUpdateBooks = orderBooks.map(orderItem => {
      return Book.updateOne(
        { _id: orderItem.book },
        { $inc: { amount: -orderItem.amount } }
      )
    })

    //COD
    if (payment == 'cod') {
      newOrder.payment = 0
      newOrder.verifyToken = crypto.randomBytes(64).toString('hex')
      const savedOrder = await newOrder.save()
      const popOrder = await AnonymousOrder.findById(savedOrder._id).populate({
        path: 'books.book',
        select: '_id slug name coverUrl'
      })
      await sendConfirmOrderEmail(popOrder.email, popOrder)
      await Promise.all(asyncUpdateBooks)
      res.json({
        success: true,
        redirect: true,
        redirectTo: process.env.FRONT_END_HOST,
        message: 'Đặt hàng thành công vui lòng kiểm tra email và xác nhận',
        order: savedOrder
      })
    } else if (payment == 'paypal') {
      //Payment by Paypal
      newOrder.payment = 1
      const savedOrder = await newOrder.save()
      await Promise.all(asyncUpdateBooks)
      await createAnonymousPayment(savedOrder._id, res)
    }
  } catch (error) {
    console.log(error)
    if (error.status) {
      res.json({
        success: false,
        error: true,
        status: error.status,
        message: error.message
      })
    } else {
      res.status(500).json({ success: false, error: true })
    }
  }
}

const getOrders = async (req, res) => {
  try {
    const { status, payment, paid, sorterField, from, to, customer, page } =
      req.query

    const queryObj = {}
    if (status != undefined) queryObj.status = parseInt(status)
    if (payment != undefined) queryObj.payment = parseInt(payment)
    if (customer != undefined) queryObj.customer = new RegExp(customer, 'i')
    if (paid != undefined) queryObj.paid = paid
    if (from || to) {
      queryObj['$and'] = []
    }
    if (from) {
      queryObj['$and'].push({ createdAt: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      queryObj['$and'].push({ createdAt: { $lte: new Date(toDate) } })
    }
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
        '_id user books status paid shippingCost total subTotal voucher address phone message payment createdAt updatedAt email customer'
      )
      .sort(sorterField && sorterField != 'user' ? sorter : { updatedAt: -1 })
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
        '_id user books status paid shippingCost total subTotal voucher address phone message payment createdAt updatedAt email customer'
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
        '_id user books status paid shippingCost total subTotal voucher address phone message payment createdAt updatedAt email customer'
      )
      .sort({ createdAt: -1 })
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
    if (newStatus > 0) newStatus = currentStatus + 1
    else newStatus = -2
    if (newStatus > 0) {
      const result = await updateOrderById(id, newStatus)
      res.status(200).json(result)
    } else {
      await updateOrderById(id, newStatus, (error, order) => {
        if (error) {
          console.log(error)
          if (error.status) {
            res.json({
              success: false,
              error: true,
              status: error.status,
              message: error.message
            })
          } else {
            res.status(500).json({ success: false, error: error })
          }
        } else {
          // console.log(order)
          res.status(200).json(order)
        }
      })
    }
  } catch (error) {
    console.log(error)
    if (error.status) {
      res.json({
        success: false,
        error: true,
        status: error.status,
        message: error.message
      })
    } else {
      res.status(500).json({ success: false, error: error })
    }
  }
}

const updateOrderByAdmin = async (req, res) => {
  try {
    const id = req.params.id
    let newStatus = req.body.newStatus
    const order = await Order.findById(id)
    if (order) {
      if (order.status == 2 && newStatus == -1) newStatus = -3
      if (order.status == 0 && newStatus == -1) newStatus = -1
    }
    await updateOrderById(id, newStatus, (error, order) => {
      if (error) {
        console.log(error)
        if (error.status) {
          res.json({
            success: false,
            error: true,
            status: error.status,
            message: error.message
          })
        } else {
          res.status(500).json({ success: false, error: error })
        }
      } else {
        res.status(200).json(order)
      }
    })
  } catch (error) {
    console.log(error)
    if (error.status) {
      res.json({
        success: false,
        error: true,
        status: error.status,
        message: error.message
      })
    } else {
      res.status(500).json({ success: false, error: error })
    }
  }
}

const updateOrderOfUser = async (req, res) => {
  try {
    const id = req.params.id
    let newStatus = parseInt(req.body.newStatus)
    if (newStatus !== 4 && newStatus !== -2) {
      const error = new Error('Invalid status')
      error.status = 6
      throw error
    }
    await updateOrderById(id, newStatus, (error, order) => {
      if (error) {
        console.log(error)
        if (error.status) {
          res.json({
            success: false,
            error: true,
            status: error.status,
            message: error.message
          })
        } else {
          res.status(500).json({ success: false, error: error })
        }
      } else {
        res.status(200).json(order)
      }
    })
  } catch (error) {
    console.log(error)
    if (error.status) {
      res.json({
        success: false,
        error: true,
        status: error.status,
        message: error.message
      })
    } else {
      res.status(500).json({ success: false, error: error })
    }
  }
}

const getAllOrderOfUser = async (req, res) => {
  try {
    const userId = req.params.id
    const statusQuery = req.query.status
    const sorterField = req.query.sorterField
    console.log(
      'userId',
      userId,
      'statusQuery',
      statusQuery,
      'sorterField',
      sorterField
    )
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

    const all = await Order.find(queryObj)
      .populate({
        path: 'user',
        select: 'username email avatar_url address',
        option: sorterField == 'user' ? sorter : {}
      })
      .populate({
        path: 'books.book',
        select: '_id slug name genres coverUrl',
        populate: {
          path: 'genres',
          select: '_id slug name'
        }
      })
      .select(
        '_id user books status paid shippingCost total subTotal voucher address phone message payment createdAt updatedAt'
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

const confirmAnonymousOrder = async (req, res) => {
  try {
    const { token } = req.query
    const anonymousOrder = await AnonymousOrder.findOneAndUpdate(
      {
        verifyToken: token,
        isVerified: false
      },
      { isVerified: true, confirmed: true }
    )
    if (!anonymousOrder) throw new Error('Order does not exist')
    const newOrder = new Order({
      // user: account._id,
      customer: anonymousOrder.customer,
      email: anonymousOrder.email,
      books: anonymousOrder.books,
      status: 0,
      paid: anonymousOrder.paid,
      subTotal: anonymousOrder.subTotal,
      shippingCost: anonymousOrder.shippingCost,
      voucher: anonymousOrder.voucher,
      total: anonymousOrder.total,
      payment: anonymousOrder.payment,
      paypal: {
        _id: anonymousOrder.paypal._id,
        refund: anonymousOrder.paypal.refund
      },
      address: {
        street: anonymousOrder.address.street,
        ward: {
          WardCode: anonymousOrder.address.ward.WardCode,
          WardName: anonymousOrder.address.ward.WardName
        },
        district: {
          DistrictID: anonymousOrder.address.district.DistrictID,
          DistrictName: anonymousOrder.address.district.DistrictName
        },
        province: {
          ProvinceID: anonymousOrder.address.province.ProvinceID,
          ProvinceName: anonymousOrder.address.province.ProvinceName
        }
      },
      phone: anonymousOrder.phone
    })
    const savedOrder = await newOrder.save()
    res.redirect(`${process.env.FRONT_END_HOST}/user/home`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  checkOut,
  createNewOrder,
  createAnonymousOrder,
  getOrders,
  getOrderOfUser,
  updateOrder,
  getAllOrderOfUser,
  updateOrderOfUser,
  updateOrderByAdmin,
  getOrderById,
  confirmAnonymousOrder,
  newOrder
}
