const express = require('express')
const {
  createNewVoucher,
  updateVoucher,
  getAllVoucher,
  getVoucher,
  tryApplyVoucher,
  deleteVoucher
} = require('../controller/voucher.controller')
const router = express.Router()

router.get('/', getAllVoucher)
router.post('/', createNewVoucher)
router.post('/apply', tryApplyVoucher)
router.delete('/:voucherID', deleteVoucher)
router.put('/:voucherID', updateVoucher)
router.get('/:code', getVoucher)

module.exports = router
