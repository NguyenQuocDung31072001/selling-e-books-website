const Account = require('../model/account.model')

const verifyEmail = async (req, res, next) => {
  const { email } = req.body
  const account = await Account.findOne({ email: email })
  if (account && account.isVerified) return next()
  else
    res.json({
      success: false,
      errorEmail: true,
      message: 'Vui lòng xác thực email trước khi tiến hành đăng nhập!'
    })
}
module.exports = verifyEmail
