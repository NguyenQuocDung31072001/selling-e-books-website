const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

const refreshTokens = [];

const register = async (req, res) => {
  //username,email,password
  try {
    const user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user_res = await user.save();
    res.status(200).json(user_res);
  } catch (error) {
    return res.status(500).json(error);
  }
};

function generateAccessToken(id) {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1s",
    }
  );
}
function generateRefreshToken(id) {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "365d",
    }
  );
}

const login = async (req, res) => {
  //email,password
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    // console.log(user.id)
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    refreshTokens.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });

    const other = user._doc;
    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = {
  register,
  login,
};
