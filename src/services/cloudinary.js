const cloudinary = require("cloudinary");
const fs = require("fs");
const dotenv = require("dotenv")
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const removeTemp = (path) => {
  fs.unlink(path, err => {
    if(err) {
      throw err;
    }
  })
}

const uploadedFile = async (file) => {
  let image = {}
  await cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "Chat app"}, async (err, result) => {
    if(err) {
      throw err;
    }

    removeTemp(file.tempFilePath);
    return image = {url: result.secure_url, public_id: result.public_id}
  })

  return image;
}

const deleteFile = async (public_id) => {
  let deleted = false;
  await cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
    if(err) {
      throw err;
    }
    return deleted = true;
  })
  if(deleted) {
    return "File deleted";
  } else {
    return "File is not defined";
  }
}


module.exports = {uploadedFile, deleteFile, removeTemp}