const Account = require('../model/account.model')
const jwt = require('jsonwebtoken')
const { userValidate } = require('../utils/validation')
const createHttpError = require('http-errors')
const { create } = require('../model/account.model')
const { sendEmail, sendVerificationEmail } = require('../utils/senEmail')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const refreshTokens = []

const register = async (req, res, next) => {
  //username,email,password
  try {
    const { username, email, password } = req.body
    const { error } = userValidate(req.body)
    if (error) {
      throw createHttpError.BadRequest(error.details[0].message)
    }
    const isExist = await Account.findOne({ email: email })
    if (isExist) {
      throw createHttpError.Conflict(`${email} already exists`)
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = new Account({
      username: email,
      email: email,
      password: hashPassword,
      verifyToken: crypto.randomBytes(64).toString('hex'),
      isVerified: false,
      role: 'user',
      id_avatar: '',
      avatar_url: ''
    })
    const user_res = await user.save()
    await sendVerificationEmail(user_res.email, user_res.verifyToken)
    delete user_res.password
    res.status(200).json({ success: true, error: false, message: '' })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
function generateAccessToken(id) {
  return jwt.sign(
    {
      id: id
    },
    process.env.JWT_KEY,
    {
      expiresIn: '1d'
    }
  )
}
function generateRefreshToken(id) {
  return jwt.sign(
    {
      id: id
    },
    process.env.JWT_KEY,
    {
      expiresIn: '365d'
    }
  )
}

const login = async (req, res) => {
  //email,password
  try {
    console.log(req.body)
    const { email, password } = req.body
    console.log({ email, password })
    const account = await Account.findOne({ email: email })
    if (!account)
      throw createHttpError.Unauthorized('Incorrect email or password')

    const isValid = await account.isCheckPassword(password)
    console.log(isValid)
    if (!isValid)
      throw createHttpError.Unauthorized('Incorrect email or password')

    const accessToken = generateAccessToken(account.id)
    const refreshToken = generateRefreshToken(account.id)
    refreshTokens.push(refreshToken)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })

    const other = account._doc
    res.status(200).json({ ...other, accessToken })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

const verify = async (req, res, next) => {
  try {
    const { token } = req.query
    const account = await Account.findOne({ verifyToken: token })
    if (account) {
      account.isVerified = true
      await account.save()
    }
    res.redirect('http://localhost:3000/user/home')
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  register,
  login,
  verify
}
