const { default: mongoose } = require('mongoose')
const BookModel = require('../model/book.model')
const LanguageModel = require('../model/language.model')
const AuthorModel = require('../model/author.model')
const GenreModel = require('../model/genres.model')
const generateSlug = require('../common/slug')
const UpdateModel = require('../common/updateModel')

const CreateNewBook = async (req, res) => {
  try {
    const slug = await generateSlug(BookModel, req.body.name)
    const genreIds = req.body.genres ? [].concat(req.body.genres) : []
    const authorIds = req.body.authors ? [].concat(req.body.authors) : []

    const newBook = new BookModel({
      slug: slug,
      name: req.body.name,
      cover: req.body.cover,
      genres: genreIds,
      authors: authorIds,
      description: req.body.description,
      detail: {
        format: parseInt(req.body.format),
        language: new mongoose.Types.ObjectId(req.body.language),
        pages: parseInt(req.body.pages),
        publishedBy: req.body.publishedBy
      },
      rating: 0,
      reviews: [],
      deleted: false
    })
    const savedBook = await newBook.save()
    const updatedAuthors = UpdateModel.AddBook(
      AuthorModel,
      authorIds,
      savedBook._id
    )
    const updatedGenres = UpdateModel.AddBook(
      GenreModel,
      genreIds,
      savedBook._id
    )

    await Promise.all([updatedGenres, updatedAuthors])
    res.status(200).json(savedBook)
  } catch (error) {
    console.log({ CreateNewBookError: error })
    res.status(500).json(error)
  }
}

const UpdateBook = async (req, res) => {
  try {
    const slug = await generateSlug(BookModel, req.body.name)
    const genreIds = req.body.genres ? [].concat(req.body.genres) : []
    const authorIds = req.body.authors ? [].concat(req.body.authors) : []

    const updatedBook = await BookModel.findOneAndUpdate(
      { slug: slug },
      {
        slug: slug,
        name: req.body.name,
        cover: req.body.cover,
        genres: genreIds,
        authors: authorIds,
        description: req.body.description,
        detail: {
          format: parseInt(req.body.format),
          language: new mongoose.Types.ObjectId(req.body.language),
          pages: parseInt(req.body.pages),
          publishedBy: req.body.publishedBy
        },
        rating: 0,
        reviews: [],
        deleted: false
      },
      { new: true }
    )
    const updatedAuthors = UpdateModel.AddBook(
      AuthorModel,
      authorIds,
      updatedBook._id
    )
    const updatedGenres = UpdateModel.AddBook(
      GenreModel,
      genreIds,
      updatedBook._id
    )

    await Promise.all([updatedGenres, updatedAuthors])
    res.status(200).json(updatedBook)
  } catch (error) {
    console.log({ CreateNewBookError: error })
    res.status(500).json(error)
  }
}

const GetAllBook = async (req, res) => {
  try {
    const perPage = 20
    const page = req.query.page || 1
    const Books = await BookModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({ path: 'genres', select: '_id slug name' })
      .populate({ path: 'authors', select: '_id slug fullName birthDate' })
      .populate('detail.language')
      .lean()
    res.status(200).json(Books)
  } catch (error) {
    console.log({ GetBookError: error })
    res.status(500).json(error)
  }
}

const GetBook = async (req, res) => {
  try {
    const slug = req.params.slug
    const book = await BookModel.findOne({ slug: slug })
      .populate({ path: 'genres', select: '_id slug name' })
      .populate({ path: 'authors', select: '_id slug fullName birthDate' })
      .populate('detail.language')
      .lean()
    res.status(200).json(book)
  } catch (error) {
    console.log({ GetBookError: error })
    res.status(500).json(error)
  }
}

const SoftDelete = async (req, res) => {
  try {
    const bookId = req.params.id
    const deletedBook = await BookModel.findByIdAndUpdate(
      bookId,
      { deleted: true },
      { new: true }
    )
    res.status(200).json(deletedBook)
  } catch (error) {
    console.log({ SoftDeleteBookError: error })
    res.status(500).json(error)
  }
}

const DeleteBook = async (req, res) => {
  try {
    const bookId = req.params.id
    const currentBook = await BookModel.findById(bookId)
    const updatedAuthors = UpdateModel.DeleteBook(AuthorModel, bookId)
    const updatedGenres = UpdateModel.DeleteBook(GenreModel, bookId)
    const deletedBook = BookModel.deleteOne({ _id: bookId })
    await Promise.all([updatedAuthors, updatedGenres, deletedBook])
    res.status(200).json({ success: true })
  } catch (error) {
    console.log({ DeleteBookError: error })
    res.status(500).json(error)
  }
}

module.exports = {
  CreateNewBook,
  UpdateBook,
  GetAllBook,
  SoftDelete,
  DeleteBook,
  GetBook
}
