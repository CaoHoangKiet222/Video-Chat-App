const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploads = (data, folder) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        data,
        { upload_preset: folder },
        (error, result) => {
          if (error) reject(error.message);
          resolve(result.url);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  cloudinary,
  uploads,
};
