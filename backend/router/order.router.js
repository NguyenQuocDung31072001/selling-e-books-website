const express = require('express')
const router = express.Router()
const orderController = require('../controller/order.controller')
const paymentController = require('../controller/payment.controller')
const convertCurrency = require('../utils/currency')
router.get('/', orderController.getOrders)
router.get('/verify', orderController.confirmAnonymousOrder)

router.get(
  '/anonymous/:orderId/success',
  paymentController.successAnonymousOrder
)
router.get('/anonymous/:orderId/cancel', (req, res) => {
  res.redirect(`${process.env.FRONT_END_HOST}`)
})

router.get('/checkAPI', async (req, res) => {
  try {
    const result = await convertCurrency(20000)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
})

router.get('/:id', orderController.getOrderById)

router.put('/:id', orderController.updateOrderByAdmin)

// router.post('/', orderController.createAnonymousOrder)

router.post('/', orderController.newOrder)

module.exports = router
