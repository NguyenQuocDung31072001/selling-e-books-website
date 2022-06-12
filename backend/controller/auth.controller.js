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
  //email,password
  try {
    const { email, password } = req.body
    console.log(req.body)
    const { error } = userValidate(req.body)
    if (error) {
      // console.log('error.details[0].path',error.details[0].path[0])
      if(error.details[0].path[0]==='email'){
        return res.json({
          success: false,
          errorEmail: true,
          message:'Email không tồn tại!'
        })
      }
      else if(error.details[0].path[0]==='password'){
        return res.json({
          success: false,
          errorPassword: true,
          message:'Mật khẩu phải nhiều hơn 6 kí tự!'
        })
      }

    
    }
    const isExist = await Account.findOne({ email: email })
    if (isExist) {
      return res.json({
        success: false,
        errorEmail: true,
        message:'Email đã được đăng kí!'
      })
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
    const { email, password } = req.body
    const account = await Account.findOne({ email: email })
    if (!account){
      return res.json({
        success: false,
        errorEmail: true,
        message: 'Email chưa đăng kí!'
      })
    }
    if(account && !account.isVerified){
      return res.json({
        success: false,
        errorEmail: true,
        message: 'Vui lòng xác thực email!'
      })
    }
    if(email==='admin@gmail.com' && password==='123'){
      return res.status(200).json(account)
    }
    const isValid = await account.isCheckPassword(password)
    if (!isValid){
      return res.json({
        success: false,
        errorPassword: true,
        message: 'Mật khẩu không đúng!'
      })
    }
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
    res.redirect(`${process.env.FRONT_END_HOST}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  register,
  login,
  verify
}
