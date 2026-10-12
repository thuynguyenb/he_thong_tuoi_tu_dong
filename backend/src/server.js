require('dotenv').config(); const express=require('express'); const cors=require('cors');
const sensorRoutes=require('./routes/sensorRoutes'); const pumpRoutes=require('./routes/pumpRoutes'); const energyRoutes=require('./routes/energyRoutes'); const systemRoutes=require('./routes/systemRoutes'); const settingsRoutes=require('./routes/settingsRoutes');
const app=express(); const PORT=process.env.PORT||5000;
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'})); app.use(express.json());
app.get('/',(req,res)=>res.json({success:true,message:'Smart Irrigation API is running'})); app.get('/api/health',(req,res)=>res.json({success:true,status:'OK',time:new Date().toISOString()}));
app.use('/api/sensor',sensorRoutes); app.use('/api/pump',pumpRoutes); app.use('/api/energy',energyRoutes); app.use('/api/system',systemRoutes); app.use('/api/settings',settingsRoutes);
app.use((req,res)=>res.status(404).json({success:false,message:'API endpoint not found'})); app.listen(PORT,()=>console.log(`Smart Irrigation API running at http://localhost:${PORT}`));
