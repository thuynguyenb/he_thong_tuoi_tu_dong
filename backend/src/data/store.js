const store = {
  sensor: { moisture: 57, soilStatus: 'Độ ẩm trung bình', updatedAt: new Date().toISOString() },
  pump: { status: false, mode: 'AUTO', runtimeMinutes: 0 },
  energy: { solarPower: 86, solarVoltage: 18.4, solarCurrent: 4.67, batteryPercent: 78, batteryVoltage: 12.6, charging: true, updatedAt: new Date().toISOString() },
  settings: { autoMode: true, minMoisture: 30, maxMoisture: 60 }
};
function updateSoilStatus(){ const m=store.sensor.moisture; store.sensor.soilStatus=m<store.settings.minMoisture?'Đất khô':m>=store.settings.maxMoisture?'Đất ẩm':'Độ ẩm trung bình'; }
function setMoisture(value){ const m=Number(value); if(!Number.isFinite(m)||m<0||m>100) throw new Error('Độ ẩm phải nằm trong khoảng 0-100%'); store.sensor.moisture=m; store.sensor.updatedAt=new Date().toISOString(); updateSoilStatus(); return store.sensor; }
function setPump(status){ store.pump.status=Boolean(status); return store.pump; }
function setSettings(data){ if(typeof data.autoMode==='boolean') store.settings.autoMode=data.autoMode; if(data.minMoisture!==undefined){const v=Number(data.minMoisture);if(!Number.isFinite(v)||v<0||v>100)throw new Error('minMoisture không hợp lệ');store.settings.minMoisture=v;} if(data.maxMoisture!==undefined){const v=Number(data.maxMoisture);if(!Number.isFinite(v)||v<0||v>100)throw new Error('maxMoisture không hợp lệ');store.settings.maxMoisture=v;} if(store.settings.minMoisture>=store.settings.maxMoisture) throw new Error('Ngưỡng bật bơm phải nhỏ hơn ngưỡng tắt bơm'); updateSoilStatus(); return store.settings; }
module.exports={store,setMoisture,setPump,setSettings};
