import React, { useEffect, useState } from 'react';
import {
  Leaf,
  Thermometer,
  Droplets,
  CloudRain,
  Clock,
  Save
} from 'lucide-react';



import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';

export default function Crops({
  selectedCrop,
  setSelectedCrop,
  cropSettings,
  setCropSettings
}) {

  
  useEffect(() => {
  const cropsRef = ref(database, 'irrigation/crops');

  const unsubscribe = onValue(
    cropsRef,
    (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        console.log(
          '⚠️ Chưa có dữ liệu cây trồng trên Firebase'
        );
        return;
      }

      console.log(
        'Dữ liệu cây trồng từ Firebase:',
        data
      );

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

      setFirebaseLoaded(true);
    },
    (error) => {
      console.error(
        '❌ Lỗi đọc dữ liệu cây trồng:',
        error
      );
    }
  );

  return () => unsubscribe();
}, []);

const currentCrop = cropSettings[selectedCrop];

  const handleChange = (field, value) => {
    setCropSettings(prev => ({
      ...prev,
      [selectedCrop]: {
        ...prev[selectedCrop],
        [field]: value
      }
    }));
  };

const handleSave = async () => {
  try {
    await update(
      ref(
        database,
        `irrigation/crops/${selectedCrop}`
      ),
      currentCrop
    );

    console.log(
      '✅ Đã lưu thông số cây vào Firebase:',
      currentCrop
    );

    alert(
      `Đã lưu thông số cho cây ${currentCrop.name}`
    );

  } catch (error) {
    console.error(
      '❌ Lỗi lưu thông số cây:',
      error
    );

    alert(
      'Không thể lưu thông số cây.'
    );
  }
};
  return (
    <>
      {/* <section className="page-intro">
        <h2>Cấu hình cây trồng</h2>

        <p>
          Thiết lập các thông số mẫu để hệ thống xác định
          điều kiện tưới phù hợp cho từng loại cây.
        </p>
      </section> */}

      <section className="crop-config-grid">

        {/* CHỌN CÂY */}
        <Card className="crop-selector-card">
          <CardHeader
            icon={Leaf}
            title="Loại cây trồng: Chọn loại cây cần cấu hình"
            // subtitle="Chọn loại cây cần cấu hình"
          />

          <div className="crop-selector">

            <button
              className={
                selectedCrop === 'lettuce'
                  ? 'crop-option active'
                  : 'crop-option'
              }
              onClick={() => setSelectedCrop('lettuce')}
            >
              <Leaf size={22} />
              <div>
                <strong>Xà lách</strong>
                <span> Rau ăn lá</span>
              </div>
            </button>

            <button
              className={
                selectedCrop === 'tomato'
                  ? 'crop-option active'
                  : 'crop-option'
              }
              onClick={() => setSelectedCrop('tomato')}
            >
              <Leaf size={22} />
              <div>
                <strong>Cà chua</strong>
                <span> Cây rau quả</span>
              </div>
            </button>

          </div>
        </Card>


        {/* THÔNG SỐ */}
        <Card>
          <CardHeader
            icon={Leaf}
            title={`Thông số mẫu — ${currentCrop.name}`}
            // subtitle="Các điều kiện sử dụng để quyết định tưới"
          />

          <div className="form-grid">

            {/* ĐỘ ẨM */}
            <div className="form-group">

              <label>
                <Droplets size={16} />
                Độ ẩm đất tối thiểu (%)
              </label>

              <input
                type="number"
                value={currentCrop.minMoisture}
                onChange={e =>
                  handleChange(
                    'minMoisture',
                    Number(e.target.value)
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                <Droplets size={16} />
                Độ ẩm đất tối đa (%)
              </label>

              <input
                type="number"
                value={currentCrop.maxMoisture}
                onChange={e =>
                  handleChange(
                    'maxMoisture',
                    Number(e.target.value)
                  )
                }
              />

            </div>


            {/* NHIỆT ĐỘ */}
            <div className="form-group">

              <label>
                <Thermometer size={16} />
                Nhiệt độ tối thiểu (°C)
              </label>

              <input
                type="number"
                value={currentCrop.minTemperature}
                onChange={e =>
                  handleChange(
                    'minTemperature',
                    Number(e.target.value)
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                <Thermometer size={16} />
                Nhiệt độ tối đa (°C)
              </label>

              <input
                type="number"
                value={currentCrop.maxTemperature}
                onChange={e =>
                  handleChange(
                    'maxTemperature',
                    Number(e.target.value)
                  )
                }
              />

            </div>


            {/* THỜI GIAN */}
            <div className="form-group">

              <label>
                <Clock size={16} />
                Giờ bắt đầu tưới
              </label>

              <input
                type="time"
                value={currentCrop.startTime}
                onChange={e =>
                  handleChange(
                    'startTime',
                    e.target.value
                  )
                }
              />

            </div>


            <div className="form-group">

              <label>
                <Clock size={16} />
                Giờ kết thúc tưới
              </label>

              <input
                type="time"
                value={currentCrop.endTime}
                onChange={e =>
                  handleChange(
                    'endTime',
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* MƯA
          <div className="rain-setting">

            <div>
              <strong>
                <CloudRain size={18} />
                   Không tưới khi có mưa: 
              </strong>
              <span>
                
              </span>
              <span>
                 Hệ thống sẽ không bật bơm nếu dự báo
                cho thấy khả năng mưa cao.
              </span>
            </div>

            <button
              className={
                `switch ${
                  currentCrop.skipRain
                    ? 'checked'
                    : ''
                }`
              }
              onClick={() =>
                handleChange(
                  'skipRain',
                  !currentCrop.skipRain
                )
              }
            >
              <span />
            </button>

          </div> */}


          {/* LƯU */}
          {/* <button
            className="primary"
            onClick={handleSave}
          >
            <Save size={17} />
            Lưu thông số cây
          </button> */}

        </Card>

      </section>


      {/* TÓM TẮT */}
      <section style={{ marginTop: '18px' }}>

        <Card>

          <CardHeader
            icon={Leaf}
            title="Tóm tắt điều kiện tưới"
            // subtitle="Các điều kiện hiện đang được cấu hình"
          />

          <div className="grid-2">

            <div className="rule-box">

              <span>
                Độ ẩm đất
              </span>

              <strong>
                {currentCrop.minMoisture}%
                {' → '}
                {currentCrop.maxMoisture}%
              </strong>

            </div>


            <div className="rule-box">

              <span>
                Nhiệt độ
              </span>

              <strong>
                {currentCrop.minTemperature}°C
                {' → '}
                {currentCrop.maxTemperature}°C
              </strong>

            </div>


            <div className="rule-box">

              <span>
                Thời gian tưới
              </span>

              <strong>
                {currentCrop.startTime}
                {' → '}
                {currentCrop.endTime}
              </strong>

            </div>


            <div className="rule-box">

              <span>
                Khi có mưa
              </span>

              <strong>
                {currentCrop.skipRain
                  ? 'Không tưới'
                  : 'Vẫn cho phép tưới'}
              </strong>

            </div>

          </div>

        </Card>

      </section>
    </>
  );
}