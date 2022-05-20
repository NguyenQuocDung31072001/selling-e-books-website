const { PAYMENT_METHOD } = require('../common/constant')
const { restoreBooks } = require('../common/updateOrder')
const AnonymousOrder = require('../model/anonymousOrder.model')
const { refundPayment } = require('./payment.controller')
const Order = require('../model/order.model')
const getAnonymousOrder = async (req, res) => {
  try {
    const { verified, payment, paid, sorterField, from, to, customer, page } =
      req.query

    const queryObj = {}
    if (verified != undefined) queryObj.isVerified = verified
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
    const all = await AnonymousOrder.find(queryObj)
      .populate({
        path: 'books.book',
        select: '_id slug name coverUrl'
      })
      .select(
        '_id books status paid shippingCost total address phone payment createdAt updatedAt email customer isVerified confirmed'
      )
      .sort(sorterField && sorterField != 'user' ? sorter : { updatedAt: -1 })
      .lean()
    all.forEach(order => {
      order.paymentMethod = PAYMENT_METHOD[order.payment]
    })
    res.status(200).json(all)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
}

const updateAnonymousOrder = async (req, res) => {
  try {
    console.log(req.body._id, req.body.confirmed)

    if (req.body.confirmed) {
      return await confirmAnonymousOrder(req, res)
    } else {
      return await refuseAnonymousOrder(req, res)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const confirmAnonymousOrder = async (req, res) => {
  try {
    const orderID = req.body._id
    let anonymousOrder = await AnonymousOrder.findOneAndUpdate(
      {
        _id: orderID,
        isVerified: false
      },
      { isVerified: true, confirmed: true },
      { new: true }
    )
      .populate({
        path: 'books.book',
        select: '_id slug name coverUrl'
      })
      .select(
        '_id books status paid shippingCost subTotal total address phone payment createdAt updatedAt email customer isVerified confirmed paypal voucher'
      )
      .lean()
    if (!anonymousOrder) throw new Error('Order does not exist')
    const newOrder = new Order({
      // user: account._id,
      customer: anonymousOrder.customer,
      email: anonymousOrder.email,
      books: anonymousOrder.books,
      status: 0,
      paid: anonymousOrder.paid,
      shippingCost: anonymousOrder.shippingCost,
      subTotal: anonymousOrder.subTotal,
      total: anonymousOrder.total,
      payment: anonymousOrder.payment,
      paypal: anonymousOrder.paypal,
      voucher: anonymousOrder.voucher,
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
    await newOrder.save()
    delete anonymousOrder.paypal
    anonymousOrder.paymentMethod = PAYMENT_METHOD[anonymousOrder.payment]
    res.json(anonymousOrder)
  } catch (error) {
    console.log(error)
    throw error
  }
}

const refuseAnonymousOrder = async (req, res) => {
  try {
    const orderID = req.body._id
    const anonymousOrder = await AnonymousOrder.findOneAndUpdate(
      {
        _id: orderID,
        isVerified: false
      },
      { isVerified: true, confirmed: false },
      { new: true }
    )
      .populate({
        path: 'books.book',
        select: '_id slug name coverUrl'
      })
      .select(
        '_id books status paid shippingCost subTotal total address phone payment createdAt updatedAt email customer isVerified confirmed paypal voucher'
      )
      .lean()
    if (!anonymousOrder) throw new Error('Order does not exist')
    if (anonymousOrder.payment === 1 && anonymousOrder.paid) {
      refundPayment(anonymousOrder.paypal.refund, async (error, response) => {
        if (error) {
          console.log(error)
          res.status(500)
        } else {
          // await restoreBooks(anonymousOrder.books)
          const asyncAnonymousOrder = AnonymousOrder.findByIdAndUpdate(
            {
              _id: orderID
            },
            { refund: true },
            { new: true }
          )
            .populate({
              path: 'books.book',
              select: '_id slug name coverUrl'
            })
            .select(
              '_id books status paid shippingCost total address phone payment createdAt updatedAt email customer isVerified confirmed'
            )
            .lean()
          // await anonymousOrder.save()
          const [restoredBooks, updatedAnonymousOrder] = await Promise.all([
            restoreBooks(anonymousOrder.books),
            asyncAnonymousOrder
          ])
          updatedAnonymousOrder.paymentMethod =
            PAYMENT_METHOD[updatedAnonymousOrder.payment]
          res.status(200).json(updatedAnonymousOrder)
        }
      })
    } else {
      await restoreBooks(anonymousOrder.books)
      delete anonymousOrder.paypal
      anonymousOrder.paymentMethod = PAYMENT_METHOD[anonymousOrder.payment]
      res.status(200).json(anonymousOrder)
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  getAnonymousOrder,
  confirmAnonymousOrder,
  refuseAnonymousOrder,
  updateAnonymousOrder
}
