const route = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {UploadMedia}=require('./data')
const {successFormater}=require('../../helpers/format/error')
const cpUpload = upload.fields([ { name: 'media', maxCount: 50 }])
route.post(
  "/upload",
  cpUpload,
  async function (req, res, next) {
    try{
     
      const images=req.files.media
      
      const media=new UploadMedia(images)
      const result=await media.uploadMany()
   
      res.json(successFormater(result))
    }catch(e){
      next(new Error("cannot upload"));
    }
  }
);


module.exports = route;
