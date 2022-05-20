const VoucherModel = require('../model/voucher.model')
const createHttpError = require('http-errors')
const { object } = require('joi')
const createNewVoucher = async (req, res) => {
  try {
    const {
      code,
      description,
      startTime,
      endTime,
      limit,
      discountCap,
      discountPercentage,
      minSpend
    } = req.body

    if (discountCap === undefined && discountPercentage == undefined)
      throw createHttpError.BadRequest(
        'Phần trăm và giá trị không được để trống'
      )

    const voucher = await VoucherModel.findOne({ code: code })
    if (voucher)
      throw createHttpError.BadRequest(
        'Mã giảm đã được sử dụng vui lòng chọn mã khác'
      )

    const newVoucher = new VoucherModel({
      code,
      description,
      startTime,
      endTime,
      limit,
      discountCap,
      discountPercentage,
      minSpend
    })
    const savedVoucher = await newVoucher.save()
    res.status(200).json({
      success: true,
      message: '',
      error: false,
      voucher: savedVoucher
    })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : 'không thành công',
      error: true,
      voucher: null
    })
  }
}

const updateVoucher = async (req, res) => {
  const voucherID = req.params.voucherID
  try {
    const {
      code,
      description,
      startTime,
      endTime,
      limit,
      discountCap,
      discountPercentage,
      minSpend,
      disabled
    } = req.body

    const updateInfo = {
      code,
      description,
      startTime,
      endTime,
      limit,
      discountCap,
      discountPercentage,
      minSpend,
      disabled
    }
    let unset = {}
    const propNames = Object.getOwnPropertyNames(updateInfo)
    propNames.forEach(prop => {
      if (typeof updateInfo[prop] === 'undefined') {
        unset[prop] = ''
        delete updateInfo[prop]
      }
    })
    const updatedVoucher = await VoucherModel.findByIdAndUpdate(
      voucherID,
      { ...updateInfo, $unset: unset },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: '',
      error: false,
      voucher: updatedVoucher
    })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : 'không thành công',
      error: true,
      voucher: null
    })
  }
}

const getAllVoucher = async (req, res) => {
  try {
    const vouchers = await VoucherModel.find()
    res.status(200).json(vouchers)
  } catch (error) {
    console.log(error)
    res.status(500).json('error')
  }
}

const getVoucher = async (req, res) => {
  try {
    const { code } = req.params.code
    if (code == undefined)
      throw createHttpError.NotFound('Voucher không tồn tại')
    const voucher = await VoucherModel.findOne({ code: code })
    if (voucher) throw createHttpError.NotFound('Voucher không tồn tại')
    res.status(200).json(voucher)
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json(error.message)
  }
}

const deleteVoucher = async (req, res) => {
  try {
    const { voucherID } = req.params
    console.log(voucherID)
    const existVoucher = await VoucherModel.findById(voucherID)
    if (existVoucher) {
      await VoucherModel.deleteOne({
        _id: existVoucher._id
      })
      return res.status(200).json({
        success: true,
        error: false,
        message: 'Xoá thành công',
        voucher: null
      })
    } else {
      throw createHttpError.NotFound('Voucher không tồn tại!')
    }
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({
      success: false,
      error: true,
      message: error.status ? error.message : 'Không thành công',
      voucher: null
    })
  }
}

const applyVoucher = async (order, voucherCode) => {
  const voucher = await VoucherModel.findOne({ code: voucherCode })
  if (!voucher) throw createHttpError.NotFound('Voucher không tồn tại')
  if (voucher.limit && voucher.limit <= voucher.used)
    throw createHttpError.Conflict('Voucher đã hết')
  if (voucher.startTime > new Date())
    throw createHttpError.Conflict('Voucher chưa bắt đầu')
  if (voucher.endTime < new Date())
    throw createHttpError.Conflict('Voucher đã hết hạn')
  if (voucher.minSpend > voucher.subTotal)
    throw createHttpError.Conflict('Đơn hàng chưa đủ điều kiện')

  let finalDiscount = undefined

  if (voucher.discountPercentage) {
    let discount = order.subTotal * voucher.discountPercentage
    if (voucher.discountCap && voucher.discountCap < discount)
      discount = voucher.discountCap
    finalDiscount = discount
  } else if (voucher.discountCap) {
    if (voucher.discountCap > order.subTotal) finalDiscount = order.subTotal
    else finalDiscount = voucher.discountCap
  }
  if (typeof finalDiscount !== 'undefined')
    return {
      code: voucherCode,
      discount: finalDiscount
    }
  else throw createHttpError.Conflict('Không thể sử dụng voucher')
}

const tryApplyVoucher = async (req, res) => {
  try {
    const { voucherCode, subTotal } = req.body
    const order = {
      subTotal: subTotal
    }
    const voucher = await applyVoucher(order, voucherCode)
    res
      .status(200)
      .json({ ...voucher, success: true, error: false, message: 0 })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({
      success: false,
      error: true,
      message: error.status ? error.message : 'Không thành công',
      code: null,
      discount: null
    })
  }
}

module.exports = {
  createNewVoucher,
  updateVoucher,
  getAllVoucher,
  getAllVoucher,
  getVoucher,
  deleteVoucher,
  tryApplyVoucher,
  applyVoucher
}
