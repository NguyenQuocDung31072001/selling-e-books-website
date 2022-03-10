const express = require("express");
const router = express.Router();
const {verifyToken}=require('../middleware/verify_token')
const accountController=require('../controller/account.controller')

router.post('/setting/:id',verifyToken,accountController.updateAccount)



module.exports=router