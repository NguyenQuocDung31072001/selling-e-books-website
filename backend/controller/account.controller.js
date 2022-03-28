const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Collection = require('../model/collection.model')
const { cloudinary } = require('../utils/cloudinary')
const { default: mongoose } = require('mongoose')

const updateAccount = async (req, res) => {
  //nhận các giá trị từ client req.params.id, req.body.email,username,password,avatarBase64
  try {
    const account = await Account.findById(req.params.id)
    account.email = req.body.email
    account.username = req.body.username
    account.password = req.body.password
    //xử lý upload avatar mới
    if (req.body.avatarBase64) {
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

const addBookToCart = async (req, res) => {
  try {
    const bookId = req.body.book
    const accountId = req.body.Account
    const updatedAccount = await updateCartAccount(accountId, bookId, 1, false)
    res.status(200).json(updatedAccount)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const pullBookFromCart = async (req, res) => {
  try {
    const bookId = req.body.book
    const accountId = req.body.account
    const deleteBook = req.body.deleteBook //Boolean
    const updatedAccount = await updateCartAccount(
      bookId,
      accountId,
      -1,
      deleteBook
    )
    res.status(200).json(updatedAccount)
  } catch (error) {
    console.log(error)
    res.status(error)
  }
}

const updateCartAccount = async (accountId, bookId, amount, deleted) => {
  if (!mongoose.isValidObjectId(accountId))
    throw new Error('Invalid account id')
  if (!mongoose.isValidObjectId(bookId)) throw new Error('Invalid book id')
  const account = await Account.findById(accountId)
  const book = await Book.findById(bookId)
  if (!account) throw new Error('Account does not exist')
  if (!book) throw new Error('Book does not exist')
  const indexOfBook = account.cart.findIndex(
    cartItem => cartItem.book == bookId
  )

  if (amount > 0) {
    if (book.amount == 0) throw new Error('Sold out')
    if (indexOfBook == -1) account.cart.push({ book: bookId, amount: 1 })
    else account.cart[indexOfBook].amount++
  } else {
    if (indexOfBook == -1) throw new Error('Cart does not contain book')
    else if (deleted || account.cart[indexOfBook].amount == 1)
      account.cart.splice(indexOfBook, 1)
    else account.cart[indexOfBook].amount--
  }
  const updatedAccount = await account.save()
  return updatedAccount
}

module.exports = {
  updateAccount,
  addBookToCart,
  pullBookFromCart
}
