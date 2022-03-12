const { default: mongoose } = require('mongoose')
const AuthorModel = require('../model/author.model')
const BookModel = require('../model/book.model')
const GenreController = require('../controller/genre.controller')
const generateSlug = require('../common/slug')

const GetAllAuthor = async (req, res) => {
  try {
    const allAuthor = await AuthorModel.find().lean()
    res.status(200).json(allAuthor)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const GetAuthor = async (req, res) => {
  try {
    const perPage = 20
    const page = req.query.page || 1
    const slug = req.params.slug
    const books = await AuthorModel.find({ slug: slug })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: 'books',
        match: { deleted: false },
        select: 'slug name cover'
      })
    res.status(200).json(books)
  } catch (error) {
    console.log({ ErrorBookOfAuthor: error })
    res.status(500).json(error)
  }
}

const CreateNewAuthor = async (req, res) => {
  try {
    const slug = await generateSlug(AuthorModel, req.body.fullName)
    const newAuthor = new AuthorModel({
      slug: slug,
      fullName: req.body.fullName,
      birthDate: req.body.birthDate,
      avatar: req.body.avatar,
      books: []
    })
    const savedAuthor = await newAuthor.save()
    res.status(200).json(savedAuthor)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const UpdateAuthor = async (req, res) => {
  try {
    const authorId = req.params.id
    if (!mongoose.isValidObjectId(authorId))
      throw new Error('Invalid Author ID')
    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      authorId,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedAuthor)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const SoftDelete = async (req, res) => {
  try {
    const authorId = req.params.id
    //Check valid id
    if (!mongoose.isValidObjectId(authorId))
      throw new Error('Invalid author id')
    //Update author model
    const currentAuthor = await AuthorModel.findOneAndUpdate(
      { _id: authorId },
      { deleted: true },
      { new: true }
    )

    //Update book model
    const updatedBooks = await BookModel.updateMany(
      { _id: { $in: currentAuthor.books } },
      { $pull: { authors: currentAuthor._id } }
    )
    res.status(200).json(currentAuthor)
  } catch (error) {
    console.log({ SoftDeleteAuthorError: error })
    res.status(500).json(error)
  }
}

const Delete = async (req, res) => {
  try {
    const authorId = req.params.id
    //Check valid id
    if (!mongoose.isValidObjectId(authorId))
      throw new Error('Invalid author id')
    //Find and check valid author
    const currentAuthor = await AuthorModel.findById(authorId)
    if (!currentAuthor) throw new Error('Invalid author id')

    //Delete books
    const updatedBooks = await BookModel.updateMany(
      { _id: { $in: currentAuthor.books } },
      { $pull: { authors: currentAuthor._id } }
    )
    //Delere Author
    const deletedAuthor = AuthorModel.deleteOne({ _id: authorId })

    await Promise.all([updatedBooks, deletedAuthor])

    res.status(200).json({ success: true })
  } catch (error) {
    console.log({ DeleteWithBookError: error })
    res.status(500).json(error)
  }
}

const Restore = async (req, res) => {
  try {
    const authorId = req.params.id
    if (!mongoose.isValidObjectId(authorId))
      throw new Error('Invalid author ID')
    const restoredAuthor = await AuthorModel.findByIdAndUpdate(
      authorId,
      {
        deleted: false
      },
      { new: true }
    )

    const updatedBooks = await BookModel.updateMany(
      {
        _id: { $in: restoredAuthor.books },
        authors: { $ne: restoredAuthor._id }
      },
      { $push: { authors: restoredAuthor._id } }
    )
    //remove deleted prop
    delete restoredAuthor.deleted
    res.status(200).json(restoredAuthor)
  } catch (error) {
    console.log({ RestoreAuthorError: error })
    res.status(500).json(error)
  }
}

module.exports = {
  GetAuthor,
  GetAllAuthor,
  CreateNewAuthor,
  UpdateAuthor,
  SoftDelete,
  Delete,
  Restore
}
