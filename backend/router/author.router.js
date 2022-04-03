const express = require('express')
const router = express.Router()
const AuthorController = require('../controller/author.controller')
const BookController = require('../controller/book.controller')

router.get('/delete', AuthorController.GetDeletedAuthor)

router.get('/:slug/books', BookController.getBookOfAuthor)

router.get('/:slug', AuthorController.GetAuthor)

router.get('/', AuthorController.GetAllAuthor)

router.post('/', AuthorController.CreateNewAuthor)

router.put('/restore/:id', AuthorController.Restore)

router.put('/:id', AuthorController.UpdateAuthor)

router.delete('/delete/:id', AuthorController.Delete)

router.delete('/:id', AuthorController.SoftDelete)

module.exports = router
