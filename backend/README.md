# Smart Irrigation Backend

## Chạy
npm install
copy .env.example .env
npm run dev

Server: http://localhost:5000

## API
GET /api/health
GET /api/system
GET /api/sensor
POST /api/sensor {"moisture":25}
GET /api/pump
POST /api/pump {"status":true}
POST /api/pump/toggle
GET /api/energy
GET /api/settings
PUT /api/settings {"autoMode":true,"minMoisture":30,"maxMoisture":60}

Hiện tại dữ liệu nằm trong RAM để test API. Bước kế tiếp sẽ thay bằng Firebase và kết nối ESP8266.
