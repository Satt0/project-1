const router=require('express').Router()
const mediaRoute=require('../../../../models/media/route')
router.get('/',(req,res)=>{res.send("it works")})
router.use('/media',mediaRoute)

module.exports=router