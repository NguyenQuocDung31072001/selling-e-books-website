const paypal = require('paypal-rest-sdk')
const updateOrderById = require('../common/updateOrder')
const Order = require('../model/order.model')
const createPayment = async (orderId, res) => {
  try {
    const order = await Order.findById(orderId)
      .populate({
        path: 'books.book',
        select: 'name '
      })
      .populate({ path: 'user', select: 'username address' })
      .lean()

    if (!order) throw new Error('Order does not exist')

    var items = order.books.map(item => {
      return {
        name: item.book.name,
        sku: 'item',
        price: item.price,
        currency: 'USD',
        quantity: item.amount
      }
    })

    var address = order.address
    var name = order.user.username

    var create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `http://localhost:5000/v1/selling_e_books/account/order/payment/${orderId}/success`,
        cancel_url: `http://localhost:5000/v1/selling_e_books/account/order/payment/${orderId}/cancel`
      },
      transactions: [
        {
          item_list: {
            shipping_address: {
              recipient_name: name,
              line1: address.district,
              city: address.ward,
              state: address.province,
              country_code: 'VN'
            },
            items: items
          },
          amount: {
            currency: 'USD',
            total: order.total
          },
          description: 'Hóa đơn mua sách'
        }
      ]
    }

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        await updateOrderById(orderId, -1)
        throw error
      } else {
        payment.links.forEach(link => {
          if (link.rel == 'approval_url') res.status(200).json(link.href)
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

const successOrder = async (req, res) => {
  const orderId = req.params.orderId
  const payerId = req.query.PayerID
  const paymentId = req.query.paymentId
  const order = await Order.findById(orderId)

  if (!order) throw new Error('Order does not exist!')

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: order.total
        }
      }
    ]
  }

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        order.paid = false
        await Promise.all([order.save, updateOrderById(order._id, -1)])
        res.status(400).json(error)
      } else {
        const id = payment.id
        const refundId = payment.transactions[0].related_resources[0].sale.id
        const paypalInfo = {
          _id: id,
          refund: refundId
        }
        order.paid = true
        order.paypal = paypalInfo
        await order.save()
        res.status(200).json(order)
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
  successOrder,
  refundPayment
}
