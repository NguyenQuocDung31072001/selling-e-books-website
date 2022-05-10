const Collection = require('../model/collection.model')
const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Order = require('../model/order.model')
const Genre = require('../model/genres.model')
const { default: mongoose } = require('mongoose')
const { count } = require('../model/collection.model')
const authorModel = require('../model/author.model')

const getBookData = async (req, res) => {
  try {
    const { from, to } = req.query
    const query = {}
    if (from || to) {
      query['$and'] = []
    }
    if (from) {
      query['$and'].push({ createdAt: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      query['$and'].push({ createdAt: { $lte: new Date(toDate) } })
    }
    const books = await Book.aggregate([
      { $match: query },
      {
        $facet: {
          all: [
            {
              $group: {
                _id: '',
                books: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ],
          bookByStatus: [
            {
              $group: {
                _id: '$deleted',
                books: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ],
          bookByGenres: [
            { $unwind: '$genres' },
            {
              $group: {
                _id: '$genres',
                books: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ],
          bookByAuthors: [
            { $unwind: '$authors' },
            {
              $group: {
                _id: '$authors',
                books: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ])
    res.status(200).json(books)
  } catch (error) {
    console.log(error)
  }
}

const getGenreData = async (req, res) => {
  try {
    const { from, to } = req.query
    const query = {}
    if (from || to) {
      query['$and'] = []
    }
    if (from) {
      query['$and'].push({ createdAt: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      query['$and'].push({ createdAt: { $lte: new Date(toDate) } })
    }
    const genres = await Genre.aggregate([
      { $match: query },
      {
        $facet: {
          all: [
            {
              $group: {
                _id: '',
                genres: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ],
          genresByStatus: [
            {
              $group: {
                _id: '$deleted',
                genres: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ])
    res.status(200).json(genres)
  } catch (error) {
    console.log(error)
    res.status(500).json({})
  }
}

const getAuthorsData = async (req, res) => {
  try {
    const { from, to } = req.query
    const query = {}
    if (from || to) {
      query['$and'] = []
    }
    if (from) {
      query['$and'].push({ createdAt: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      query['$and'].push({ createdAt: { $lte: new Date(toDate) } })
    }
    const authors = await authorModel.aggregate([
      { $match: query },
      {
        $facet: {
          all: [
            {
              $group: {
                _id: '',
                authors: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ],
          authorsByStatus: [
            {
              $group: {
                _id: '$deleted',
                authors: { $push: '$_id' },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ])
    res.status(200).json(authors)
  } catch (error) {
    console.log(error)
    res.status(500).json({})
  }
}

const getRevenue = async (req, res) => {
  try {
    const { from, to } = req.query
    const query = {}
    if (from || to) {
      query['$and'] = []
    }
    if (from) {
      query['$and'].push({ createdAt: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      query['$and'].push({ createdAt: { $lte: new Date(toDate) } })
    }
    // const orders = await Order.find(query)

    const orders = await Order.aggregate([
      { $match: query },
      {
        $facet: {
          all: [
            {
              $group: {
                _id: '',
                count: { $sum: 1 },
                orders: { $push: '$_id' },
                total: { $sum: '$total' },
                totalShippingCost: { $sum: '$shippingCost' },

                notFinish: {
                  $push: {
                    $cond: [{ $lte: ['$status', -1] }, '$_id', '$$REMOVE']
                  }
                },
                countRefunded: {
                  $sum: { $cond: [{ $lte: ['$status', -1] }, 1, 0] }
                },
                refunded: {
                  $sum: { $cond: [{ $lte: ['$status', -1] }, '$total', 0] }
                },
                refundedShippingCost: {
                  $sum: {
                    $cond: [{ $lte: ['$status', -1] }, '$shippingCost', 0]
                  }
                },

                finished: {
                  $push: {
                    $cond: [{ $lte: ['$status', 3] }, '$_id', '$$REMOVE']
                  }
                },
                countFinished: {
                  $sum: {
                    $cond: [{ $gte: ['$status', 3] }, 1, 0]
                  }
                },
                totalFinished: {
                  $sum: {
                    $cond: [{ $gte: ['$status', 3] }, '$total', 0]
                  }
                },
                finishedShippingCost: {
                  $sum: {
                    $cond: [{ $gte: ['$status', 3] }, '$shippingCost', 0]
                  }
                }
              }
            },
            {
              $project: {
                all: {
                  orders: '$orders',
                  count: '$count',
                  total: '$total',
                  shippingCost: '$totalShippingCost'
                },
                finish: {
                  orders: '$finished',
                  count: '$countFinished',
                  total: '$totalFinished',
                  shippingCost: '$finishedShippingCost'
                },
                notFinish: {
                  orders: '$notFinish',
                  count: '$countRefunded',
                  total: '$refunded',
                  shippingCost: '$refundedShippingCost'
                }
              }
            }
          ],
          ordersByBooks: [
            { $unwind: '$books' },
            {
              $group: {
                _id: '$books.book',
                orders: { $push: '$_id' },
                // total: { $sum: '$total' },
                count: { $sum: 1 }
              }
            }
          ],
          ordersByPayment: [
            {
              $group: {
                _id: '$payment',
                orders: { $push: '$_id' },
                total: { $sum: '$total' },
                shippingCost: { $sum: '$shippingCost' },
                count: { $sum: 1 }
              }
            }
          ],
          ordersByStatus: [
            {
              $group: {
                _id: '$status',
                orders: { $push: '$_id' },
                total: { $sum: '$total' },
                shippingCost: { $sum: '$shippingCost' },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ])

    res.status(200).json(orders)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

const getAccounts = async (req, res) => {
  try {
    const { from, to } = req.query
    const query = {}
    if (from || to) {
      query['$and'] = []
    }
    if (from) {
      query['$and'].push({ createdAt: { $gte: new Date(from) } })
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(24, 59, 59)
      query['$and'].push({ createdAt: { $lte: new Date(toDate) } })
    }

    const accounts = await Account.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 },
          accounts: { $push: '$_id' }
        }
      }
    ])
    res.status(200).json(accounts)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}

module.exports = {
  getRevenue,
  getAccounts,
  getBookData,
  getGenreData,
  getAuthorsData
}
