const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/verify_token')
const accountController = require('../controller/account.controller')
const orderController = require('../controller/order.controller')
const paymentController = require('../controller/payment.controller')
const collectionController = require('../controller/collection.controller')
const { refundPayment } = require('../controller/payment.controller')

router.post('/forgot', accountController.forgotPassword)
router.post('/forgot/check', accountController.checkVerifyCode)
router.post('/forgot/reset', accountController.resetPassword)

router.post('/setting/:id', verifyToken, accountController.updateAccount)

router.post(
  '/setting/:id/password',
  verifyToken,
  accountController.updatePasswordAccount
)
router.post('/payment/:id', refundPayment)

router.get('/order/payment/:orderId/success', paymentController.successOrder)

router.get('/:id/bought', accountController.getAccountLibraries)

router.get('/:id/review', accountController.getAllBookReview) //lấy các sách đã review

router.get('/:id/cart', accountController.getAccountCart)

router.post('/:id/cart', accountController.addBookToCart)

router.delete('/:id/cart', accountController.pullBookFromCart)

router.get('/:id/yourOrder', orderController.getAllOrderOfUser)

router.get('/:userId/yourOrder/:id', orderController.getOrderOfUser)

router.put('/:userId/yourOrder/:id', orderController.updateOrderOfUser)

router.post('/:userId/yourOrder', orderController.createNewOrder)

router.get('/order/payment/:orderId/cancel', (req, res) => {
  res.redirect(`${process.env.FRONT_END_HOST}`)
})

router.get('/:userId/collection', collectionController.getCollectionOfAccount)
router.post('/:userId/collection', collectionController.createNewCollection)
router.post(
  '/:userId/collection/:collectionId/book',
  collectionController.addFavoriteBook
)
router.delete(
  '/:userId/collection/:collectionId/book',
  collectionController.removeFavoriteBook
)
router.get(
  '/:userId/collection/:collectionId',
  collectionController.getCollectionById
)
router.delete(
  '/:userId/collection/:collectionId',
  collectionController.deleteCollection
)

router.get('/:userId/shipping', accountController.getAccountShipping)

module.exports = router
