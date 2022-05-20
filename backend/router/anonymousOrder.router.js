const express = require('express')
const {
  getAnonymousOrder,
  updateAnonymousOrder
} = require('../controller/anonymousOrder.controller')
const { confirmAnonymousOrder } = require('../controller/order.controller')
const router = express.Router()

router.get('/', getAnonymousOrder)
router.put('/:orderID', updateAnonymousOrder)

module.exports = router
