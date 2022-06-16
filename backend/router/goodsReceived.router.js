const express = require('express')
const router = express.Router()
const GoodsReceivedController = require('../controller/goodsReceived.controller')

router.get('/', GoodsReceivedController.getAllGoodsReceived)
router.post('/', GoodsReceivedController.createNewGoodsReceived)

module.exports = router
