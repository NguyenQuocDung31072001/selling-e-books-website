const express = require('express')
const {
  createNewVoucher,
  updateVoucher,
  getAllVoucher,
  getVoucher,
  tryApplyVoucher,
  deleteVoucher,
  getAllVoucherForUser
} = require('../controller/voucher.controller')
const router = express.Router()

router.get('/user', getAllVoucherForUser)
router.get('/:code', getVoucher)
router.get('/', getAllVoucher)
router.post('/', createNewVoucher)
router.post('/apply', tryApplyVoucher)
router.delete('/:voucherID', deleteVoucher)
router.put('/:voucherID', updateVoucher)

module.exports = router
