const Account = require('../model/account.model')
const Book = require('../model/book.model')
const Order = require('../model/order')

const ORDER_STATUS_NAME = {
  '-2': 'Hủy',
  '-1': 'Từ chối',
  0: 'Chờ xác nhận',
  1: 'Đã xác nhận',
  2: 'Đã vận chuyển',
  3: 'Giao hàng thành công',
  4: 'Đã nhận hàng'
}

const checkOut = async (req, res) => {
  try {
    const accountId = req.body.account
    const bookIds = req.body.books

    const account = await Account.findById(accountId)
    const books = await Book.find({ _id: { $in: bookIds } })
    const carts = account.cart.filter(cartItem => {
      return bookIds.indexOf(cartItem.book.toString()) != -1
    })

    let total = 0
    const ConfirmBooks = books.map(bookItem => {
      let book = carts.find(cartItem => {
        return cartItem.book.toString() === bookItem._id.toString()
      })
      item.amount = book.amount
      total += book.amount * item.price
      return item
    })
    const orderCheckOut = {
      account,
      order: ConfirmBooks,
      total: total
    }
    res.status(200).json(orderCheckOut)
  } catch (error) {
    console.log(error)
  }
}

const createNewOrder = (req, res) => {
  try {
    //COD
    if (req.body.payment == 'cod') {
      const bookIds = req.body.book
      const accountId = req.body.account

      const account = await Account.findById(accountId).populate('cart.book')
      let total = 0

      const orderBooks = bookIds.map(bookId => {
        const cartItem = account.cart.find(
          item => item.book._id.toString() == bookId
        )
        if (!cartItem) throw new Error('Book and account are not valid')
        return {
          book: cartItem.book._id,
          amount: cartItem.amount,
          price: cartItem.book.price
        }
      })

      const newOrder = new Order({
        user: currentUser._id,
        books: orderBooks,
        status: 0,
        paid: false,
        payment: 0,
        total: total,
        address: req.body.address
      })

      const asyncUpdateBooks = orderBooks.map(orderItem => {
        return bookHead.updateOne(
          { _id: orderItem.book },
          { $inc: { amount: -orderItem.amount } }
        )
      })

      account.cart = account.cart.filter(
        cartItem => bookIds.indexOf(cartItem.book.toString()) == -1
      )
      const updatedBooks = await Promise.all(asyncUpdateBooks)
      const savedOrder = await newOrder.save()
      const updatedUser = await account.save()
      res.json({ success: true, order: savedOrder })
    } else {
      //tra bang the
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, error: error })
  }
}

const cancelOrder = (req, res) => {
  try {
    const orderId = req.prarams.id
    const accountId = req.body.account
    const updatedOrder = await updateOrderById(orderId, -2)
    res.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const confirmOrder = (req, res) => {
  try {
    const id = req.params.id
    const updatedOrder = await Order.findByIdAndUpdate(id, { status: 1 })
    if (!updatedOrder) throw new Error('Order does not exist')
    updatedOrder.statusName = ORDER_STATUS_NAME[updatedOrder.status]
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getOrders = async (req, res) => {
  try {
    const statusQuery = req.query.status ? req.query.status : 0
    const all = await Order.find({ tinh_trang: statusQuery })
      .populate({ path: 'user', select: 'username email avatar_url address' })
      .populate({ path: 'books.book' })
      .lean()
    all.forEach(order => {
      order.statusName = ORDER_STATUS_NAME[order.status]
    })

    res.status(200).json(all)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getOrder = async (req, res) => {
  try {
    const id = req.parmas.id
    const order = await Order.findById(id)
      .populate({ path: 'user', select: 'username email avatar_url address' })
      .populate('Book')
    order.statusName = ORDER_STATUS_NAME[order.status]
    res.status(200).json(order)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deliveryOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const updatedOrder = await updateOrderById(orderId, 1, 2)
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const finishOrder = async (req, res) => {
  try {
    const orderId = req.params.id
    const updatedOrder = await updateOrderById(orderId, 3)
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const receivedOrder = (req, res) => {
  try {
    const orderId = req.params.id
    const updatedOrder = await updateOrderById(orderId, 4)
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const refuseOrder = async (req, res) => {
  try {
    const orderId = req.parmas.id
    const updatedOrder = await updateOrderById(orderId, -1)
    res.status(200).json(updatedOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateOrder = async (req, res) => {
  try {
    const id = req.parmas.id
    let currentStatus = parseInt(req.body.current)
    let newStatus = parseInt(req.body.new)
    if (newStatus != -1) newStatus = currentStatus + 1
    const result = await updateOrderById(id, newStatus)
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

const updateOrderById = async (id, status) => {
  if (!mongoose.isValidObjectId(id)) throw new Error('invalid id')
  if (status < -1 || status > 3 || parseInt(status) != status)
    throw new Error('invalid status')
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  )
  if (status == -1) {
    const updatedBooks = await restoreBooks(updatedOrder.books)
  }
  updatedOrder.statusName = ORDER_STATUS_NAME[updatedOrder.status]
  return updatedOrder
}

const restoreBooks = async books => {
  const asyncUpdateBooks = books.map(bookItem => {
    return Book.findByIdAndUpdate(bookItem.book, {
      $inc: { amount: bookItem.amount }
    })
  })
  return await Promise.all(asyncUpdateBooks)
}

module.exports = {
  checkOut,
  createNewOrder,
  cancelOrder,
  confirmOrder,
  getOrders,
  getOrder,
  updateOrder,
  deliveryOrder,
  finishOrder,
  receivedOrder,
  updateOrderById,
  restoreBooks
}
