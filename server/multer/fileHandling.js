const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (_req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads", // need to be the same as collection db (gfs.collection("uploads"))
        };
        resolve(fileInfo);
      });
    });
  },
});

module.exports = {
  upload: multer({ storage }),
};

// app.post("/upload", upload.single("groupImg"), (req, res, next) => {
//   next();
//   // res.json({file: req.file})
// });
