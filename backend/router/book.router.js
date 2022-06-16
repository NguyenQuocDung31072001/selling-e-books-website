const express = require('express')
const router = express.Router()
const BookController = require('../controller/book.controller')

router.get('/admin', BookController.GetAllBook)
router.get('/top', BookController.GetTop)
router.delete('/delete/:id', BookController.DeleteBook)
router.get('/:slug', BookController.GetBook)
router.put('/:id', BookController.UpdateBook)
router.delete('/:id', BookController.SoftDelete)
router.get('/', BookController.GetAllBookForUser)
router.post('/', BookController.CreateNewBook)

module.exports = router
