const { privateDecrypt } = require('crypto')
const createHttpError = require('http-errors')
const BookModel = require('../model/book.model')
const GoodsReceivedModel = require('../model/goodsReceived')

const createNewGoodsReceived = async (req, res) => {
  try {
    const { book, quantity, price, date } = req.body

    if (quantity < 0 || price < 0)
      throw new createHttpError.BadRequest('Quantity and price must >= 0')
    const existBook = await BookModel.findById(book)
    if (!existBook) throw new createHttpError.BadRequest('Book does not exist!')

    const newGoodsReceived = new GoodsReceivedModel({
      book,
      quantity,
      price,
      date
    })
    const savedGoodsReceived = await newGoodsReceived.save()

    existBook.amount += quantity
    existBook.price = price
    await existBook.save()

    const returnGoodsReceived = {
      _id: savedGoodsReceived._id,
      quantity: savedGoodsReceived.quantity,
      price: savedGoodsReceived.price,
      date: savedGoodsReceived.date,
      book: existBook
    }
    res.status(200).json({
      success: true,
      message: 'Success',
      goodsReceived: returnGoodsReceived
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: 'error', goodsReceived: null })
  }
}

const getAllGoodsReceived = async (req, res) => {
  try {
    const { page, book, from, to, sorterField, sorterOrder } = req.query
    const queryObj = {}
    if (book != undefined) {
      const books = await BookModel.find({
        name: new RegExp(book, 'i')
      }).select('_id')
      queryObj.book = { $in: books }
    }

    if (from || to) {
      queryObj['$and'] = []
    }
    if (from) {
      queryObj['$and'].push({ date: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      queryObj['$and'].push({ date: { $lte: new Date(toDate) } })
    }

    const sorterObj = {}
    if (sorterField) {
      sorterObj[sorterField] = sorterOrder
    }

    const all = await GoodsReceivedModel.find(queryObj)
      .populate({
        path: 'book',
        select: 'name'
        // option: { name: 1 }
      })
      .sort(sorterObj)
      .lean()
    res.status(200).json(all)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

module.exports = {
  getAllGoodsReceived,
  createNewGoodsReceived
}
