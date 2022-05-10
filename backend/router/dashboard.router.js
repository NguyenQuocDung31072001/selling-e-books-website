const express = require('express')
const router = express.Router()
const DashboardController = require('../controller/dashboard.controller')
router.get('/revenue', DashboardController.getRevenue)
router.get('/accounts', DashboardController.getAccounts)
router.get('/book', DashboardController.getBookData)
router.get('/genres', DashboardController.getGenreData)
router.get('/authors', DashboardController.getAuthorsData)
module.exports = router
