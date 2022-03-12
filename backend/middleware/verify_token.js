const jwt = require("jsonwebtoken");
const Account = require("../model/account.model");

async function verifyToken(req, res, next) {
  // console.log('req.headers.token',req.headers.token)
  try {
    const accessToken = req.headers.token;

    const id = jwt.verify(accessToken, process.env.JWT_KEY);
    const user = await Account.findById(id.id);
    // console.log(user);
    next();
  } catch (error) {
    console.log('csincs',error)
    return res.status(500).json(error);
  }
}

module.exports = {
  verifyToken,
};
