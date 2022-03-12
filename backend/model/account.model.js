const mongoose = require("mongoose");

const accountUser = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      required:true
    },
    id_avatar:{
        type:String,
    },
    avatar_url:{
        type:String
    },
    phone_number:{
        type:String,
    },
    address:{
        type:String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("account", accountUser, "account");
