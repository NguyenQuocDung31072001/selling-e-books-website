const { default: mongoose } = require('mongoose')
const GenreModel = require('../model/genres.model')
const BookModel = require('../model/book.model')
const AuthorController = require('../controller/author.controller')
const generateSlug = require('../common/slug')

const GetAllGenre = async (req, res) => {
  try {
    const allGenres = await GenreModel.find({ deleted: false }).lean()
    res.status(200).json(allGenres)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getDeletedGenre = async (req, res) => {
  try {
    const deletedGenres = await GenreModel.find({ deleted: true }).lean()
    res.status(200).json(deletedGenres)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const GetGenre = async (req, res) => {
  try {
    const perPage = 20
    const page = req.query.page || 1
    const slug = req.params.slug
    const genre = await GenreModel.find({ slug: slug })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: 'books',
        match: { deleted: false },
        select: 'slug name cover'
      })
    res.status(200).json(genre)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const CreateNewGenre = async (req, res) => {
  try {
    const slug = await generateSlug(GenreModel, req.body.name)
    console.log(slug)
    const newGenre = new GenreModel({
      slug: slug,
      name: req.body.name,
      description: req.body.description,
      books: [],
      deleted: false
    })

    const savedGenre = await newGenre.save()
    res.status(200).json(savedGenre)
  } catch (error) {
    console.log({ NewGenreError: error })
    res.status(500).json(error)
  }
}

const UpdateGenre = async (req, res) => {
  try {
    const genreId = req.params.id
    if (!mongoose.isValidObjectId(genreId)) throw new Error('Invalid genre id')
    const updateInfo = {
      name: req.body.name,
      description: req.body.description
    }
    if (!updateInfo.name) delete updateInfo.name
    if (!updateInfo.description) delete updateInfo.description
    const updatedGenre = await GenreModel.findByIdAndUpdate(
      genreId,
      updateInfo,
      { new: true }
    )
    res.status(200).json(updatedGenre)
  } catch (error) {
    console.log({ UpdateGenreError: error })
    req.status(500).json(error)
  }
}

const SoftDelete = async (req, res) => {
  try {
    const genreId = req.params.id
    //Check valid id
    if (!mongoose.isValidObjectId(genreId)) throw new Error('Invalid genre id')
    //Find and check valid genre by id
    const currentGenre = await GenreModel.findById(genreId)
    if (!currentGenre) throw new Error('Invalid genre id')

    //Update book
    const updatedBooks = BookModel.updateMany(
      { _id: { $in: currentGenre.books } },
      { $pull: { genres: currentGenre._id } }
    )
    currentGenre.deleted = true
    const deletedGenre = currentGenre.save()
    const result = await Promise.all([updatedBooks, deletedGenre])
    res.status(200).json(result[1])
  } catch (error) {
    console.log({ SoftDeleteGenre: error })
    res.status(500).json(error)
  }
}

const Delete = async (req, res) => {
  try {
    const genreId = req.params.id
    //Check valid id
    // if (!mongoose.isValidObjectId(genreId)) throw new Error('Invalid genre id')
    //Find and check genre by id
    const currentGenre = await GenreModel.findById(genreId)
    if (!currentGenre) throw new Error('Invalid genre id')

    //Update book
    const updatedBooks = BookModel.updateMany(
      { _id: { $in: currentGenre.books } },
      { $pull: { genres: currentGenre._id } }
    )
    //Delete Genre
    const deletedGenre = GenreModel.deleteOne({ _id: genreId })
    await Promise.all([updatedBooks, deletedGenre])
    res.status(200).json({ success: true })
  } catch (error) {
    console.log({ deleteGenreError: error })
    res.status(500).json(error)
  }
}

const Restore = async (req, res) => {
  try {
    const genreId = req.params.id
    if (!mongoose.isValidObjectId(genreId)) throw new Error('invalid genre id')
    const restoredGenre = await GenreModel.findByIdAndUpdate(
      genreId,
      { deleted: false },
      { new: true }
    )
    if (!restoredGenre) throw new Error('Invalid genre id')

    //Update book
    const updatedBooks = await BookModel.updateMany(
      {
        _id: { $in: restoredGenre.books },
        genres: { $ne: restoredGenre._id }
      },
      { $push: { genres: restoredGenre._id } }
    )
    //remove deleted property in restoredGenre object
    delete restoredGenre.deleted
    res.status(200).json(restoredGenre)
  } catch (error) {
    console.log({
      restoreGenreError: error
    })
    res.status(500).json(error)
  }
}

const AddBook = async (genreId, bookId) => {
  try {
    if (!mongoose.isValidObjectId(genreId)) throw new Error('Invalid genre id')
    if (!mongoose.isValidObjectId(bookId)) throw new Error('Invalid book id')
    const updatedGenre = await GenreModel.findOneAndUpdate(
      { _id: genreId },
      { $push: { books: { _id: bookId, deleted: false } } },
      { new: true }
    )
    //remove deleted prop
    delete updatedGenre.deleted
    res.status(200).json(updatedGenre)
  } catch (error) {
    console.log({ GenreAddBookError: error })
    res.status(500).json(error)
  }
}

const AddBooks = async (genreId, bookIds) => {
  try {
    if (!mongoose.isValidObjectId(genreId)) throw new Error('Invalid genre id')
    if (!mongoose.isValidObjectId(bookId)) throw new Error('Invalid book id')
    //get new book list
    let newBooks = bookIds.map(id => {
      if (!mongoose.isValidObjectId(bookId))
        throw new Error(`${id} is invalid book id`)
      return { _id: id, deleted: false }
    })
    const updatedGenre = await GenreModel.findOneAndUpdate(
      { _id: genreId },
      { $push: { books: { $each: newBooks } } },
      { new: true }
    )
    //remove deleted prop
    delete updatedGenre.deleted
    res.status(200).json(updatedGenre)
  } catch (error) {
    console.log({ GenreAddBookError: error })
    res.status(500).json(error)
  }
}

const SoftDeleteBooks = async bookIds => {
  try {
    const updatedGenre = await GenreModel.updateMany(
      { 'books._id': { $in: bookIds } },
      { 'books.$.deleted': true }
    )
    return { success: true, data: updatedGenre }
  } catch (error) {
    console.log({ DeleteBooksError: error })
    throw new Error('Update fail')
  }
}

const DeleteBooks = async bookIds => {
  try {
    const updatedGenre = await GenreModel.updateMany(
      { 'books._id': { $in: bookIds } },
      { $pull: { books: { _id: { $in: bookIds } } } }
    )
    return { success: true, data: updatedGenre }
  } catch (error) {
    console.log({ DeleteBooksError: error })
    throw new Error('Update fail')
  }
}

module.exports = {
  GetGenre,
  GetAllGenre,
  getDeletedGenre,
  CreateNewGenre,
  UpdateGenre,
  SoftDelete,
  Delete,
  Restore,
  AddBook,
  AddBooks,
  DeleteBooks,
  SoftDeleteBooks
}
