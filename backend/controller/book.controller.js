const { default: mongoose } = require('mongoose')
const BookModel = require('../model/book.model')
const LanguageModel = require('../model/language.model')
const Account = require('../model/account.model')
const AuthorModel = require('../model/author.model')
const GenreModel = require('../model/genres.model')
const Review = require('../model/review.model')
const generateSlug = require('../common/slug')
const UpdateModel = require('../common/updateModel')
const uploadImage = require('../common/uploadImage')
const { searchAuthor } = require('./author.controller')
const { searchGenres } = require('./genre.controller')

const CreateNewBook = async (req, res) => {
  try {
    const slug = await generateSlug(BookModel, req.body.name)
    const genre = await GenreModel.findById(req.body.genres)
    const genreIds = genre._id

    // const genreIds = req.body.genres ? [].concat(req.body.genres) : []
    const author = await AuthorModel.findById(req.body.authors)
    const authorIds = author._id
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
      historicalSold: 0,
      historicalReviewed: 0,
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
    res.status(200).json({ success: true, message: '', book: savedBook })
  } catch (error) {
    console.log({ CreateNewBookError: error })
    res.status(500).json({ success: false, message: 'Create fail', book: null })
  }
}

const UpdateBook = async (req, res) => {
  try {
    const bookId = req.params.id

    const genre = await GenreModel.findById(req.body.genres)
    const genreIds = genre._id

    const author = await AuthorModel.findById(req.body.authors)
    const authorIds = author._id

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
      updateInfo
      // { new: true }
    )

    if (!updatedBook) throw new Error('Book does not exist')

    if (newName && newName.toLowerCase() != updatedBook.name.toLowerCase()) {
      const slug = await generateSlug(BookModel, req.body.name)
      updatedBook.slug = slug
      updatedBook.name = req.body.name
    }
    await Promise.all([
      UpdateModel.RemoveBook(AuthorModel, updatedBook.authors, updatedBook._id),
      UpdateModel.RemoveBook(GenreModel, updatedBook.genres, updatedBook._id)
    ])
    const [newAuthor, newGenre] = await Promise.all([
      UpdateModel.AddBook(AuthorModel, [].concat(authorIds), updatedBook._id),
      UpdateModel.AddBook(GenreModel, [].concat(genreIds), updatedBook._id)
    ])

    if (req.body.base64Image) {
      await uploadImage(
        updatedBook,
        'coverId',
        'coverUrl',
        req.body.base64Image
      )
    }

    await updatedBook.save()
    const responseBook = {
      ...updatedBook._doc,
      genres: [newGenre],
      authors: [newAuthor]
    }

    res.status(200).json({
      success: true,
      message: '',
      book: { ...responseBook, genre_slug: genre.slug }
    })
  } catch (error) {
    console.log({ CreateNewBookError: error })
    res
      .status(500)
      .json({ success: false, message: 'Update failed', book: null })
  }
}

const GetAllBook = async (req, res) => {
  try {
    // const allAccount=await Account.find()
    // allAccount.forEach((account,index)=>{
    //   if(account.library.includes(books[0]._id)){
    //     totalBookBought++
    //   }
    // })
    // books[0].avarageRating=totalRating/allReviewOfBook.length
    const queryObj = { deleted: false }

    const perPage = 100
    const page = req.query.page || 1

    const { search, author, genre, maxPrice, minPrice } = req.query

    if (author || genre) {
      let regex = new RegExp(search, 'i')
      queryObj.name = regex
      if (author) {
        const authors = await searchAuthor({ slug: author })
        queryObj.authors = authors[0]._id
      }
      if (genre) {
        const genres = await searchGenres({ slug: genre })
        queryObj.genres = genres[0]._id
      }

      if (maxPrice || minPrice) queryObj['$and'] = []
      if (minPrice) queryObj['$and'].push({ price: { $gte: minPrice } })
      if (maxPrice) queryObj['$and'].push({ price: { $lte: maxPrice } })
    } else {
      if (search) {
        let regex = new RegExp(search, 'i')
        const authorQuery = {
          deleted: false,
          fullName: regex
        }
        const authors = await searchAuthor(authorQuery)
        const genreQuery = {
          deleted: false,
          name: regex
        }
        const genres = await searchGenres(genreQuery)
        queryObj['$or'] = [
          { name: regex },
          { genres: { $in: genres } },
          { authors: { $in: authors } }
        ]
      }

      if (maxPrice || minPrice) queryObj['$and'] = []
      if (minPrice) queryObj['$and'].push({ price: { $gte: minPrice } })
      if (maxPrice) queryObj['$and'].push({ price: { $lte: maxPrice } })
    }

    const maxItem = await BookModel.countDocuments(queryObj)
    const maxPage = Math.ceil(maxItem / perPage)
    const books = await getBooks(queryObj, page, perPage)

    res.status(200).json({
      currentPage: page,
      maxPage: maxPage,
      books: books
    })
  } catch (error) {
    // console.log({ GetBookError: error })
    res.status(500).json(error)
  }
}

const GetAllBookForUser = async (req, res) => {
  try {
    const queryObj = { deleted: false }

    const perPage = 100
    const page = req.query.page || 1

    const { search, author, genre, maxPrice, minPrice } = req.query

    if (author || genre) {
      let regex = new RegExp(search, 'i')
      queryObj.name = regex
      if (author) {
        const authors = await searchAuthor({ slug: author })
        queryObj.authors = authors[0]._id
      }
      if (genre) {
        const genres = await searchGenres({ slug: genre })
        queryObj.genres = genres[0]._id
      }

      if (maxPrice || minPrice) queryObj['$and'] = []
      if (minPrice) queryObj['$and'].push({ price: { $gte: minPrice } })
      if (maxPrice) queryObj['$and'].push({ price: { $lte: maxPrice } })
    } else {
      if (search) {
        let regex = new RegExp(search, 'i')
        const authorQuery = {
          deleted: false,
          fullName: regex
        }
        const authors = await searchAuthor(authorQuery)
        const genreQuery = {
          deleted: false,
          name: regex
        }
        const genres = await searchGenres(genreQuery)
        queryObj['$or'] = [
          { name: regex },
          { genres: { $in: genres } },
          { authors: { $in: authors } }
        ]
      }

      if (maxPrice || minPrice) queryObj['$and'] = []
      if (minPrice) queryObj['$and'].push({ price: { $gte: minPrice } })
      if (maxPrice) queryObj['$and'].push({ price: { $lte: maxPrice } })
    }

    const maxItem = await BookModel.countDocuments(queryObj)
    const maxPage = Math.ceil(maxItem / perPage)
    const books = await getBooksForUser(queryObj, page, perPage)

    res.status(200).json({
      currentPage: page,
      maxPage: maxPage,
      books: books
    })
  } catch (error) {
    // console.log({ GetBookError: error })
    res.status(500).json(error)
  }
}

const GetBook = async (req, res) => {
  try {
    const slug = req.params.slug
    // console.log(slug)
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
    if (!genre) {
      return res.status(200).json('')
    }
    // if (!genre) throw new Error('Genre does not exist')
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
    if (!author) {
      return res.status(200).json('')
    }
    // if (!author) throw new Error('Author does not exist')
    const maxItem = await BookModel.countDocuments({ author: author._id })
    const maxPage = Math.ceil(maxItem / perPage)
    const books = await getBooks(
      { authors: author._id, deleted: false },
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

  const allAccount = await Account.find()

  if (books.length > 1) {
    for (let i = 0; i < books.length; i++) {
      let allReviewOfBook = await Review.find({ book: books[i]._id })
      let totalRating = 0
      allReviewOfBook.forEach(value => {
        totalRating += value.rating
      })
      books[i].avarageRating = totalRating / allReviewOfBook.length
    }
  } else if (books.length === 1) {
    let totalBookBought = 0
    allAccount.forEach((account, index) => {
      if (account.library.includes(books[0]._id)) {
        totalBookBought++
      }
    })
    const allReviewOfBook = await Review.find({ book: books[0]._id })
    let totalRating = 0
    allReviewOfBook.forEach((value, index) => {
      totalRating += value.rating
    })
    books[0].avarageRating = totalRating / allReviewOfBook.length
    books[0].countReview = allReviewOfBook.length
    books[0].countBookBought = totalBookBought
  }

  return books
}

const getBooksForUser = async (query, page, perPage) => {
  const books = await BookModel.find(query)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate({ path: 'genres', select: '_id slug name' })
    .populate({ path: 'authors', select: '_id slug fullName birthDate' })
    .populate('language')
    .lean()

  const allAccount = await Account.find()

  if (books.length > 1) {
    for (let i = 0; i < books.length; i++) {
      if (books[i].genres.length === 0 || books[i].authors.length === 0)
        books.splice(i, 1)
      else {
        let allReviewOfBook = await Review.find({ book: books[i]._id })
        let totalRating = 0
        allReviewOfBook.forEach(value => {
          totalRating += value.rating
        })
        books[i].avarageRating = totalRating / allReviewOfBook.length
      }
    }
  } else if (books.length === 1) {
    let totalBookBought = 0
    allAccount.forEach((account, index) => {
      if (account.library.includes(books[0]._id)) {
        totalBookBought++
      }
    })
    const allReviewOfBook = await Review.find({ book: books[0]._id })
    let totalRating = 0
    allReviewOfBook.forEach((value, index) => {
      totalRating += value.rating
    })
    books[0].avarageRating = totalRating / allReviewOfBook.length
    books[0].countReview = allReviewOfBook.length
    books[0].countBookBought = totalBookBought
  }

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
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log({ SoftDeleteBookError: error })
    res.status(500).json({ success: false, message: error })
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

const GetTop = async (req, res) => {
  try {
    const { top, field } = req.query
    const newArray = []
    const books = await BookModel.find({})
      .sort({ [field]: -1 })
      .limit(top)
      .populate('authors')
      .populate('genres')
    if (field === 'rating') {
      for (let i = 0; i < books.length; i++) {
        let allReviewOfBook = await Review.find({ book: books[i]._id })
        let totalRating = 0
        allReviewOfBook.forEach(value => {
          totalRating += value.rating
        })
        books[i].avarageRating = totalRating / allReviewOfBook.length
      }
      for (let i = 0; i < books.length; i++) {
        newArray.push({
          ...books[i]._doc,
          avarageRating: books[i].avarageRating > 0 ? books[i].avarageRating : 0
        })
      }
      newArray.sort((a, b) => b.avarageRating - a.avarageRating)
    }
    return res.status(200).json(field === 'rating' ? newArray : books)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

module.exports = {
  CreateNewBook,
  UpdateBook,
  GetAllBook,
  GetAllBookForUser,
  GetBookOfGenre,
  getBookOfAuthor,
  SoftDelete,
  DeleteBook,
  GetBook,
  GetTop
}
