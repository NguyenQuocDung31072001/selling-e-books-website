const express = require('express')
const router = express.Router()
const BookController = require('../controller/book.controller')

router.get('/:slug', BookController.GetBook)
router.get('/', BookController.GetAllBook)
router.post('/', BookController.CreateNewBook)
router.delete('/:id', BookController.SoftDelete)
router.delete('/delete/:id', BookController.DeleteBook)

module.exports = router
