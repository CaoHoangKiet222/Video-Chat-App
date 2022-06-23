const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const conn = mongoose.createConnection(process.env.MONGODB_URI);

// init gfs
let gfs;
let gridFSBucket;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);

  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });

  gfs.collection("uploads");
});

exports.getGroupImg = (req, res, _next) => {
  try {
    gfs.files.findOne({ filename: req.params.groupImg }, (_error, file) => {
      if (!file || file.length === 0) {
        res.status(404).json({ err: "No file exists!" });
      }

      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/jpg" ||
        file.contentType === "image/png"
      ) {
        const readStream = gridFSBucket.openDownloadStream(file._id);
        readStream.pipe(res);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
