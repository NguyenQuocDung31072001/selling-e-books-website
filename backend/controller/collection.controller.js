const Collection = require('../model/collection.model')
const Account = require('../model/account.model')
const Book = require('../model/book.model')
const { default: mongoose } = require('mongoose')
const addFavoriteBook = async (req, res) => {
  try {
    const id = req.params.id
    const bookId = req.body.bookId
    const collectionId = req.body.collection

    const isNewCollection = req.body.newCollection ? true : false
    const account = await Account.findById(id)
    const book = await Book.findById(bookId)
    const collection = await Collection.findById(collectionId)

    if (!account) throw new Error('Account does not exist')
    if (!book) throw new Error('Book does not exist')
    if (!collection) throw new Error('Collection does not exist')
    if (account.collections.indexOf(collection._d) == -1)
      throw new Error('Collection does not match')

    collection.books.push(book._id)
    const updatedCollection = await collection.save()
    res.status(200).json(updatedCollection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateCollectionName = async (req, res) => {
  try {
    const id = req.params.id
    const newName = req.body.newName
    if (mongoose.isValidObjectId(id)) throw new Error('Invalid collection id')
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      { name: newName },
      { new: true }
    )
    res.status(200).json(updatedCollection)
  } catch (error) {
    console.log(error)
    res.status(500), json(error)
  }
}

const createNewCollection = async (req, res) => {
  try {
    const accountId = req.body.account
    const name = req.body.name
    const bookId = req.body.book

    const account = await Account.findById(accountId)
    if (!account) throw new Error('Account does not exist')
    if (!mongoose.isValidObjectId(accountId))
      throw new Error('Invalid account id')

    const collectionExist = await Collection.find({
      account: accountId,
      name: { $regex: new RegExp(name, 'i') }
    })
    if (collectionExist.length > 0) throw new Error('Collection already exists')

    if (bookId != undefined) {
      if (!mongoose.isValidObjectId(bookId)) throw new Error('Invalid book id')
      const book = await Book.findById(bookId)
      if (!book) throw new Error('Book does not exist')
    }

    const newCollection = new Collection({
      account: accountId,
      name: name,
      books: bookId ? [].concat(bookId) : []
    })

    const savedCollection = await newCollection.save()
    account.collections.push(savedCollection._id)
    const updatedAccount = await account.save()
    res.status(200).json(updatedAccount)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deleteCollection = async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) throw new Error('Invalid collection id')
    const updatedAccount = await Account.findOneAndUpdate(
      { collections: id },
      { $pull: { collections: id } }
    )
    const deletedCollection = await Collection.deleteOne({ _id: id })
    res.status(200).json({ updatedAccount })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
const getCollectionById = async (req, res) => {
  try {
    const id = req.params.id
    const collection = await Collection.findById(id)
      .populate({ path: 'account', select: 'username email avatar_url' })
      .populate('books')
    res.status(200).json(collection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getCollectionOfAccount = async (req, res) => {
  try {
    const accountId = req.params.id
    const collection = await Collection.find({ account: accountId })
      .populate({
        path: 'account',
        select: 'username email avatar_url'
      })
      .populate('books')
    res.json(collection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
  addFavoriteBook,
  updateCollectionName,
  createNewCollection,
  deleteCollection,
  getCollectionById,
  getCollectionOfAccount
}
