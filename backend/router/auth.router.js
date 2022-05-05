const express = require('express')
const router = express.Router()
const authController = require('../controller/auth.controller')
const verifyEmail = require('../middleware/verify_email')

router.post('/register', authController.register)

router.post('/login', verifyEmail, authController.login)

router.get('/verify', authController.verify)

module.exports = router
