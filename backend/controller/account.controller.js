const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Genres = require('../model/genres.model')
const Review =require('../model/review.model')
const Collection = require('../model/collection.model')
const { cloudinary } = require('../utils/cloudinary')
const { default: mongoose } = require('mongoose')
const createHttpError = require('http-errors')

const updateAccount = async (req, res) => {
  //nhận các giá trị từ client req.params.id, req.body.email,username,password,avatarBase64
  try {
    const account = await Account.findById(req.params.id)
    if (req.body.email) account.email = req.body.email
    if (req.body.username) account.username = req.body.username
    if (req.body.password) account.password = req.body.password
    if (req.body.birthDate) {
      if (checkDate(req.body.birthDate)) {
        account.birthDate = req.body.birthDate
      }
    }
    if (req.body.address) account.address = req.body.address
    if (req.body.phoneNumber) account.phoneNumber = req.body.phoneNumber
    if (req.body.address) account.address = req.body.address

    if (req.body.avatarBase64) {
      //xử lý upload avatar mới
      if (account.id_avatar) {
        cloudinary.uploader.destroy(
          account.id_avatar,
          function (error, result) {
            console.log(result, error)
          }
        )
      }
      const fileStr = req.body.avatarBase64
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: process.env.UPLOAD_PRESET
      })
      account.id_avatar = uploadResponse.public_id
      account.avatar_url = uploadResponse.secure_url
    }
    //
    await account.save()
    res.status(200).json(account)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

function checkDate(dateString) {
  var q = new Date()
  var m = q.getMonth()
  var d = q.getDate()
  var y = q.getFullYear()

  var toDate = new Date(y, m, d)
  var date = new Date(dateString + ' GMT+0700')
  return date <= toDate
}

const updatePasswordAccount = async (req, res) => {
  //nhận các giá trị từ client req.params.id, req.body.email,username,password,avatarBase64
  try {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) throw new Error('Invalid account id')
    const account = await Account.findById(id)
    if (account.password == req.body.oldPassword)
      account.password = req.body.newPassword
    await account.save()
    delete account.password
    res.status(200).json(account)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getAccountCart = async (req, res) => {
  try {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) throw new Error('Invalid account id')
    const account = await Account.findById(id).select('cart').populate({
      path: 'cart.book',
      select: '_id slug name coverUrl price description genres'
    })
    // console.log(account.cart[0].book.genres)
    // const genres=await Genres.findById(account.cart[0].book.genres)
    let _account = []
    // console.log({...account._doc.cart[0]._doc})
    for (let i = 0; i < account.cart.length; i++) {
      const genres = await Genres.findById(account.cart[i].book.genres)
      let book = {
        ...account.cart[i].book._doc,
        genres: genres.name
      }
      _account.push({
        ...account._doc.cart[i]._doc,
        book: book
      })
    }

    if (!account) throw new Error('Invalid account')
    res.status(200).json(_account)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const addBookToCart = async (req, res) => {
  try {
    const bookId = req.body.book
    const accountId = req.body.account
    if (accountId !== req.params.id) throw new Error('Account id not match')
    const updatedAccount = await updateCartAccount(accountId, bookId, 1, false)
    res.status(200).json(updatedAccount)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const pullBookFromCart = async (req, res) => {
  try {
    const bookId = req.body.book
    const accountId = req.body.account
    if (accountId !== req.params.id) throw new Error('account id not match')
    let deleteBook = false //Boolean
    if (typeof req.body.deleteBook === 'boolean')
      deleteBook = req.body.deleteBook
    else if (typeof req.body.deleteBook === 'string') {
      if (req.body.deleteBook.toLowerCase() == 'true') deleteBook = true
      else req.body.deleteBook.toLowerCase() == 'false'
      deleteBook = false
    }
    const updatedAccount = await updateCartAccount(
      accountId,
      bookId,
      -1,
      deleteBook
    )
    // console.log(updateAccount)
    res.status(200).json(updatedAccount)
  } catch (error) {
    console.log('bok error roi', error)
    res.status(503).json('Error')
  }
}

const updateCartAccount = async (accountId, bookId, amount, deleteBook) => {
  if (!mongoose.isValidObjectId(accountId))
    throw new Error('Invalid account id')
  if (!mongoose.isValidObjectId(bookId)) throw new Error('Invalid book id')
  console.log()
  if (typeof deleteBook !== 'boolean')
    throw new Error('type of deleteBook must be boolean')
  const account = await Account.findById(accountId)
  const book = await Book.findById(bookId)
  if (!account) throw new Error('Account does not exist')
  if (!book) throw new Error('Book does not exist')
  const indexOfBook = account.cart.findIndex(
    cartItem => cartItem.book == bookId
  )

  if (amount > 0) {
    if (book.amount == 0) throw new Error('Sold out')
    if (indexOfBook !== -1 && book.amount == account.cart[indexOfBook].amount)
      throw new Error('shortage')
    if (indexOfBook == -1) account.cart.push({ book: bookId, amount: 1 })
    else account.cart[indexOfBook].amount++
  } else {
    if (indexOfBook == -1) throw new Error('Cart does not contain book')
    else if (deleteBook || account.cart[indexOfBook].amount == 1)
      account.cart.splice(indexOfBook, 1)
    else account.cart[indexOfBook].amount--
  }
  const updatedAccount = await account.save()
  return updatedAccount
}

const getAccountShipping = async (req, res) => {
  try {
    const userId = req.params.userId
    const userAddress = await Account.findById(userId).select(
      'username phoneNumber address'
    )
    res.status(200).json(userAddress)
  } catch (error) {
    console.log(error)
    res.status(503).json('Can not get user address')
  }
}

const updateAccountLibrary = async (accountID, books) => {
  try {
    const bookIDs = books.map(item => item.book.toString())
    const account = await Account.findById(accountID)
    const newBooks = bookIDs.filter(item => {
      return account.library.indexOf(item) === -1
    })
    const updatedAccount = await Account.findByIdAndUpdate(accountID, {
      $push: { library: { $each: newBooks } }
    })
    return updatedAccount
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getAccountLibraries = async (req, res) => {
  try {
    console.log(req.params)
    const accountID = req.params.id
    const account = await Account.findById(accountID).select('library').lean()
    res.json(account.library)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const getAllBookReview = async (req, res) => {
  try {
    console.log(req.params)
    const accountID = req.params.id
    const arrBookReview=[]
    const bookReview=await Review.find({account:accountID})
    console.log(bookReview)
    bookReview.forEach((book)=>{
      arrBookReview.push(book.book)
    })
    console.log(arrBookReview)
    res.json(arrBookReview)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

module.exports = {
  getAccountCart,
  updateAccount,
  addBookToCart,
  pullBookFromCart,
  updatePasswordAccount,
  getAccountShipping,
  updateAccountLibrary,
  getAccountLibraries,
  getAllBookReview
}
