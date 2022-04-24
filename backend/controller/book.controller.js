const { default: mongoose } = require('mongoose')
const BookModel = require('../model/book.model')
const LanguageModel = require('../model/language.model')
const AuthorModel = require('../model/author.model')
const GenreModel = require('../model/genres.model')
const generateSlug = require('../common/slug')
const UpdateModel = require('../common/updateModel')
const uploadImage = require('../common/uploadImage')

const CreateNewBook = async (req, res) => {
  try {
    const slug = await generateSlug(BookModel, req.body.name)
    const genre=await GenreModel.find({name:req.body.genres})
    const genreIds=genre[0]._id

    // const genreIds = req.body.genres ? [].concat(req.body.genres) : []
     const author=await AuthorModel.findOne({fullName:req.body.authors})
    const authorIds=author._id
    // // const authorIds = req.body.authors ? [].concat(req.body.authors) : []
    // // console.log(authorIds._id)
    const newBook = new BookModel({
      slug: slug,
      name: req.body.name,
      genres: genreIds,
      authors: authorIds,
      description: req.body.description,
      // format: parseInt(req.body.format),
      format: 1,
      language: new mongoose.Types.ObjectId('6229dc343a2e43c8cd9dbd65'),
      pages: parseInt(req.body.pages),
      publishedBy: req.body.publishedBy,
      publishedDate: req.body.publishedDate,
      rating: 0,
      reviews: [],
      deleted: false,
      amount: req.body.amount,
      price: req.body.price
    })

    const propNames = Object.getOwnPropertyNames(newBook)
    propNames.forEach(propName => {
      if (newBook[propName] == null || newBook[propName] == undefined)
        throw new Error(`${propName} is required`)
    })

    await uploadImage(newBook, 'coverId', 'coverUrl', req.body.base64Image)

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
    const bookId = req.params.id

    const genre=await GenreModel.find({name:req.body.genres})
    const genreIds=genre[0]._id
    
    const author=await AuthorModel.findOne({fullName:req.body.authors})
    const authorIds=author._id

    const newName = req.body.name
    const updateInfo = {
      genres: genreIds,
      authors: authorIds,
      description: req.body.description,
      format: parseInt(req.body.format),
      language: new mongoose.Types.ObjectId(req.body.language),
      pages: parseInt(req.body.pages),
      publishedBy: req.body.publishedBy,
      publishedDate: req.body.publishedDate,
      rating: 0,
      reviews: [],
      deleted: false,
      amount: req.body.amount,
      price: req.body.price
    }

    const propNames = Object.getOwnPropertyNames(updateInfo)
    propNames.forEach(propName => {
      if (updateInfo[propName] == null || updateInfo[propName] == undefined)
        delete updateInfo[propName]
    })

    const updatedBook = await BookModel.findOneAndUpdate(
      { _id: bookId },
      updateInfo,
      { new: true }
    )
    if (!updatedBook) throw new Error('Book does not exist')

    if (newName && newName.toLowerCase() != updatedBook.name.toLowerCase()) {
      const slug = await generateSlug(BookModel, req.body.name)
      updatedBook.slug = slug
      updatedBook.name = req.body.name
    }

    if (req.body.base64Image) {
      await uploadImage(
        updatedBook,
        'coverId',
        'coverUrl',
        req.body.base64Image
      )
    }

    await updatedBook.save()
    res.status(200).json({...updatedBook._doc,genre_slug:genre[0].slug})
  } catch (error) {
    console.log({ CreateNewBookError: error })
    res.status(500).json(error)
  }
}

const GetAllBook = async (req, res) => {
  try {
    const perPage = 20
    const page = req.query.page || 1
    const maxItem = await BookModel.countDocuments({ deleted: false })
    const maxPage = Math.ceil(maxItem / perPage)
    const books = await getBooks({ deleted: false }, page, perPage)

    res.status(200).json({
      currentPage: page,
      maxPage: maxPage,
      books: books
    })
  } catch (error) {
    console.log({ GetBookError: error })
    res.status(500).json(error)
  }
}

const GetBook = async (req, res) => {
  try {
    const slug = req.params.slug
    console.log(slug)
    const books = await getBooks({ slug: slug, deleted: false }, 1, 1)
    if (books.length == 0) throw new Error('Book does not exist')
    res.status(200).json(books[0])
  } catch (error) {
    console.log({ GetBookError: error })
    res.status(500).json(error)
  }
}

const GetBookOfGenre = async (req, res) => {
  try {
    const perPage = 20
    const page = req.query.page || 1
    const genreSlug = req.params.slug
    const genre = await GenreModel.findOne({ slug: genreSlug, deleted: false })
    if (!genre) throw new Error('Genre does not exist')
    const maxItem = await BookModel.countDocuments({ genres: genre._id })
    const maxPage = Math.ceil(maxItem / perPage)
    const books = await getBooks(
      { genres: genre._id, deleted: false },
      page,
      perPage
    )
    res.status(200).json({
      currentPage: page,
      maxPage: maxPage,
      genre: genre,
      books: books
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getBookOfAuthor = async (req, res) => {
  try {
    const perPage = 20
    const page = req.query.page || 1
    const authorSlug = req.params.slug
    const author = await AuthorModel.findOne({
      slug: authorSlug,
      deleted: false
    })
    if (!author) throw new Error('Author does not exist')
    const maxItem = await BookModel.countDocuments({ author: author._id })
    const maxPage = Math.ceil(maxItem / perPage)
    const books = await getBooks(
      { author: author._id, deleted: false },
      page,
      perPage
    )
    res.status(200).json({
      currentPage: page,
      maxPage: maxPage,
      author: author,
      books: books
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getBooks = async (query, page, perPage) => {
  const books = await BookModel.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate({ path: 'genres', select: '_id slug name' })
    .populate({ path: 'authors', select: '_id slug fullName birthDate' })
    .populate('language')
    .lean()
  return books
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

const restore = async (req, res) => {
  try {
    const bookId = req.params.id
    const deletedBook = await BookModel.findByIdAndUpdate(
      bookId,
      { deleted: false },
      { new: true }
    )
    res.status(200).json(deletedBook)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
  CreateNewBook,
  UpdateBook,
  GetAllBook,
  GetBookOfGenre,
  getBookOfAuthor,
  SoftDelete,
  DeleteBook,
  GetBook
}
