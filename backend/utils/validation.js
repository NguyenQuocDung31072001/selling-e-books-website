const joi = require('joi')

const userValidate = data => {
  const userSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(6).max(32).required()
  })
  return userSchema.validate(data)
}

const authorValidate = data => {
  const authorSchema = joi.object({
    fullName: joi.string().required,
    address: joi.string().required(),
    avatar: joi.string().required(),
    birthDate: joi.string().required()
  })

  return authorSchema.validate(data)
}

const bookValidate = data => {
  const bookSchema = joi.object({
    name: joi.string().lowercase().required(),
    cover: joi.string().required(),
    genres: joi.array(),
    authors: joi.array(),
    description: joi.string().min(0).max(10000).required(),
    format: joi.number().required(),
    pages: joi.number().min(0).required(),
    publishedBy: joi.string().required(),
    publishedDate: joi.date().required(),
    amount: joi.number().min(0).required(),
    price: joi.number().min(0).required()
  })
  return bookSchema.validate(data)
}

const genreValidate = data => {
  const genreSchema = joi.object({
    name: joi.string().lowercase().required(),
    description: joi.string().min(0).max(10000)
  })
  return genreSchema.validate(data)
}

const orderValidate = data => {
  const orderSchema = joi.object({
    user: joi.string().required(),
    customer: joi.string().required(),
    books: joi.array().required(),
    status: joi.number().min(-3).max(4).required(),
    payment: joi.string().required(),
    street: joi.string(),
    ward: joi.string().required(),
    district: joi.number().required(),
    province: joi.number().required(),
    phone: joi.string().required()
  })
  return orderSchema.validate(data)
}

const anonymousOrderValidate = data => {
  const orderSchema = joi.object({
    customer: joi.string().required(),
    books: joi.array().required(),
    status: joi.number().min(-3).max(4).required(),
    payment: joi.string().required(),
    street: joi.string(),
    ward: joi.string().required(),
    district: joi.number().required(),
    province: joi.number().required(),
    phone: joi.string().required()
  })
  return orderSchema.validate(data)
}

const reviewValidate = data => {
  const reviewSchema = joi.object({
    book: joi.string().required(),
    account: joi.string().required(),
    rating: joi.number().required(),
    content: joi.string()
  })
  return reviewSchema.validate(data)
}

module.exports = {
  userValidate,
  authorValidate,
  bookValidate,
  genreValidate,
  orderValidate,
  reviewValidate,
  anonymousOrderValidate
}
