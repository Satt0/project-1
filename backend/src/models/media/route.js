const route = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const cpUpload = upload.fields([ { name: 'media', maxCount: 8 }])
route.post(
  "/upload",
  cpUpload,
  function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    console.log(req.files);
    res.send('ok')
  }
);


module.exports = route;
