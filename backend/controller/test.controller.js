const UserModel = require("../model/user.model");

const getUser=async(req,res)=>{
    console.log('get success')
    res.status(200).json('test ok!')
}

module.exports={
    getUser
}