const { number, required } = require('joi')
const mongoose = require('mongoose')
const VoucherSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  code: {
    type: String,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: true
  },
  discountCap: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0
  },
  minSpend: {
    type: Number,
    min: 0,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    min: 0
  },
  used: {
    type: Number,
    min: 0,
    default: 0
  }
})
module.exports = mongoose.model('Voucher', VoucherSchema, 'Voucher')
