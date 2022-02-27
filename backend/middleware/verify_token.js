const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

async function verifyToken(req, res, next) {
  try {
    const accessToken = req.headers.token;
    const id = jwt.verify(accessToken, process.env.JWT_KEY);
    const user = await UserModel.findById(id.id);
    console.log(user);
    next();
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  verifyToken,
};
