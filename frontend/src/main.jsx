import {
  ref,
  onValue,
  update,
  push
} from 'firebase/database';
import {
  useEffect,
  useMemo,
  useState
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
Activity,
BatteryCharging,
ClipboardList,
ClipboardPen,
CloudSun,
Droplets,
Gauge,
Leaf,
Menu,
Power,
Settings as SettingsIcon,
Sun,
Wifi,
X,
Zap
} from 'lucide-react';
import { database } from './firebase';
import Dashboard from './pages/Dashboard';
import SoilMoisture from './pages/SoilMoisture';
import PumpControl from './pages/PumpControl';
import Energy from './pages/Energy';
import Settings from './pages/Settings';
import Crops from './pages/Crops';
import IrrigationLogs from './pages/IrrigationLogs';
import ExperimentLogs from './pages/ExperimentLogs';

import './styles.css';

function App() {
  const [moistureHistory, setMoistureHistory] = useState([]);
  const navigate = useNavigate();
const location = useLocation();

const pathToPage = {
  '/home': 'dashboard',
  '/monitoring': 'monitoring',
  '/pump': 'pump',
  '/energy': 'energy',
  '/crops': 'crops',
  '/logs': 'logs',
  '/settings': 'settings',
  '/experiment': 'experiment',
};

const pageToPath = {
  dashboard: '/',
  monitoring: '/monitoring',
  pump: '/pump',
  energy: '/energy',
  crops: '/crops',
  logs: '/logs',
  settings: '/settings',
  experiment: '/experiment',
};

const page = pathToPage[location.pathname] ?? 'dashboard';
  const [menuOpen, setMenuOpen] = useState(false);

  const [autoMode, setAutoMode] = useState(true);
  const [pumpOn, setPumpOn] = useState(false);

const [moisture, setMoisture] = useState(35);

const [soil1, setSoil1] = useState(0);
const [soil2, setSoil2] = useState(0);
const [temperature, setTemperature] = useState(0);
const [humidity, setHumidity] = useState(0);
const [waterLevel, setWaterLevel] = useState(0);

const [battery, setBattery] = useState(88);
useEffect(() => {
  const batteryInterval = setInterval(() => {
    setBattery(prev => Math.max(0, prev - 1));
  }, 5 * 60 * 1000);

  return () => clearInterval(batteryInterval);
}, []);
const [solarPower, setSolarPower] = useState(86);



// =========================================================
// DỮ LIỆU THỜI TIẾT
// TẠM THỜI MÔ PHỎNG - SAU NÀY CÓ THỂ LẤY TỪ API THỜI TIẾT
// =========================================================
const [weather, setWeather] = useState({
  temperature: 0,
  humidity: 0,
  rainProbability: 0,
  condition: 'Chưa cập nhật',
  rainExpected: false,
  loaded: false
});



// Lượng nước đã sử dụng
const [waterUsed, setWaterUsed] = useState(125);
const [waterWithoutSmart, setWaterWithoutSmart] = useState(160);

// Số lần hệ thống bỏ qua tưới do có khả năng mưa
const [rainSkipCount, setRainSkipCount] = useState(0);

// Lượng nước tiết kiệm ước tính cho mỗi lần bỏ qua tưới
const WATER_SAVED_PER_SKIP = 5;

const [lastUpdate, setLastUpdate] = useState('');
const [pumpMode, setPumpMode] = useState('AUTO');

  const [minMoisture, setMinMoisture] = useState(40);
  const [maxMoisture, setMaxMoisture] = useState(65);
  const [selectedCrop, setSelectedCrop] = useState('lettuce');
  


const [cropSettings, setCropSettings] = useState({
  lettuce: {
    name: 'Xà lách',
    minMoisture: 45,
    maxMoisture: 90,
    minTemperature: 18,
    maxTemperature: 35,
    skipRain: true,
    startTime: '00:00',
    endTime: '23:59'
  },

  tomato: {
    name: 'Cà chua',
    minMoisture: 45,
    maxMoisture: 60,
    minTemperature: 20,
    maxTemperature: 30,
    skipRain: true,
    startTime: '06:00',
    endTime: '08:00'
  }
});



useEffect(() => {
  const crop = cropSettings[selectedCrop];

  if (crop) {
    setMinMoisture(Number(crop.minMoisture ?? 40));
    setMaxMoisture(Number(crop.maxMoisture ?? 65));
  }
}, [selectedCrop, cropSettings]);


  // =========================================================
  // KẾT NỐI FIREBASE REALTIME DATABASE
  // =========================================================
useEffect(() => {
  
  const irrigationRef = ref(database, 'irrigation');

  const unsubscribe = onValue(
    irrigationRef,
    (snapshot) => {
      const data = snapshot.val();

      console.log('===== FIREBASE DATA =====');
      console.log(data);

      if (!data) return;

      // Cảm biến
      const soil1Value = data.sensors?.soilMoisture1 ?? 0;
      const soil2Value = data.sensors?.soilMoisture2 ?? 0;

      const averageSoil = Math.round(
        (soil1Value + soil2Value) / 2
      );

      setSoil1(soil1Value);
      setSoil2(soil2Value);
      setMoisture(averageSoil);
      // Thêm điểm mới vào biểu đồ khi Firebase cập nhật
    setMoistureHistory(prev => {
      // Không thêm điểm nếu độ ẩm không thay đổi
      if (
        prev.length > 0 &&
        prev[prev.length - 1].moisture === averageSoil
      ) {
        return prev;
      }

      const now = new Date();

      const newPoint = {
        time: now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        moisture: averageSoil,
      };

      return [...prev, newPoint].slice(-20);
    });
      
      setTemperature(data.sensors?.temperature ?? 0);
      setHumidity(data.sensors?.humidity ?? 0);

      setWaterLevel(data.sensors?.waterLevel ?? 0);
      // setBattery(data.sensors?.battery ?? 0);
      setSolarPower(data.sensors?.solarPower ?? 0);
      setWaterUsed(data.sensors?.waterUsed ?? 0);

      // Máy bơm
      setPumpOn(data.pump?.status ?? false);
      setPumpMode(data.pump?.mode ?? 'AUTO');

      // Hệ thống
      setAutoMode(data.system?.autoMode ?? true);
      setLastUpdate(data.system?.lastUpdate ?? '');
    },
    (error) => {
      console.error('===== FIREBASE ERROR =====');
      console.error(error);
    }
  );
  

  return () => unsubscribe();
}, []);

useEffect(() => {
  const cropsRef = ref(database, 'irrigation/crops');

  const unsubscribe = onValue(
    cropsRef,
    (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        console.log('⚠️ Chưa có thông số cây trồng');
        return;
      }

      console.log('Thông số cây trồng:', data);
setCropSettings(prev => ({
  ...prev,
  ...(data.lettuce
    ? {
        lettuce: {
          ...prev.lettuce,
          ...data.lettuce,
          name: 'Xà lách'
        }
      }
    : {}),
  ...(data.tomato
    ? {
        tomato: {
          ...prev.tomato,
          ...data.tomato,
          name: 'Cà chua'
        }
      }
    : {})
}));
    },
    (error) => {
      console.error(
        '❌ Lỗi đọc thông số cây trồng:',
        error
      );
    }
  );

  return () => unsubscribe();
}, []);

const currentCrop = cropSettings[selectedCrop];

const saveIrrigationLog = async (status, reason) => {
  try {
    const now = new Date();

    const log = {
      timestamp: now.toISOString(),

      date: now.toLocaleDateString('vi-VN'),
      time: now.toLocaleTimeString('vi-VN'),

      crop: currentCrop?.name || 'Chưa xác định',

      soilMoisture: moisture,
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainProbability: weather.rainProbability,

      battery: battery,

      status: status,
      reason: reason
    };

    const logsRef = ref(
      database,
      'irrigation/logs'
    );

    const newLogRef = push(logsRef);

    await update(newLogRef, log);

    console.log('📝 ĐÃ TẠO LOG:', log);

  } catch (error) {
    console.error(
      '❌ LỖI TẠO LOG:',
      error
    );
  }
};
  // =========================================================
// LOGIC TƯỚI TỰ ĐỘNG - NHIỀU ĐIỀU KIỆN
// =========================================================
useEffect(() => {

const checkAutomaticIrrigation = async () => {

  if (!autoMode) {
      console.log(
        '🔒 Chế độ MANUAL → Không tự động điều khiển bơm'
      );
      return;
    }

    if (!weather.loaded) {
      console.log(
        '⏳ Chưa có dữ liệu thời tiết'
      );
      return;
    }

    if (!currentCrop) {
      console.log(
        'Chưa có thông số cây trồng'
      );
      return;
    }

    // ================================
    // ĐIỀU KIỆN 1: ĐỘ ẨM ĐẤT
    // ================================
    const soilIsDry =
      moisture < currentCrop.minMoisture;

    // ================================
    // ĐIỀU KIỆN 2: NHIỆT ĐỘ
    // ================================
    const temperatureIsSuitable =
      weather.temperature >=
        currentCrop.minTemperature &&
      weather.temperature <=
        currentCrop.maxTemperature;

    // ================================
    // ĐIỀU KIỆN 3: KHÔNG CÓ MƯA
    // ================================
    const rainIsLikely =
      weather.rainProbability >= 60;

    const noRain =
      !currentCrop.skipRain ||
      !rainIsLikely;

    // ================================
    // ĐIỀU KIỆN 4: KHUNG GIỜ
    // ================================
    const now = new Date();

    const currentTime =
      now.toTimeString().slice(0, 5);

    const isTimeAllowed =
      currentTime >= currentCrop.startTime &&
      currentTime <= currentCrop.endTime;

    // ================================
    // ĐIỀU KIỆN 5: PIN
    // ================================
    const batteryEnough = true;

    // ================================
    // TỔNG HỢP
    // ================================
    const shouldWater =
      soilIsDry &&
      temperatureIsSuitable &&
      noRain &&
      isTimeAllowed &&
      batteryEnough;

    console.log('================================');
    console.log('QUYẾT ĐỊNH TƯỚI TỰ ĐỘNG');

    console.log(
      'Cây:',
      currentCrop.name
    );

    console.log(
      '1️⃣ Độ ẩm:',
      moisture,
      '<',
      currentCrop.minMoisture,
      '→',
      soilIsDry
    );

    console.log(
      '2️⃣ Nhiệt độ:',
      weather.temperature,
      '°C',
      '→',
      temperatureIsSuitable
    );

    console.log(
      '3️⃣ Khả năng mưa:',
      weather.rainProbability,
      '%',
      '→ Không mưa:',
      noRain
    );

    console.log(
      '4️⃣ Khung giờ:',
      currentTime,
      '→',
      isTimeAllowed
    );

    console.log(
      '5️⃣ Pin:',
      battery,
      '%',
      '→',
      batteryEnough
    );

    console.log(
      '👉 KẾT QUẢ:',
      shouldWater
        ? '💧 BẬT BƠM'
        : '⛔ KHÔNG TƯỚI'
    );

    console.log('================================');

    // ================================
    // BẬT BƠM
    // ================================
    if (shouldWater && !pumpOn) {

      console.log(
        '💧 Điều kiện đạt → BẬT BƠM'
      );

      await update(
        ref(database, 'irrigation/pump'),
        {
          status: true,
          mode: 'AUTO'
        }
      );

await saveIrrigationLog(
  'ON',
  'Tất cả điều kiện tưới đều đạt'
);

      return;
    }

    // ================================
    // TẮT BƠM
    // ================================
    const soilIsWetEnough =
  moisture >= currentCrop.maxMoisture;

const shouldStopWatering =
  soilIsWetEnough ||
  !temperatureIsSuitable ||
  !noRain ||
  !isTimeAllowed ||
  !batteryEnough;
if (shouldStopWatering && pumpOn) {
  await update(ref(database, 'irrigation/pump'), {
    status: false,
    mode: 'AUTO',
  });

  await saveIrrigationLog(
    'OFF',
    soilIsWetEnough
      ? 'Độ ẩm đất đã đạt ngưỡng tắt bơm'
      : 'Điều kiện tưới không còn phù hợp'
  );

  return;
}

    console.log(
      'ℹ️ Trạng thái bơm không thay đổi'
    );
  };

  checkAutomaticIrrigation();

}, [
  moisture,
  battery,
  autoMode,
  pumpOn,
  weather.temperature,
  weather.rainProbability,
  weather.loaded,
  currentCrop
]);
  // =========================================================
  // DỮ LIỆU LỊCH SỬ ĐỘ ẨM - TẠM THỜI
  // Sau này có thể lấy trực tiếp từ Firebase
  // =========================================================
  const initialHistory = [
    { time: '08:00', moisture: 64 },
    { time: '09:00', moisture: 60 },
    { time: '10:00', moisture: 55 },
    { time: '11:00', moisture: 48 },
    { time: '12:00', moisture: 42 },
    { time: '13:00', moisture: 38 },
    { time: '14:00', moisture: 46 },
    { time: '15:00', moisture: 57 },
  ];

  // =========================================================
  // TRẠNG THÁI HỆ THỐNG
  // =========================================================
  const status = useMemo(() => {
    if (moisture < minMoisture) {
      return {
        text: 'Đất đang khô',
        type: 'warning'
      };
    }

    if (moisture >= maxMoisture) {
      return {
        text: 'Đất đủ ẩm',
        type: 'success'
      };
    }

    return {
      text: 'Độ ẩm ổn định',
      type: 'info'
    };
  }, [moisture, minMoisture, maxMoisture]);

  // =========================================================
// TÍNH TOÁN TIẾT KIỆM NƯỚC
// =========================================================

const waterSaved =
  rainSkipCount * WATER_SAVED_PER_SKIP;

const waterSavingPercent =
  waterWithoutSmart > 0
    ? Math.round(
        (waterSaved / waterWithoutSmart) * 100
      )
    : 0;

  // =========================================================
  // ĐIỀU KHIỂN MÁY BƠM
  // =========================================================
const handleSetAutoMode = async (value) => {
  try {
    setAutoMode(value);

    // Cập nhật chế độ hệ thống
    await update(ref(database, 'irrigation/system'), {
      autoMode: value
    });

    // Nếu chuyển sang MANUAL
    if (!value) {
      await update(ref(database, 'irrigation/pump'), {
        mode: 'MANUAL'
      });

      console.log(
        '🔧 Đã chuyển sang chế độ MANUAL'
      );
    }

    // Nếu chuyển sang AUTO
    if (value) {
      await update(ref(database, 'irrigation/pump'), {
        mode: 'AUTO'
      });

      console.log(
        '🤖 Đã chuyển sang chế độ AUTO'
      );
    }

  } catch (error) {
    console.error(
      '❌ Lỗi cập nhật chế độ:',
      error
    );
  }
};

const handleMinMoistureChange = async (value) => {
  const v = Number(value);

  setMinMoisture(v);

  setCropSettings((prev) => ({
    ...prev,
    [selectedCrop]: {
      ...prev[selectedCrop],
      minMoisture: v,
    },
  }));

  try {
    await update(
      ref(database, `irrigation/crops/${selectedCrop}`),
      { minMoisture: v }
    );
  } catch (error) {
    console.error('Lỗi cập nhật ngưỡng bật bơm:', error);
  }
};

const handleMaxMoistureChange = async (value) => {
  const v = Number(value);

  setMaxMoisture(v);

  setCropSettings((prev) => ({
    ...prev,
    [selectedCrop]: {
      ...prev[selectedCrop],
      maxMoisture: v,
    },
  }));

  try {
    await update(
      ref(database, `irrigation/crops/${selectedCrop}`),
      { maxMoisture: v }
    );
  } catch (error) {
    console.error('Lỗi cập nhật ngưỡng tắt bơm:', error);
  }
};

const togglePump = async () => {
  try {
    const newStatus = !pumpOn;

    await update(ref(database, 'irrigation/pump'), {
      status: newStatus,
      mode: 'MANUAL'
    });

    console.log(
      '🔧 Điều khiển bơm MANUAL:',
      newStatus ? 'BẬT' : 'TẮT'
    );
  } catch (error) {
    console.error(
      '❌ Lỗi cập nhật máy bơm:',
      error
    );
  }
};


// =========================================================
// MÔ PHỎNG CẢM BIẾN
// TẠM THỜI - SAU KHI FIREBASE HOẠT ĐỘNG SẼ BỎ
// =========================================================
const simulateMoisture = () => {
  const next = Math.max(
    20,
    Math.min(
      90,
      Math.round(
        moisture + (Math.random() * 16 - 8)
      )
    )
  );

  setMoisture(next);

  if (autoMode) {
    if (
      next < minMoisture &&
      battery > 20
    ) {
      setPumpOn(true);
    }

    if (next >= maxMoisture) {
      setPumpOn(false);
    }
  }
};


// =========================================================
// LẤY THỜI TIẾT THẬT TỪ OPEN-METEO
// KHU VỰC MÔ HÌNH: SƠN LA
// =========================================================
const simulateWeather = async () => {
  console.log('🌦️ Đang lấy thời tiết Sơn La...');

  try {
    const latitude = 21.325;
    const longitude = 103.918;

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code` +
      `&hourly=precipitation_probability` +
      `&forecast_days=1` +
      `&timezone=Asia%2FBangkok`;

    console.log(
      '🌐 Weather API:',
      url
    );

    const response = await fetch(url);

    console.log(
      '📡 Weather response:',
      response.status
    );

    if (!response.ok) {
      throw new Error(
        `Weather API lỗi: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      '===== WEATHER DATA ====='
    );

    console.log(data);

    const temperature =
      data.current?.temperature_2m ?? 0;

    const humidity =
      data.current?.relative_humidity_2m ?? 0;

    const weatherCode =
      data.current?.weather_code ?? 0;

    const currentHour =
      new Date().getHours();

    // const rainProbability =
    //   data.hourly
    //     ?.precipitation_probability?.[currentHour] ?? 0;

    const rainProbability =
    data.hourly?.precipitation_probability?.[currentHour] ?? 0;


    let condition = 'Trời quang';

    if (weatherCode >= 95) {
      condition = 'Dông';
    } else if (weatherCode >= 80) {
      condition = 'Mưa rào';
    } else if (weatherCode >= 60) {
      condition = 'Mưa';
    } else if (weatherCode >= 45) {
      condition = 'Sương mù';
    } else if (weatherCode >= 1) {
      condition = 'Có mây';
    }

    const rainExpected =
      rainProbability >= 60;

    setWeather({
      temperature: Math.round(temperature),
      humidity: Math.round(humidity),
      rainProbability,
      condition,
      rainExpected,
      loaded: true
    });

    console.log(
      '✅ WEATHER LOADED = TRUE'
    );

    console.log(
      '🌦️ Thời tiết Sơn La:',
      {
        temperature,
        humidity,
        rainProbability,
        condition,
        rainExpected
      }
    );

  } catch (error) {
    console.error(
      '❌ LỖI THỜI TIẾT:',
      error
    );
  }
};


// =========================================================
// TỰ ĐỘNG CẬP NHẬT THỜI TIẾT
// =========================================================
useEffect(() => {

  simulateWeather();

  const weatherInterval = setInterval(() => {
    simulateWeather();
  }, 10 * 60 * 1000);

  return () => {
    clearInterval(weatherInterval);
  };

}, []);

 
  // =========================================================
  // MENU
  // =========================================================
const nav = [
  ['dashboard', 'Tổng quan', Gauge],
  ['monitoring', 'Độ ẩm đất', Droplets],
  ['pump', 'Điều khiển bơm', Power],
  // ['energy', 'Năng lượng', Sun],
  ['crops', 'Cấu hình cây trồng', Leaf],
  ['logs', 'Nhật ký tưới', ClipboardList],
  // ['experiment', 'Dữ liệu thực nghiệm', ClipboardPen],
  // ['settings', 'Cài đặt', SettingsIcon],
];

  // =========================================================
  // GIAO DIỆN CHÍNH
  // =========================================================
  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>

        <div className="brand">
          <div className="brand-icon">
            <Leaf size={22} />
          </div>

          <div>
            <strong>Smart Irrigation</strong>
            <span>Hệ thống tưới tự động</span>
          </div>

          <button
            className="close-mobile"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? 'active' : ''}
onClick={() => {
  navigate(pageToPath[id]);
  setMenuOpen(false);
}}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="connection">
            <span className="dot" />
            Thiết bị đang kết nối
          </div>

          <small>ESP8266 • Online</small>
        </div>

      </aside>

      {/* OVERLAY MOBILE */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={23} />
          </button>

          <div>
            <h1>
              {nav.find((n) => n[0] === page)?.[1]}
            </h1>

            {/* <p>
              Giám sát và điều khiển hệ thống tưới
            </p> */}
          </div>

          <div className="top-status">
            <span className="dot" />
            Online
          </div>

        </header>

        <div className="content">

          {/* =====================================================
              TRANG TỔNG QUAN
          ===================================================== */}
          {page === 'dashboard' && (
            <Dashboard
              moisture={moisture}
              minMoisture={minMoisture}
              maxMoisture={maxMoisture}
              soil1={soil1}
              soil2={soil2}
              temperature={temperature}
              humidity={humidity}
              waterLevel={waterLevel}
              battery={battery}
              solarPower={solarPower}
              weather={weather}
              waterUsed={waterUsed}
              waterSaved={waterSaved}
              waterSavingPercent={waterSavingPercent}
              pumpOn={pumpOn}
              autoMode={autoMode}
              status={status}
              lastUpdate={lastUpdate}
              simulateMoisture={simulateMoisture}
              simulateWeather={simulateWeather}
              rainSkipCount={rainSkipCount}
            />
          )}

          {/* =====================================================
              TRANG GIÁM SÁT
          ===================================================== */}
  
          {page === 'monitoring' && (
              <SoilMoisture
                moisture={moisture}
                soil1={soil1}
                soil2={soil2}
                history={moistureHistory}
                status={status}
                onRefresh={simulateMoisture}
                minMoisture={minMoisture}
                maxMoisture={maxMoisture}
            />
          )}


          {/* =====================================================
              TRANG ĐIỀU KHIỂN BƠM
          ===================================================== */}
          {page === 'pump' && (
          <PumpControl
            pumpOn={pumpOn}
            autoMode={autoMode}
            setAutoMode={handleSetAutoMode}
            togglePump={togglePump}
            moisture={moisture}
            temperature={temperature}
            battery={battery}
            weather={weather}
            currentCrop={currentCrop}
            simulateWeather={simulateWeather}
          />
          )}

          {/* =====================================================
              TRANG NĂNG LƯỢNG
          ===================================================== */}
          {page === 'energy' && (
            <Energy
              battery={battery}
              solarPower={solarPower}
            />
          )}

{page === 'crops' && (
  <Crops
    selectedCrop={selectedCrop}
    setSelectedCrop={setSelectedCrop}
    cropSettings={cropSettings}
    setCropSettings={setCropSettings}
  />
)}
            {page === 'logs' && (
  <IrrigationLogs />
)}
{page === 'experiment' && (
  <ExperimentLogs />
)}

          {/* =====================================================
              TRANG CÀI ĐẶT
          ===================================================== */}
{page === 'settings' && (
  <Settings
    autoMode={autoMode}
    setAutoMode={handleSetAutoMode}
    battery={battery}
    minBattery={minBattery}
    setMinBattery={setMinBattery}
    esp32Connected={esp32Connected}
    firebaseConnected={firebaseConnected}
  />
)}

        </div>

      </main>
    </div>
  );
}

// ============================================================
// RENDER APP
// ============================================================

createRoot(
  document.getElementById('root')
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);