const express = require('express')
const router = express.Router()
const AuthorController = require('../controller/author.controller')
const GenreController = require('../controller/genre.controller')
const BookController = require('../controller/book.controller')

router.get('/:slug/books', BookController.GetBookOfGenre)

router.get('/:slug', GenreController.GetGenre)

router.get('/', GenreController.GetAllGenre)

router.post('/', GenreController.CreateNewGenre)

router.put('/restore/:id', GenreController.Restore)

router.put('/:id', GenreController.UpdateGenre)

router.delete('/delete/:id', GenreController.Delete)

router.delete('/:id', GenreController.SoftDelete)

module.exports = router
