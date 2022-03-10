const Account = require("../model/account.model");
const {cloudinary}=require('../utils/cloudinary')

const updateAccount=async(req,res)=>{
    //nhận các giá trị từ client req.params.id, req.body.email,username,password,avatarBase64
    try {
        const account=await Account.findById(req.params.id)
        account.email=req.body.email
        account.username=req.body.username
        account.password=req.body.password
        //xử lý upload avatar mới 
        if(req.body.avatarBase64){
            if(account.id_avatar){
                cloudinary.uploader.destroy(account.id_avatar, function(error,result) {
                console.log(result, error) });
            }
            const fileStr = req.body.avatarBase64;
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
              upload_preset: process.env.UPLOAD_PRESET,
            });
            account.id_avatar=uploadResponse.public_id
            account.avatar_url = uploadResponse.secure_url;
        }
        //
        await account.save()   
        res.status(200).json(account)     
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
module.exports={
    updateAccount
}