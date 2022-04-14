const express = require('express')
const router = express.Router()
const orderController = require('../controller/order.controller')

router.get('/', orderController.getOrders)

router.get('/:id', orderController.getOrderById)

router.put('/:id', orderController.updateOrderByAdmin)

module.exports = router
