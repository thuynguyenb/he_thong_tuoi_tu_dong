const express=require('express'); const {store,setMoisture}=require('../data/store'); const router=express.Router();
router.get('/',(req,res)=>res.json({success:true,data:store.sensor}));
router.post('/',(req,res)=>{try{res.json({success:true,message:'Cập nhật độ ẩm thành công',data:setMoisture(req.body.moisture)});}catch(e){res.status(400).json({success:false,message:e.message});}});
module.exports=router;
