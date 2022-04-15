const Collection = require('../model/collection.model')
const Account = require('../model/account.model')
const Book = require('../model/book.model')
const { default: mongoose } = require('mongoose')

const addFavoriteBook = async (req, res) => {
  try {
    const userId = req.params.userId
    const collectionId = req.params.collectionId
    const bookId = req.body.book

    const [account, book, collection] = await Promise.all([
      Account.findById(userId),
      Book.findById(bookId),
      Collection.findById(collectionId)
    ])

    if (!account) throw new Error('Account does not exist')
    if (!book) throw new Error('Book does not exist')
    if (!collection) throw new Error('Collection does not exist')
    if (account.collections.indexOf(collection._id) == -1)
      throw new Error('Collection does not exist')
    if (collection.books.indexOf(book._id) != -1)
      throw new Error('This book has been added')

    collection.books.push(book._id)
    const updatedCollection = await collection.save()
    res.status(200).json(updatedCollection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const removeFavoriteBook = async (req, res) => {
  try {
    const userId = req.params.userId
    const collectionId = req.params.collectionId
    const bookId = req.body.book

    const [account, book, collection] = await Promise.all([
      Account.findById(userId),
      Book.findById(bookId),
      Collection.findById(collectionId)
    ])

    if (!account) throw new Error('Account does not exist')
    if (!book) throw new Error('Book does not exist')
    if (!collection) throw new Error('Collection does not exist')
    if (account.collections.indexOf(collection._id) == -1)
      throw new Error('Collection does not exist')
    if (collection.books.indexOf(book._id) == -1)
      throw new Error('Book does not exist')

    const updatedCollection = await Collection.findByIdAndUpdate(
      collection._id,
      { $pull: { books: book._id } },
      { new: true }
    )
    res.status(200).json(updatedCollection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateCollectionName = async (req, res) => {
  try {
    const userId = req.params.userId
    const collectionId = req.params.collectionId

    const newName = req.body.newName

    if (mongoose.isValidObjectId(userId)) throw new Error('Invalid user id')

    if (mongoose.isValidObjectId(collectionId))
      throw new Error('Invalid collection id')

    const accountExisted = await Account.findOne({
      _id: userId,
      collection: collectionId
    })
    if (!accountExisted) throw new Error('Collection and Account do not match')

    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
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
    const userId = req.params.userId
    const name = req.body.name
    const bookId = req.body.book

    if (!mongoose.isValidObjectId(userId)) throw new Error('Invalid user id')

    const account = await Account.findById(userId)
    if (!account) throw new Error('Account does not exist')

    const collectionExist = await Collection.find({
      account: userId,
      name: { $regex: new RegExp(name, 'i') }
    })
    if (collectionExist.length > 0) throw new Error('Collection already exists')

    if (bookId != undefined) {
      if (!mongoose.isValidObjectId(bookId)) throw new Error('Invalid book id')
      const book = await Book.findById(bookId)
      if (!book) throw new Error('Book does not exist')
    }

    const newCollection = new Collection({
      account: userId,
      name: name,
      books: bookId ? [].concat(bookId) : []
    })

    const savedCollection = await newCollection.save()
    account.collections.push(savedCollection._id)
    const updatedAccount = await account.save()
    res.status(200).json(savedCollection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deleteCollection = async (req, res) => {
  try {
    const userId = req.params.userId
    const collectionId = req.params.collectionId

    if (!mongoose.isValidObjectId(userId))
      throw new Error('Invalid collection id')
    if (!mongoose.isValidObjectId(collectionId))
      throw new Error('Invalid collection id')

    const updatedAccount = await Account.findOneAndUpdate(
      {
        _id: userId,
        collections: collectionId
      },
      { $pull: { collections: collectionId } },
      { new: true }
    )
    if (!updatedAccount) throw new Error('Collection and Account do not match')
    const deletedCollection = await Collection.deleteOne({ _id: collectionId })
    res.status(200).json({ updatedAccount })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
const getCollectionById = async (req, res) => {
  try {
    const userId = req.params.userId
    const collectionId = req.params.collectionId

    if (!mongoose.isValidObjectId(userId))
      throw new Error('Invalid collection id')
    if (!mongoose.isValidObjectId(collectionId))
      throw new Error('Invalid collection id')

    const collection = await Collection.findOne({
      _id: collectionId,
      account: userId
    })
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
    const userId = req.params.userId
    const accountWithCollection = await Account.findById(userId)
      .populate({
        path: 'collections',
        populate: {
          path: 'books',
          model: 'Book'
        }
      })
      .select('username email avatar_url')
    res.json(accountWithCollection)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
  addFavoriteBook,
  removeFavoriteBook,
  updateCollectionName,
  createNewCollection,
  deleteCollection,
  getCollectionById,
  getCollectionOfAccount
}
