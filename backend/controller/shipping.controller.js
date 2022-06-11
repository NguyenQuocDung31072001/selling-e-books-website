const { default: mongoose } = require('mongoose')
const fetch = require('node-fetch')
const Account = require('../model/account.model')
const Book = require('../model/book.model')

const getProvinces = async (req, res) => {
  try {
    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
      {
        headers: { token: process.env.GHN_TOKEN }
      }
    )
    const data = await response.json()
    res.status(200).json(data.data)
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const getProvince = async ProvinceID => {
  try {
    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
      {
        headers: { token: process.env.GHN_TOKEN }
      }
    )
    const data = await response.json()
    const province = data.data.find(prov => prov.ProvinceID == ProvinceID)
    return province
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const getDistricts = async (req, res) => {
  try {
    const province = parseInt(req.body.province)
    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
      {
        method: 'post',
        body: JSON.stringify({ province_id: province }),
        headers: {
          token: process.env.GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    )
    const responseData = await response.json()
    const data = responseData.data.filter(
      district =>
        !district.DistrictName.includes('Vật Tư') &&
        !district.DistrictName.includes('Đặc Biệt')
    )
    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const getDistrict = async (ProvinceID, DistrictID) => {
  try {
    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
      {
        method: 'post',
        body: JSON.stringify({ province_id: ProvinceID }),
        headers: {
          token: process.env.GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    )
    const responseData = await response.json()
    const data = responseData.data.filter(
      district =>
        !district.DistrictName.includes('Vật Tư') &&
        !district.DistrictName.includes('Đặc Biệt')
    )
    const district = data.find(dis => dis.DistrictID === DistrictID)
    return district
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const getWards = async (req, res) => {
  try {
    const district = parseInt(req.body.district)
    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
      {
        method: 'post',
        body: JSON.stringify({ district_id: district }),
        headers: {
          token: process.env.GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()
    res.status(200).json(data.data)
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const getWard = async (DistrictID, WardCode) => {
  try {
    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
      {
        method: 'post',
        body: JSON.stringify({ district_id: DistrictID }),
        headers: {
          token: process.env.GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()
    const ward = data.data.find(ward => ward.WardCode == WardCode)
    return ward
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const getShippingCost = async (req, res) => {
  try {
    const userID = req.body.user
    const books = [].concat(req.body.books)
    const addressTo = req.body.address
    console.log('books',books)
    const bookIDs = books.map(book => book.book)
    console.log('bookIDs',bookIDs)
    const existBooks = await Book.find({ _id: { $in: bookIDs } })
    if (existBooks.length != books.length) throw new Error('Invalid book IDs')
    const orderBooks = books.map(item => {
      const book = existBooks.find(book => book._id.toString() === item.book)
      return {
        book: item.book,
        amount: item.amount,
        price: book.price
      }
    })

    const shippingCost = await calAnonymousShippingCost(addressTo, orderBooks)
    res.status(200).json(shippingCost)
  } catch (error) {
    console.log(error)
    res.status(503).json({ error: 'Error' })
  }
}

const calShippingCost = async (userID, addressTo, bookIDs) => {
  try {
    if (
      typeof addressTo.DistrictID !== 'number' ||
      typeof addressTo.WardCode !== 'string'
    )
      throw new Error('Invalid address input type')

    if (!mongoose.isValidObjectId(userID)) throw new Error('Invalid user ID')
    console.log(bookIDs)
    const bookObjIDs = bookIDs.map(id => new mongoose.Types.ObjectId(id))

    const accounts = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userID)
        }
      },
      {
        $unwind: '$cart'
      },
      {
        $match: {
          'cart.book': { $in: bookObjIDs }
        }
      },
      {
        $lookup: {
          from: 'Book',
          localField: 'cart.book',
          foreignField: '_id',
          as: 'cart.book'
        }
      },
      {
        $unwind: {
          path: '$cart.book',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          cart: { $push: '$cart' }
        }
      }
    ])
    const account = accounts[0]
    const cart = account.cart

    if (cart.length != bookIDs.length) throw new Error('Invalid book id')

    let insuranceValue = 0
    let height = 0
    let width = 24
    let length = 27
    let weight = 0

    cart.forEach(cartItem => {
      insuranceValue += cartItem.book.price * cartItem.amount
      height += 5 * cartItem.amount
      weight += 100 * cartItem.amount
    })

    const shippingData = {
      service_type_id: 2,
      insurance_value: parseInt(insuranceValue),
      coupon: null,
      from_district_id: parseInt(process.env.SHOP_DISTRICT_ID),
      to_district_id: parseInt(addressTo.DistrictID),
      to_ward_code: addressTo.WardCode,
      height: parseInt(height),
      length: parseInt(length),
      weight: parseInt(weight),
      width: parseInt(width)
    }
    const shippingCost = await fetchShippingCost(shippingData)
    return shippingCost
  } catch (error) {
    throw error
  }
}

const calAnonymousShippingCost = async (addressTo, books) => {
  try {
    if (
      typeof addressTo.DistrictID !== 'number' ||
      typeof addressTo.WardCode !== 'string'
    )
      throw new Error('Invalid address input type')

    let insuranceValue = 0
    let height = 0
    let width = 24
    let length = 27
    let weight = 0

    books.forEach(book => {
      insuranceValue += book.price * book.amount
      height += 5 * book.amount
      weight += 100 * book.amount
    })

    const shippingData = {
      service_type_id: 2,
      insurance_value: parseInt(insuranceValue),
      coupon: null,
      from_district_id: parseInt(process.env.SHOP_DISTRICT_ID),
      to_district_id: parseInt(addressTo.DistrictID),
      to_ward_code: addressTo.WardCode,
      height: parseInt(height),
      length: parseInt(length),
      weight: parseInt(weight),
      width: parseInt(width)
    }
    const shippingCost = await fetchShippingCost(shippingData)
    return shippingCost
  } catch (error) {
    throw error
  }
}

const fetchShippingCost = async data => {
  try {
    const shippingData = {
      service_type_id: 2,
      insurance_value: parseInt(data.insurance_value),
      coupon: null,
      from_district_id: parseInt(data.from_district_id),
      to_district_id: parseInt(data.to_district_id),
      to_ward_code: data.to_ward_code,
      height: parseInt(data.height),
      length: parseInt(data.length),
      weight: parseInt(data.weight),
      width: parseInt(data.width)
    }

    const response = await fetch(
      'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
      {
        method: 'post',
        body: JSON.stringify(shippingData),
        headers: {
          token: process.env.GHN_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    )
    const responseData = await response.json()
    return responseData.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  getProvinces,
  getDistricts,
  getWards,
  getProvince,
  getDistrict,
  getWard,
  getShippingCost,
  calShippingCost,
  calAnonymousShippingCost
}
