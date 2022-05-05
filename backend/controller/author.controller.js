const { default: mongoose } = require('mongoose')
const AuthorModel = require('../model/author.model')
const BookModel = require('../model/book.model')
const GenreController = require('../controller/genre.controller')
const generateSlug = require('../common/slug')
const uploadImage = require('../common/uploadImage')
const GetAllAuthor = async (req, res) => {
  try {
    const allAuthor = await AuthorModel.find({ deleted: false }).lean()
    res.status(200).json(allAuthor)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const GetDeletedAuthor = async (req, res) => {
  try {
    const allAuthor = await AuthorModel.find({ deleted: true }).lean()
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
      address: req.body.address,
      books: []
    })
    await uploadImage(newAuthor, 'avatarId', 'avatarUrl', req.body.avatarBase64)
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
    const newName = req.body.fullName
    if (!mongoose.isValidObjectId(authorId))
      throw new Error('Invalid Author ID')

    const updateInfo = {
      fullName: req.body.fullName,
      address: req.body.address,
      birthDate: req.body.birthDate
    }

    console.log(updateInfo)
    const propNames = Object.getOwnPropertyNames(updateInfo)
    propNames.forEach(propName => {
      if (updateInfo[propName] == null || updateInfo[propName] == undefined)
        delete updateInfo[propName]
    })

    const updatedAuthor = await AuthorModel.findByIdAndUpdate(
      authorId,
      updateInfo,
      {
        new: true
      }
    )

    if (!updatedAuthor) throw new Error('Author does not exist')

    if (
      newName &&
      newName.toLowerCase() != updatedAuthor.fullName.toLowerCase()
    ) {
      const slug = await generateSlug(AuthorModel, newName)
      updatedAuthor.slug = slug
      updatedAuthor.fullName = newName
    }

    if (req.body.avatarBase64) {
      await uploadImage(
        updatedAuthor,
        'avatarId',
        'avatarUrl',
        req.body.avatarBase64
      )
    }
    await updatedAuthor.save()

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

const searchAuthor = async query => {
  try {
    const genres = await AuthorModel.find(query).select('_id').lean()
    return genres
  } catch (error) {
    console.log(error)
    return []
  }
}

module.exports = {
  GetAuthor,
  GetDeletedAuthor,
  GetAllAuthor,
  CreateNewAuthor,
  UpdateAuthor,
  SoftDelete,
  Delete,
  Restore,
  searchAuthor
}
