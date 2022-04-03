const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/verify_token')
const accountController = require('../controller/account.controller')

router.post('/setting/:id', verifyToken, accountController.updateAccount)

router.post(
  '/setting/:id/password',
  verifyToken,
  accountController.updatePasswordAccount
)

router.get('/:id/cart', accountController.getAccountCart)

router.post('/:id/cart/', accountController.addBookToCart)

router.delete('/:id/cart/', accountController.pullBookFromCart)

module.exports = router
