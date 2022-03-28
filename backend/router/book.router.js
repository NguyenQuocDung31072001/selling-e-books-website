const express = require('express')
const router = express.Router()
const BookController = require('../controller/book.controller')

router.get('/:slug', BookController.GetBook)
router.put('/:id', BookController.UpdateBook)
router.delete('/:id', BookController.SoftDelete)
router.get('/', BookController.GetAllBook)
router.post('/', BookController.CreateNewBook)
router.delete('/delete/:id', BookController.DeleteBook)

module.exports = router
