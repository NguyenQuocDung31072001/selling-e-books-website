const express = require('express')
const {
  getProvinces,
  getDistricts,
  getWards,
  getShippingCost
} = require('../controller/shipping.controller')
const router = express.Router()

router.get('/province', getProvinces)
router.post('/district', getDistricts)
router.post('/ward', getWards)
router.post('/cost', getShippingCost)

module.exports = router
