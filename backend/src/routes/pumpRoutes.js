const express=require('express'); const {store,setPump}=require('../data/store'); const router=express.Router();
router.get('/',(req,res)=>res.json({success:true,data:store.pump}));
router.post('/',(req,res)=>{if(typeof req.body.status!=='boolean')return res.status(400).json({success:false,message:'status phải là true hoặc false'});const pump=setPump(req.body.status);res.json({success:true,message:pump.status?'Đã bật máy bơm':'Đã tắt máy bơm',data:pump});});
router.post('/toggle',(req,res)=>{const pump=setPump(!store.pump.status);res.json({success:true,message:pump.status?'Đã bật máy bơm':'Đã tắt máy bơm',data:pump});}); module.exports=router;
