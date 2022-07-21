const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = ({ url, fileName }, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      {
        upload_preset: folder,
        resource_type: "auto",
        public_id: uuidv4() + "_" + fileName,
      },
      (error, result) => {
        if (error) {
          return reject(error.message);
        }

        resolve({
          url: result.url,
          fileName,
          public_id: result.public_id,
          size: (result.bytes / 1024).toFixed(2) + " KB",
        });
      }
    );
  });
};

const destroyAsset = (public_id, resource_type) => {
  try {
    cloudinary.uploader.destroy(
      public_id,
      { resource_type },
      function (error, result) {
        console.log("destroyAsset", result, error);
        if (error) {
          return new Error("Destroy asset does not completely!!!");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  cloudinary,
  upload,
  destroyAsset,
};
