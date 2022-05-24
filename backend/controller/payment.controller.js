const paypal = require('paypal-rest-sdk')
const AnonymousOrder = require('../model/anonymousOrder.model')
const Order = require('../model/order.model')
const crypto = require('crypto')
const { sendConfirmOrderEmail } = require('../utils/senEmail')
const convertCurrency = require('../utils/currency')
const createPayment = async (orderId, res) => {
  try {
    let rate = await convertCurrency()
    rate *= 100
    const order = await Order.findById(orderId)
      .populate({
        path: 'books.book',
        select: 'name '
      })
      .populate({ path: 'user', select: 'username address' })
      .lean()

    if (!order) {
      const error = new Error('Order does not exist')
      error.status = 7
      throw error
    }
    let subTotal = 0
    var items = order.books.map(item => {
      subTotal += (Math.round(item.price * rate) / 100) * item.amount
      return {
        name: item.book.name,
        sku: 'item',
        price: Math.round(item.price * rate) / 100,
        currency: 'USD',
        quantity: item.amount
      }
    })

    let address = order.address
    let name = order.user.username
    let total =
      subTotal +
      Math.round(order.shippingCost * rate) / 100 -
      (order.voucher ? Math.round(order.voucher.discount * rate) / 100 : 0)
    total = Math.round(total * 100) / 100
    await Order.updateOne({ _id: orderId }, { 'paypal.totalExecute': total })

    var create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.HOST}/account/order/payment/${orderId}/success`,
        cancel_url: `${process.env.HOST}/account/order/payment/${orderId}/cancel`
      },
      transactions: [
        {
          item_list: {
            shipping_address: {
              recipient_name: name,
              line1: address.ward.WardName,
              city: address.district.DistrictName,
              state: address.province.ProvinceName,
              country_code: 'VN'
            },
            items: items
          },
          amount: {
            currency: 'USD',
            total: total,
            details: {
              subtotal: subTotal,
              shipping: Math.round(order.shippingCost * rate) / 100,
              shipping_discount: order.voucher
                ? Math.round(order.voucher.discount * rate) / 100
                : 0
            }
          },
          description: 'Hóa đơn mua sách'
        }
      ]
    }

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        console.log(error)
        const { updateOrderById } = require('../common/updateOrder')
        await updateOrderById(orderId, -1, (error, response) => {
          res.status(200).json({
            success: false,
            redirect: true,
            redirectTo: `${process.env.FRONT_END_HOST}/user/home`,
            order: null
          })
        })
      } else {
        payment.links.forEach(link => {
          if (link.rel == 'approval_url') {
            res.status(200).json({
              success: true,
              redirect: true,
              redirectTo: link.href,
              order: null
            })
          }
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(503).json({
      success: false,
      redirect: true,
      redirectTo: `${process.env.FRONT_END_HOST}/user/home`,
      order: null
    })
  }
}

const createAnonymousPayment = async (orderId, res) => {
  try {
    let rate = await convertCurrency()
    rate *= 100
    const order = await AnonymousOrder.findById(orderId)
      .populate({
        path: 'books.book',
        select: 'name '
      })
      .lean()

    if (!order) {
      const error = new Error('Order does not exist')
      error.status = 7
      throw error
    }
    let subTotal = 0
    var items = order.books.map(item => {
      subTotal += (Math.round(item.price * rate) / 100) * item.amount
      return {
        name: item.book.name,
        sku: 'item',
        price: Math.round(item.price * rate) / 100,
        currency: 'USD',
        quantity: item.amount
      }
    })

    let address = order.address
    let name = order.customer
    let total =
      subTotal +
      Math.round(order.shippingCost * rate) / 100 -
      (order.voucher ? Math.round(order.voucher.discount * rate) / 100 : 0)
    total = Math.round(total * 100) / 100
    await AnonymousOrder.updateOne(
      { _id: orderId },
      {
        'paypal.totalExecute': total
      }
    )

    let create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.HOST}/order/anonymous/${orderId}/success`,
        cancel_url: `${process.env.HOST}/order/anonymous/${orderId}/cancel`
      },
      transactions: [
        {
          item_list: {
            shipping_address: {
              recipient_name: name,
              line1: address.ward.WardName,
              city: address.district.DistrictName,
              state: address.province.ProvinceName,
              country_code: 'VN'
            },
            items: items
          },
          amount: {
            currency: 'USD',
            total: total,
            details: {
              subtotal: subTotal,
              shipping: Math.round(order.shippingCost * rate) / 100,
              shipping_discount: order.voucher
                ? Math.round(order.voucher.discount * rate) / 100
                : 0
            }
          },
          description: 'Hóa đơn mua sách'
        }
      ]
    }

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        res.status(200).json({
          success: false,
          redirect: true,
          message: 'Thanh toán không thành công',
          redirectTo: `${process.env.FRONT_END_HOST}/user/home`,
          order: null
        })
      } else {
        payment.links.forEach(link => {
          if (link.rel == 'approval_url') {
            res.status(200).json({
              success: true,
              redirect: true,
              message: 'Thanh toán thành công',
              redirectTo: link.href,
              order: null
            })
          }
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(503).json({
      success: false,
      redirect: true,
      redirectTo: `${process.env.FRONT_END_HOST}`,
      order: null
    })
  }
}

const successOrder = async (req, res) => {
  const orderId = req.params.orderId
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId
  const order = await Order.findById(orderId)

  if (!order) {
    const error = new Error('Order does not exist!')
    error.status = 7
    throw error
  }

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: order.paypal.totalExecute
        }
      }
    ]
  }

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        const { updateOrderById } = require('../common/updateOrder')
        order.paid = false
        await Promise.all([
          order.save(),
          updateOrderById(order._id, -1, () => {})
        ])
        res.redirect(`${process.env.FRONT_END_HOST}/user/purchase`)
      } else {
        const id = payment.id
        const refundId = payment.transactions[0].related_resources[0].sale.id
        const paypalInfo = {
          _id: id,
          refund: refundId,
          totalExecute: order.paypal.totalExecute
        }
        order.paid = true
        order.paypal = paypalInfo
        await order.save()
        res.redirect(`${process.env.FRONT_END_HOST}/user/purchase`)
      }
    }
  )
}

const successAnonymousOrder = async (req, res) => {
  const orderId = req.params.orderId
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId
  const order = await AnonymousOrder.findById(orderId)

  if (!order) {
    const error = new Error('Order does not exist!')
    error.status = 7
    throw error
  }

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: order.paypal.totalExecute
        }
      }
    ]
  }

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log('execute', error)
        res.redirect(`${process.env.FRONT_END_HOST}`)
      } else {
        const id = payment.id
        const refundId = payment.transactions[0].related_resources[0].sale.id
        const paypalInfo = {
          _id: id,
          refund: refundId,
          totalExecute: order.paypal.totalExecute
        }
        order.paid = true
        order.paypal = paypalInfo
        await order.save()

        const popOrder = await AnonymousOrder.findById(order._id).populate({
          path: 'books.book',
          select: '_id slug name coverUrl'
        })
        await sendConfirmOrderEmail(popOrder.email, popOrder)
        res.redirect(`${process.env.FRONT_END_HOST}`)
      }
    }
  )
}

const refundPayment = (id, callback) => {
  paypal.sale.refund(id, {}, (error, response) => {
    callback(error, response)
  })
}

module.exports = {
  createPayment,
  createAnonymousPayment,
  successOrder,
  successAnonymousOrder,
  refundPayment
}
