const { cloudinary } = require('../utils/cloudinary')
const uploadImage = async (targetObject, idProp, urlProp, image) => {
  if (image) {
    if (targetObject[idProp]) {
      cloudinary.uploader.destroy(
        targetObject[idProp],
        function (error, result) {
          console.log(result, error)
        }
      )
    }
    const fileStr = image
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: process.env.UPLOAD_PRESET
    })
    targetObject[idProp] = uploadResponse.public_id
    targetObject[urlProp] = uploadResponse.secure_url
  }
}

module.exports = uploadImage
