const express=require('express'); const {store}=require('../data/store'); const router=express.Router(); router.get('/',(req,res)=>res.json({success:true,data:store.energy})); module.exports=router;
