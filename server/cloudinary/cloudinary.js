const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImgs = (data, folder, fileName = null) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        data,
        { upload_preset: folder, resource_type: "auto", public_id: fileName },
        (error, result) => {
          if (error) {
            return reject(error.message);
          }
          console.log(result);
          resolve(result.url);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const uploadAttachments = ({ url, fileName }, folder) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        url,
        { upload_preset: folder, resource_type: "auto", public_id: fileName },
        (error, result) => {
          if (error) {
            return reject(error.message);
          }

          resolve({
            url: result.url,
            fileName,
            size: (result.bytes / 1024).toFixed(2) + "KB",
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  cloudinary,
  uploadImgs,
  uploadAttachments,
};
